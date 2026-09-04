---
name: tdd-issue-loop
description: Process meta-scan's GitHub Issues backlog through the issue-based TDD loop — dev-interview → (dev-backend/dev-front as needed) → (qa-backend/qa-front as needed) → PR. Interview stages run fully sequentially with a human confirmation gate each time; once an issue's spec is confirmed, its dev/qa automatic stages run in the background (no gate) while the skill immediately starts interviewing the next issue. The dev/qa queue itself processes at most one issue to PR-open per invocation and will not start a second issue's dev/qa until the first issue's PR is actually merged by the user (not just opened) — see docs/harness/tdd-issue-loop.md's 2026-08-31 update. Use when the user says things like "이슈 처리해줘", "TDD 루프 돌려", "백로그 인터뷰하자", or names a specific issue number to push through the pipeline. One-shot per invocation — does not use /loop or any polling; consumes whatever's in the queue right now and stops.
---

# tdd-issue-loop

Five purpose-built subagents — `dev-interview`, `dev-backend`, `dev-front`, `qa-backend`,
`qa-front` (`.claude/agents/*.md`) — chained by label state on GitHub Issues. This skill is the
orchestration script for you (the main session); it does not do the implementation work itself.
Full design rationale, the decision table, and the flowchart live in
`docs/harness/tdd-issue-loop.md` — read it if you haven't already; this file is the runbook, not
a restatement of the "why."

**The only human gate is the interview.** Once `dev-interview` gets a confirmed spec and assigns
package labels, the dev→qa chain for that issue runs to completion (PR or `status:blocked`)
without asking. Don't invent extra gates that aren't in the design doc, and don't skip the
interview gate even if the issue looks simple.

## 0. Take stock of the queue

```
gh issue list --label "status:needs-interview" --state open --json number,title,labels,createdAt
gh issue list --label "status:ready-for-dev" --state open --json number,title,labels,createdAt
```
(Unlabeled open issues count as `status:needs-interview` too — check for those separately if the
label queries come back thin.)

Order both queues by `priority:high` → `priority:medium` → `priority:low` → unlabeled, and within
a tier by issue number (oldest first). These are two independent queues you work concurrently
(see below), not one merged list.

If both queues are empty and nothing is mid-flight, tell the user there's nothing to process and
stop — don't spin looking for work.

## 1. Interview queue — fully sequential, gated

Process `status:needs-interview` issues one at a time, in priority order:

1. Spawn `dev-interview` (Agent tool, `subagent_type: "dev-interview"`) with the issue number.
2. It runs its own `AskUserQuestion` rounds directly with the user — you don't relay questions for
   it, it asks them itself. Wait for it to report back.
3. When it reports a confirmed spec (issue now `status:ready-for-dev` with labels assigned): tell
   the user briefly what got confirmed and which package(s), then **immediately hand that issue's
   number to step 2 (dev/qa queue) and move on to the next issue in the interview queue** — don't
   wait for the dev/qa chain to finish before starting the next interview. This pipelining (human
   stays busy with interviews, machine stays busy with dev/qa) is the whole point of the "loop"
   name — see `docs/harness/tdd-issue-loop.md`'s "스킬 진입점" section.
4. If `dev-interview` reports it's stuck (genuinely ambiguous scope it couldn't resolve even after
   asking) rather than confirmed, surface that to the user as its own question — don't guess a
   resolution yourself, and don't leave the issue in limbo without telling the user.

## 2. Dev/qa queue — automatic, one issue at a time, gated on merge (not just PR-open)

**Concurrency: exactly one issue in this queue's active pipeline at any moment**, regardless of
which packages it touches (front-only, api-only, or both all share the same slot) — no worktree
isolation exists yet, so two issues can't safely have different branches checked out in this
working directory at once, and `meta-scan-api` tests launch real Puppeteer/chrome-launcher
processes that shouldn't run concurrently. If an issue arrives at this queue while another is
still running, it waits its turn (still priority-ordered).

**Before spawning `dev-backend`/`dev-front` for a new issue, check that no PR from this pipeline
is still open/unmerged** (`gh pr list --state open --json headRefName,title` — anything whose
branch is `feat/<n>-*`). If one is, **stop the dev/qa queue here for this invocation** — do not
branch the next issue yet, even if its spec is `status:ready-for-dev`. Report to the user which
issue is waiting and why (previous PR not yet merged), and let the interview queue keep going
independently. This exists because starting a new branch before the prior one is merged forks it
from a stale base and produces exactly the branch-divergence/conflict risk this rule prevents —
it already happened once with issue #3 branching before issue #2's PR was merged (2026-08-31).

Once the user merges that PR (outside this skill call) and re-invokes the skill, the next
`status:ready-for-dev` issue is free to enter this queue on the next run.

For the issue at the head of this queue, route by its `front`/`api` labels — **backend always
before frontend when both are present**:

```
has api label?  → spawn dev-backend(n) → wait for report
has front label? → spawn dev-front(n)  → wait for report
                                        (checks out dev-backend's branch if api label was also present)
→ status is now status:in-test
has api label?  → spawn qa-backend(n) → wait for report
  - report says "retry" → spawn dev-backend(n) again (fix-only, it reads the failure comment) → re-run qa-backend(n)
  - report says "blocked" → stop this issue's chain, surface to user, dev/qa queue stops here for this invocation
  - report says "handed off to qa-front" (issue also has front) → continue below
  - report says "PR opened" (issue has no front) → this issue is done; dev/qa queue stops here for this invocation (see below — don't start the next issue)
has front label? → spawn qa-front(n) → wait for report
  - report says "retry" → spawn dev-front(n) again → re-run qa-front(n)
  - report says "blocked" → stop this issue's chain, surface to user, dev/qa queue stops here for this invocation
  - report says "PR opened" → this issue is done; dev/qa queue stops here for this invocation (see below — don't start the next issue)
```

**Do not loop back to pull a second issue into this queue in the same invocation** — whether the
outcome was `blocked` or `PR opened`, the dev/qa queue's job for this invocation ends with this
one issue. A `blocked` issue still has an incomplete branch sitting unmerged, and a `PR opened`
issue hasn't been merged yet either — in both cases starting a second issue's branch now would
fork it from a base that doesn't include this one, recreating the same divergence problem. Report
what happened and, if there are more `status:ready-for-dev` issues waiting, tell the user they'll
be picked up on the next invocation once this one is resolved/merged.

Each subagent updates the issue's own labels as part of its job (see the individual agent files)
— you don't need to move labels yourself, just read them back if you need to confirm state
between steps.

**Retry is capped at one automatic attempt per qa stage** (the `retry:used` label is how the qa
agents track this themselves — you don't need to count). A second failure on the same qa stage
always means `status:blocked`, never a second automatic retry.

When an issue reaches `status:blocked` or `status:in-review` (PR opened), it's out of this queue
for this invocation — don't re-enter it even if the queue loops back around, and per the rule
above, don't start a different issue's dev/qa in its place either.

## 3. Wrapping up

When the interview queue is empty and no issue is left waiting/running in the dev/qa queue, stop
and report a summary: issues interviewed and their confirmed scope, issues that reached PR (link
each), issues that hit `status:blocked` (and why, from their last comment), issues still mid-chain
if you're stopping early for any reason, and any `status:ready-for-dev` issues still waiting
because a prior PR from this pipeline isn't merged yet. **Never merge a PR yourself** — that's
always the user's call, and always tell them explicitly (don't assume it's implied) that before
merging they should run the affected package's dev server (`pnpm dev:front` / `pnpm dev:api`)
and test the change themselves — the automated qa stage only runs Jest/Vitest + lint/typecheck,
it doesn't verify actual behavior in the running app. Remind them that the next issue's dev/qa
won't start until this PR is merged.

**Don't close the issue when its PR merges into `dev`, even though `status:done` goes on at that
point** — GitHub's `Closes #<n>` in the PR body only auto-closes on merge into the repo's
*default* branch (`main` here), so merging into `dev` never triggers it, and that's deliberate:
**this project closes an issue only when it actually ships in a `main`/release deploy**, not when
it lands in `dev` (2026-08-31, user correction — a first pass closed issues #2/#3/#4 right after
their `dev` merge, which was wrong and got reverted). So: set `status:done` right after the `dev`
merge as usual, but leave the GitHub issue open — don't call `gh issue close` at this point. There
is no release process yet (see `docs/case-study/git-branching-strategy.md`'s open items), so
`status:done`-but-open issues piling up is expected for now, not a bug to "fix" by closing them
early.

## Re-running a stuck issue

If the user points you at a `status:blocked` issue after fixing something manually or clarifying
scope, you can re-enter it directly at whichever stage makes sense (usually re-spawning the
`dev-*` agent that failed) without restarting from `dev-interview` — its spec comment is still
valid unless the user says otherwise. Reset its labels to reflect where you're re-entering
(`gh issue edit <n> --remove-label "status:blocked" --add-label "status:in-dev"` or similar)
before spawning the agent, so the state stays honest if the run stops midway again.
