#!/usr/bin/env node
// PreToolUse(Bash) hook — CLAUDE.md "브랜치 사용 원칙"을 문장이 아니라 기계로 강제한다.
//   - dev/main 위에서 git commit      → deny (feat/*·hotfix/* 브랜치에서 작업)
//   - main으로 git push               → deny (main 반영은 PR merge로만)
//   - dev로 git push                  → ask  (deploy 스킬의 main→dev 백머지만 정당)
//   - gh pr merge                     → ask  (merge는 매번 사람 승인)
import { execFileSync } from "node:child_process";

const PROTECTED = ["main", "dev"];

const input = JSON.parse(await new Promise((resolve) => {
  let data = "";
  process.stdin.on("data", (c) => (data += c));
  process.stdin.on("end", () => resolve(data || "{}"));
}));

const command = input.tool_input?.command ?? "";
const cwd = input.cwd ?? process.cwd();

function currentBranch() {
  try {
    return execFileSync("git", ["branch", "--show-current"], { cwd, encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function decide(decision, reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: decision,
      permissionDecisionReason: reason,
    },
  }));
  process.exit(0);
}

// `git checkout x && git commit`처럼 한 줄 안에서 브랜치가 바뀌는 경우를 따라가기 위해
// 세그먼트 단위로 순서대로 본다.
let branch = currentBranch();
const segments = command.split(/&&|\|\||;|\|/).map((s) => s.trim().split(/\s+/));

for (const tokens of segments) {
  const git = tokens.indexOf("git");
  const sub = git >= 0 ? tokens[git + 1] : undefined;
  const args = git >= 0 ? tokens.slice(git + 2) : [];

  if (sub === "checkout" || sub === "switch") {
    const target = args.filter((a) => !a.startsWith("-")).pop();
    if (target) branch = target;
    continue;
  }

  if (sub === "commit" && PROTECTED.includes(branch)) {
    decide("deny",
      `'${branch}' 브랜치에 직접 커밋할 수 없습니다. dev에서 feat/* (긴급 수정은 main에서 hotfix/*) ` +
      `브랜치를 새로 따서 커밋하세요. (CLAUDE.md "브랜치 사용 원칙")`);
  }

  if (sub === "push") {
    const refs = args.filter((a) => !a.startsWith("-")).slice(1);
    const targets = refs.length
      ? refs.map((r) => r.split(":").pop())
      : [branch];
    if (targets.includes("main")) {
      decide("deny", "main으로 직접 push할 수 없습니다. main 반영은 deploy 스킬의 PR merge로만 합니다.");
    }
    if (targets.includes("dev")) {
      decide("ask", "dev로 직접 push합니다. deploy 스킬의 main→dev 백머지가 맞는지 확인하세요.");
    }
  }

  if (tokens[0] === "gh" && tokens[1] === "pr" && tokens[2] === "merge") {
    decide("ask", "PR merge는 매번 사람 승인이 필요합니다.");
  }
}

process.exit(0);
