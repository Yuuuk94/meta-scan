---
name: deploy
description: Merge meta-scan's already-reviewed work into main and deploy — auto-detects an open PR targeting main (a hotfix/* PR opened by the tdd-issue-loop pipeline, or nothing yet, in which case this skill cuts a release/x.y.z branch off dev and opens that PR itself), confirms with the user before merging, then back-merges main into dev, and closes every open status:done issue that's now actually shipped in main. This is the *only* skill that merges into main or bumps package.json versions — tdd-issue-loop stops at PR-open and never touches main. Use when the user says things like "배포해줘", "머지해줘", "release 만들어줘", "hotfix 배포", or asks to ship what's ready to production. Rationale/decision log: docs/harness/deploy-skill.md.
---

# deploy

You (the main session) run this directly — no subagent. It's the counterpart to `tdd-issue-loop`:
that skill gets work to an open PR against `main` (hotfix) or `dev` (everything else) and stops;
this skill takes it from an open-PR-against-main state through to actually landing on `main`,
syncing `dev`, and cleaning up issue hygiene. Full rationale: `docs/harness/deploy-skill.md`.

**Never merge or bump a version without the user's explicit go-ahead for that specific action** —
this repo's git policy (no autonomous commit/push) still applies; being invoked doesn't itself
authorize the merge, only the detection/preparation up to that point.

## 1. Detect what's waiting

```
gh pr list --base main --state open --json number,headRefName,title,body
```

- **Exactly one PR** → that's the target. Note whether `headRefName` starts with `hotfix/` (skip
  straight to step 3) or something else (unexpected — confirm with the user before proceeding).
- **More than one** → ask the user (`AskUserQuestion`) which one to deploy now; don't guess by
  recency. Only one deploy happens per invocation.
- **None** → check whether there's unreleased work sitting in `dev`:
  ```
  git fetch origin
  git log origin/main..origin/dev --oneline
  ```
  - **Empty** → nothing to deploy. Tell the user and stop.
  - **Non-empty** → this is the release path. Go to step 2.

## 2. Release path — cut the branch yourself

Only reached when there's no PR yet and `dev` is ahead of `main`.

1. Ask the user the target version (`AskUserQuestion`, e.g. "release 버전을 몇으로 할까요?
   (semver, 예: 0.3.0)") — this repo's monorepo-single-version scheme
   (`docs/case-study/git-branching-strategy.md`) means one number covers all three
   `package.json`s. Don't guess a bump level (patch/minor/major) yourself; the user picks the
   literal number.
2. ```
   git checkout dev && git pull
   git checkout -b release/<version>
   ```
3. Bump all three `package.json` files (root, `packages/meta-scan-api`,
   `packages/meta-scan-front`) to `<version>` and commit:
   ```
   chore(release): bump version to <version>
   ```
   No git tag — this repo doesn't use tags currently (confirmed 2026-09-08, see rationale doc).
4. Sanity-check the bundle before opening the PR — this branch hasn't been reviewed as a whole the
   way an individual TDD-loop PR has, only feature-by-feature as each landed in `dev`:
   ```
   pnpm -r lint
   pnpm --filter meta-scan-api exec vitest run
   pnpm --filter meta-scan-front exec jest
   pnpm -r build
   ```
   If anything fails, stop and report it — don't open the PR with a known-broken release branch.
5. Push and open the PR:
   ```
   git push -u origin release/<version>
   gh pr create --base main --head release/<version> \
     --title "release: <version>" \
     --body "Release <version>. Bundles: <list the issues/PRs going out, from dev..main log>"
   ```

## 3. Confirm, then merge

Before merging (hotfix or release), tell the user what's about to happen (source branch, target
`main`, and for a release the version + bundled issues) and get an explicit go-ahead —
`gh pr merge <number> --merge` only after that, matching this repo's merge-commit convention (not
squash/rebase, same as its existing `main`/`dev` merge history).

## 4. Close the shipped issue(s) immediately

Parse `Closes #<n>` from the merged PR's body and set `status:done` on each (`gh issue edit <n>
--remove-label "status:in-review" --add-label "status:done"`) if not already set. GitHub itself
auto-closes these on merge to `main` (the default branch) — that's expected, not something to
undo (see `docs/harness/tdd-issue-loop.md`'s "이슈 클로즈 시점" row).

## 5. Back-merge main → dev

Always, regardless of hotfix vs release — a release branch's own commits (like the version bump)
and a hotfix's fix both need to reach `dev` or the next branch cut from `dev` silently regresses:

```
git checkout dev && git pull
git merge origin/main --no-edit
git push origin dev
```

## 6. General issue cleanup

This is the same pass regardless of which path (hotfix/release) got you here — after the
back-merge, `dev` and `main` should be equal:

```
git log origin/main..origin/dev --oneline
```

If that's empty (expected), list every open `status:done` issue and close each with a comment
noting what shipped it:

```
gh issue list --state open --label "status:done" --json number,title
gh issue close <n> --comment "<version 또는 hotfix PR 링크>로 main에 배포 완료."
```

(This also naturally covers a hotfix's own issue if it wasn't already auto-closed in step 4 for
some reason, and sweeps up any older `status:done` issues that piled up open — see
`docs/harness/tdd-issue-loop.md`'s "이슈 클로즈 시점" row for why they were left open until now.)

If `git log origin/main..origin/dev` is *not* empty after the back-merge, something's wrong
(the merge/push in step 5 likely didn't actually happen) — stop and report instead of guessing
which issues are safe to close.

## 7. Report

Tell the user: what got merged (hotfix issue # or release version + bundled issues), the
back-merge status, and which issues got closed. This skill never loops — one deploy per
invocation, same as `tdd-issue-loop`'s one-issue-to-PR-open-per-invocation shape.
