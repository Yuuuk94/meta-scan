---
name: tdd-issue-loop
description: Process meta-scan's GitHub Issues backlog through the issue-based TDD loop — dev-interview → (dev-backend/dev-front as needed) → (qa-backend/qa-front as needed) → PR. Interview stages run fully sequentially with a human confirmation gate each time; once an issue's spec is confirmed, its dev/qa automatic stages run in the background (no gate) while the skill immediately starts interviewing the next issue. Use when the user says things like "이슈 처리해줘", "TDD 루프 돌려", "백로그 인터뷰하자", or names a specific issue number to push through the pipeline. One-shot per invocation — does not use /loop or any polling; consumes whatever's in the queue right now and stops.
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

## 2. Dev/qa queue — automatic, one issue at a time

**Concurrency: exactly one issue in this queue's active pipeline at any moment**, regardless of
which packages it touches (front-only, api-only, or both all share the same slot) — no worktree
isolation exists yet, so two issues can't safely have different branches checked out in this
working directory at once, and `meta-scan-api` tests launch real Puppeteer/chrome-launcher
processes that shouldn't run concurrently. If an issue arrives at this queue while another is
still running, it waits its turn (still priority-ordered).

For the issue at the head of this queue, route by its `front`/`api` labels — **backend always
before frontend when both are present**:

```
has api label?  → spawn dev-backend(n) → wait for report
has front label? → spawn dev-front(n)  → wait for report
                                        (checks out dev-backend's branch if api label was also present)
→ status is now status:in-test
has api label?  → spawn qa-backend(n) → wait for report
  - report says "retry" → spawn dev-backend(n) again (fix-only, it reads the failure comment) → re-run qa-backend(n)
  - report says "blocked" → stop this issue's chain, surface to user, move to next issue in this queue
  - report says "handed off to qa-front" (issue also has front) → continue below
  - report says "PR opened" (issue has no front) → this issue is done, move to next issue in this queue
has front label? → spawn qa-front(n) → wait for report
  - report says "retry" → spawn dev-front(n) again → re-run qa-front(n)
  - report says "blocked" → stop this issue's chain, surface to user, move to next issue in this queue
  - report says "PR opened" → this issue is done, move to next issue in this queue
```

Each subagent updates the issue's own labels as part of its job (see the individual agent files)
— you don't need to move labels yourself, just read them back if you need to confirm state
between steps.

**Retry is capped at one automatic attempt per qa stage** (the `retry:used` label is how the qa
agents track this themselves — you don't need to count). A second failure on the same qa stage
always means `status:blocked`, never a second automatic retry.

When an issue reaches `status:blocked` or `status:in-review` (PR opened), it's out of this queue
for this invocation — don't re-enter it even if the queue loops back around.

## 3. Wrapping up

When the interview queue is empty and no issue is left waiting/running in the dev/qa queue, stop
and report a summary: issues interviewed and their confirmed scope, issues that reached PR (link
each), issues that hit `status:blocked` (and why, from their last comment), issues still mid-chain
if you're stopping early for any reason. Don't merge any PR — that's always the user's call.

## Re-running a stuck issue

If the user points you at a `status:blocked` issue after fixing something manually or clarifying
scope, you can re-enter it directly at whichever stage makes sense (usually re-spawning the
`dev-*` agent that failed) without restarting from `dev-interview` — its spec comment is still
valid unless the user says otherwise. Reset its labels to reflect where you're re-entering
(`gh issue edit <n> --remove-label "status:blocked" --add-label "status:in-dev"` or similar)
before spawning the agent, so the state stays honest if the run stops midway again.
