---
name: design-publish-qa
description: Run meta-scan's design → publish-front → qa-front-publish pipeline for turning a handed-over design (usually a Claude Design canvas/Artifact URL) into published, verified meta-scan-front code. Stage-by-stage with a user confirmation gate between each stage — never chains all three automatically. Use when the user says things like "이 디자인 퍼블리싱해줘", "디자인 반영하고 QA까지", or pastes a claude.ai/code/artifact URL wanting it implemented.
---

# design-publish-qa

Three purpose-built subagents — `design-intake`, `publish-front`, `qa-front-publish`
(`.claude/agents/*.md`) — chained with an explicit stop-and-confirm gate between every stage.
This skill is the orchestration script for you (the main session); it does not do the work
itself.

**Default design source**: `https://claude.ai/code/artifact/43c00b5f-73e5-4720-b77f-265dffe7e71c`
("meta-scan Wireframes" canvas, "final" page — 18 artboards, Zine Index + orange). If the user
kicks off this pipeline without pasting a design URL, use this one rather than asking — it's the
project's standing design source (see `docs/design-system.md`'s header). Only ask if they
indicate they mean a different design.

**Never skip a gate.** Each agent's output is a real decision point — a bad spec produces a bad
implementation, and an unreviewed implementation shouldn't get auto-declared "done" by a QA pass
you didn't ask the user about. If the user explicitly asks for the whole pipeline to run without
stopping ("끝까지 알아서 해줘", "confirm 없이 쭉 진행해"), that's their call to make in the
moment — don't assume it from this skill alone.

## Stage 1 — design-intake

Spawn the `design-intake` subagent (via the Agent tool, `subagent_type: "design-intake"`) with
the design source (URL/description) the user gave you, and a slug if one is obvious (otherwise
let the agent derive one and tell you).

Agents run in the background — you are notified when it completes; don't fabricate its result or
proceed on an assumption of what it found. When it reports back:

- Relay its summary to the user: artboards found, which file family it used, any
  design-system conflicts/gaps/ambiguities it flagged, the spec path.
- **Stop here and wait for the user to confirm before moving to stage 2.** If it flagged
  ambiguities it couldn't resolve on its own, surface those as an explicit question — don't let
  stage 2 start from a spec the intake agent itself wasn't confident in.

## Stage 2 — publish-front

Only after the user confirms. Spawn `publish-front` with the spec path from stage 1
(`docs/design/intake/<slug>/spec.md`).

When it reports back:
- Relay: files changed, design-system deviations and why, any product-copy changes and why,
  anything left as an out-of-scope functional follow-up, lint/typecheck status.
- **Stop here and wait for the user to confirm before moving to stage 3.** If lint/typecheck
  didn't pass cleanly, don't proceed — send it back or flag it to the user first.

## Stage 3 — qa-front-publish

Only after the user confirms. Spawn `qa-front-publish` with the slug (so it can find the stage-1
reference images) and the spec path.

When it reports back:
- Relay its findings as written — pass/fail counts, both the rule-compliance and
  visual-fidelity passes, anything it flagged as a real mismatch.
- **This is a report, not an auto-fix loop.** Do not re-invoke `publish-front` on QA findings
  without the user asking you to. Tell them what qa-front-publish found and let them decide whether to
  send it back for another publish-front pass, accept it as-is, or handle something manually.

## If the user wants to re-run just one stage

Each agent is independently invocable — you don't have to restart the whole pipeline to fix one
thing. E.g. if qa-front-publish finds a real bug, the natural next step (once the user says go) is
re-invoking `publish-front` alone with a pointer to the specific finding, then `qa-front-publish` again
to re-verify — not re-running `design-intake`, whose output didn't change.
