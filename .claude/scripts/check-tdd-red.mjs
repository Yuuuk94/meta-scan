#!/usr/bin/env node
// TDD red 단계 증거 검사 — qa-backend/qa-front가 실행한다.
//   usage: node .claude/scripts/check-tdd-red.mjs <meta-scan-api|meta-scan-front> <base-ref>
//
// <base-ref>..HEAD 커밋 중 해당 패키지에서 테스트 파일(*.test.ts(x))만 건드린 커밋을 "red 커밋"으로
// 보고, 각 red 커밋 시점으로 체크아웃해 그 테스트가 실제로 실패하는지 확인한다.
//   - red 커밋이 하나도 없음          → 실패 (테스트와 구현을 한 커밋에 섞었거나 테스트가 없음)
//   - red 커밋 시점에 테스트가 통과함  → 실패 (구현 뒤에 쓴 테스트)
// 끝나면 원래 브랜치로 돌아온다.
import { execFileSync, spawnSync } from "node:child_process";

const [pkg, base] = process.argv.slice(2);
const RUNNERS = {
  "meta-scan-api": ["vitest", "run"],
  "meta-scan-front": ["jest"],
};
if (!RUNNERS[pkg] || !base) {
  console.error("usage: check-tdd-red.mjs <meta-scan-api|meta-scan-front> <base-ref>");
  process.exit(2);
}

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const prefix = `packages/${pkg}/`;
const isTest = (f) => /\.test\.tsx?$/.test(f);

if (git("status", "--porcelain")) {
  console.error("작업 트리가 깨끗하지 않습니다 — 커밋/정리 후 다시 실행하세요.");
  process.exit(2);
}

const original = git("branch", "--show-current") || git("rev-parse", "HEAD");
const commits = git("rev-list", "--reverse", `${base}..HEAD`).split("\n").filter(Boolean);

const reds = [];
for (const sha of commits) {
  const files = git("diff-tree", "--no-commit-id", "--name-only", "--diff-filter=AM", "-r", sha)
    .split("\n")
    .filter((f) => f.startsWith(prefix));
  if (files.length && files.every(isTest)) reds.push({ sha, files });
}

if (!reds.length) {
  console.log(`FAIL  ${pkg}: ${base}..HEAD에 테스트 파일만 담은 red 커밋이 없습니다.`);
  process.exit(1);
}

let ok = true;
try {
  for (const { sha, files } of reds) {
    git("checkout", "-q", sha);
    const rel = files.map((f) => f.slice(prefix.length));
    const run = spawnSync("pnpm", ["--filter", pkg, "exec", ...RUNNERS[pkg], ...rel], {
      encoding: "utf8",
    });
    const subject = git("log", "-1", "--format=%s", sha);
    if (run.status === 0) {
      ok = false;
      console.log(`FAIL  ${sha.slice(0, 7)} ${subject} — 이 시점에 테스트가 이미 통과함 (red 아님)`);
    } else {
      console.log(`OK    ${sha.slice(0, 7)} ${subject} — 이 시점에 테스트 실패 확인`);
    }
  }
} finally {
  git("checkout", "-q", original);
}

process.exit(ok ? 0 : 1);
