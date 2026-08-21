---
name: case-study-blog
description: Check docs/case-study/*.md for source documents that don't have a blog post yet, then turn each approved one into a draft at docs/blog/<slug>.md via the blog-writer subagent, with a per-file confirmation gate. Use when the user says things like "케이스스터디 블로그로 써줘", "새 글감 있는지 확인해줘", or asks to turn the case-study docs into blog posts.
---

# case-study-blog

Orchestration script for you (the main session) — the actual writing is done by the
`blog-writer` subagent (`.claude/agents/blog-writer.md`), one source file at a time, with a
stop-and-confirm gate after every draft. Never draft-and-approve multiple files in one go without
the user seeing each one — a bad draft compounds if you keep writing on top of a style drift
nobody caught.

## Step 1 — find new source files

Compare two lists:

- Every `docs/case-study/*.md` file.
- Every key in `docs/blog/manifest.json` (a file not present as a key has no post yet — that's
  the entire "is this new" rule; there's no separate flag or timestamp comparison).

Anything in the first list but not the second is a candidate. Note: if a case-study doc *already
in* the manifest has visibly changed since its `updated` date (e.g. the user just told you they
edited it, or its content contradicts what the existing post says), don't silently re-draft it —
tell the user it looks updated and ask whether they want a re-write. The manifest only tracks
"has a post ever been made," not "is the post still accurate."

Report the candidate list to the user (filenames + one-line topic from memory/earlier
categorization if you have it) and ask which ones to draft — all of them, a subset, or none right
now. **Do not proceed to Step 2 without this confirmation**, even if there's only one candidate.

## Step 2 — draft one at a time

For each file the user approved, in order:

1. Spawn `blog-writer` (via the Agent tool, `subagent_type: "blog-writer"`) with the single
   source path, e.g. `docs/case-study/monorepo-dependency-management.md`.
2. When it reports back, relay its summary (slug/path, the 전 section's core claim, anything it
   flagged as left out) and tell the user to look at `docs/blog/<slug>.md` themselves before you
   touch the manifest.
3. **Stop and wait for the user's verdict on this specific draft.** Options they may give you:
   accepted as-is, needs revision (relay the feedback to another `blog-writer` call on the same
   source file — don't hand-edit the prose yourself unless they ask you to directly), or skip/drop
   this one.
4. Only once the user accepts a draft, update `docs/blog/manifest.json` yourself: add/update the
   entry for that source file —
   ```json
   "monorepo-dependency-management.md": {
     "post": "docs/blog/monorepo-dependency-management.md",
     "status": "drafted",
     "updated": "YYYY-MM-DD"
   }
   ```
   (today's date). `blog-writer` never touches this file — that's deliberate, so a draft the user
   rejects never gets marked done.
5. Move to the next approved file and repeat. Don't batch multiple `blog-writer` calls in
   parallel — the point of the per-file gate is that each one is actually looked at before the
   next is written.

## Step 3 — wrap-up

After the approved batch is done (accepted, skipped, or dropped), summarize what got drafted and
what's still pending. Do not `git add`/`git commit` the new posts or manifest changes yourself —
that follows the project's normal commit rules (ask first, conventional-commit message), same as
any other change in this repo.

## Publishing beyond the repo

This skill only produces markdown drafts under `docs/blog/`. Getting a draft onto an actual public
blog platform is a separate, manual step for now — nothing here posts anywhere external. If that
changes (a platform integration gets added later), update this section rather than assuming.
