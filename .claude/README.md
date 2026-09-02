# `.claude/` — how this project instructs the agent

This folder is committed to the repository on purpose. Everything in it is
picked up automatically whenever the agent runs here, and — because it is in
git rather than on the VM — everyone else working on this project gets it too.

| Path | What it is |
| --- | --- |
| `../CLAUDE.md` | Instructions applied to every run in this repository. |
| `skills/` | Skills: procedures the agent can follow for a recurring job. |
| `commands/` | Saved prompts, reusable as `/<name>`. |
| `settings.json` | Settings shared by everyone working on this repository. |
| `settings.local.json` | Your own overrides. Git-ignored; never shared. |

## Adding a skill

Create `skills/<name>/SKILL.md`, starting with frontmatter:

```markdown
---
name: run-migrations
description: Use when a ticket adds or changes a database migration.
---

Steps the agent should follow...
```

The `description` is what decides whether the skill gets used, so write it as
*when to reach for this*, not as a title. Put any scripts or reference files the
skill needs in the same folder and point at them from `SKILL.md`.

## Adding a prompt

Drop a markdown file in `commands/`. `commands/release-notes.md` becomes
`/release-notes`; `$ARGUMENTS` in the body is replaced by whatever follows it.

## One rule

Do not add `.claude` or `CLAUDE.md` to `.gitignore`. Ignoring them makes
this folder local to one machine, which is the opposite of the point — the agent
on the VM would keep working while everyone else silently lost the skills. The
agent removes such an entry if it finds one.
