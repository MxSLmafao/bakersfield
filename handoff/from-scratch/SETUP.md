# Setup — give the new model the same environment

The original build ran in an AI coding agent session with a fixed set of tools, skills and
rules. This file lists all of them. Set up the same things before you send the first prompt.

## 1. The agent

| Item | Original | Note |
|---|---|---|
| Agent harness | A coding agent that can read and write files, run shell commands, load skills from `.claude/skills/`, call MCP tools, and start **subagents** | Subagents are needed. The client told the agent to act as an orchestrator. |
| Session type | A cloud session with a fresh clone of the repository | A local session works the same way. |
| Permission mode | Automatic (the agent runs commands without a prompt for each one) | Some commands were still denied by safety checks. See section 8. |
| Reasoning effort | High | |
| Models | Three roles. See below. | |

Model roles (fill in the models you will use):

| Role | What it did | Original choice |
|---|---|---|
| Orchestrator (the main session) | Planned, wrote every image and video prompt, reviewed all work, committed, deployed | The session started on a small fast model for the setup steps (skill install, the standing rule, the plan). The client then changed it to the **largest available model** before the build started. |
| Build subagents, easy tasks | Scaffold, refactor, mobile pass, polish pass, small fixes, caching | A **small fast model** (the client said "haiku") |
| Build subagent, hard task | The `/pov` page | A **mid-size model** (the client said "sonnet 5.5") |

The client's exact words about the roles are in `PROMPTS.md`, steps 8 and 15.

## 2. The repository

- A **new, empty GitHub repository**. The original had no files at the start.
- The repository must be **public**, or you need another public file host. Reason: the image
  and video tools take a reference picture only as a public URL. The original pushed each
  still to the repository and used the `raw.githubusercontent.com` URL.
- One working branch. In the original it was also the only branch, so Vercel used it as the
  production branch, and every push went live.
- Commit rules that the original session had:
  - Develop, commit and push on the one designated branch.
  - Do not open a pull request unless the client asks.
  - Commit messages must not name an AI model.

## 3. Skills

Run this in the root of the new repository, before the first prompt, **or** let the model do
it from the first client prompt (see `PROMPTS.md`, step 1; the original did it that way):

```bash
bash install-skills.sh
```

The script installs the same skill sources at the same commits. It was tested: its output is
identical to the 73 skill folders of the original.

| # | Source | Installed as | When the client gave it |
|---|---|---|---|
| 1 | `https://github.com/oso95/scroll-world` | `scroll-world` | Step 1 |
| 2 | npm `claude-skill-3d-animation-landing` (1.0.1) | `3d-animation-landing` | Step 1 |
| 3 | `https://github.com/abdelrhman2007/scrollytelling-brand-site` | `scrollytelling-brand-site` | Step 1 |
| 4 | `https://github.com/higgsfield-ai/skills` | 9 folders `higgsfield-*` | Step 1 |
| 5 | `https://github.com/OSideMedia/higgsfield-ai-prompt-skill` | `higgsfield` + 36 folders `higgsfield-*` | Step 1 |
| 6 | `https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md` | `apple-design` (that one skill only) | Step 1 |
| 7 | `https://github.com/dickwu/apple-design-skill` | `apple-design-dickwu` | Step 1 |
| 8 | `https://github.com/leonxlnx/taste-skill` | `taste-skill` | Step 6 |
| 9 | `https://github.com/jpoindexter/typography-skills` | 21 folders | Step 6 |
| 10 | `https://github.com/sasaki-ta-instyle/skill-design-system-liquid` | `skill-design-system-liquid` | Step 14 |

For a true replay, install sources 1–7 first and let the model install 8–10 when the prompts
give them. To save time, install all ten at the start; the result is the same.

The session also had **account-level skills** enabled. They are not in the repository, so
the install script cannot add them. Enable the same ones in the new session if you have them:

| Account skill | Topic |
|---|---|
| `ui-motion-micro-rules` | 20 rules for natural UI motion |
| `organic-motion-polish` | Anticipation, offset and motion blur for less robotic motion |
| `anti-robotic-motion-engine` | The same three motion moves, for AI-made animation |
| `premium-web-interactions-v3` | Seven signature website interactions and a pre-ship audit |
| `creative-coding-animation-styles` | Canvas and WebGL visual styles |
| `fire-design-trends` | Graphic design trend styles |

The first plan named the first three as the motion references. The orchestrator could see
them, but the build subagents could not (they read skills from the repository only), so the
build did not depend on them. Standard document skills (PDF, Word, slides, spreadsheets,
artifacts) were also present and were not used.

## 4. MCP servers (tools)

The session had these servers connected. Only the first two were used for the site.

### 4.1 Image and video generation server ("Higgsfield MCP") — required

Three tools. The server gives the model this guidance:

> Unified image and video generation server. Pick models based on the task:
> - `qwen-image-3.0-pro` (default image): typography, posters, UI mockups, and prompt-driven editing (text changes, object add/remove, pose edits). Max 2K.
> - `wan2.7-image-pro`: 4K text-to-image, photorealistic and commercial visuals, multi-image editing.
> - `wan2.7-image`: fast drafts and general text-to-image or editing at 1K/2K.
> - `ag/gemini-3.1-flash-image`: fast photorealism, creative and cinematic compositions (text-to-image only).
> - `wan3.0-video`: text-to-video, first/last-frame image-to-video, reference-to-video, with synced audio, 480P/720P/1080P, 2–30 s.

| Tool | Parameters (default) |
|---|---|
| `generate_image` | `prompt` (required); `model` (`qwen-image-3.0-pro`); `size` (`auto`; for example `1024*1024`, `1280*720`); `reference_image_url` (an image URL for editing, Alibaba models); `negative_prompt`; `prompt_extend` (`true`); `output_format` for Gemini (`png`, `jpeg`, `webp`); `quality` for Gemini (`auto`, `hd`, `standard`). Returns the image inline. No public URL is returned. |
| `generate_video` | `prompt` (required); `model` (`wan3.0-video`); `first_frame_url`; `last_frame_url` (needs `first_frame_url`); `reference_image_urls` (not with first/last frame); `duration` (`5`, range 2–30); `resolution` (`720P`; also `480P`, `1080P`); `ratio` (`adaptive`; also `21:9`, `16:9`, `4:3`, `1:1`, `3:4`, `9:16`); `audio` (`true`); `prompt_extend` (`true`); `wait_seconds` (`60`). Returns a task id if the clip is not ready. |
| `get_video_task` | `task_id` (required); `wait_seconds` (`45`). Returns the status and, when done, a video URL that is valid for 24 hours. |

Facts that the original learned about this server:

- `generate_image` returns the picture inline and saves a local file. It gives no URL. To use
  a picture as a reference or as a video frame, the agent must host it at a public URL.
- The Gemini model ignored the requested size and returned 1024×1024.
- A call can time out after 60 seconds. One retry was enough.
- A 4–5 second clip at 720P took about one minute.

### 4.2 Vercel MCP — required for the deploy

Tools that were used: `list_teams`, `list_projects`, `authorize_team_access`,
`create_git_project`, `create_deployment`, `get_deployment`, `list_deployments`,
`list_deployment_events`.

Before the deploy can work, a person must do two things (the original was blocked on both):

1. Approve the team access link that `authorize_team_access` returns.
2. Connect GitHub to the Vercel account (Account settings → Authentication → Login Connections), and give the Vercel GitHub app access to the repository.

To let the new model meet the same conditions as the original, do nothing in advance and
answer "Done" when it asks. To save time, do both before the deploy step.

### 4.3 Connected but not used for the site

GitHub MCP, a documents server, a web scraper, a memory server, Gmail, and Google Stitch (a
UI design generator). You do not need them. An image server named "Geminimage" was configured
but failed to connect, so it was never available.

## 5. Tools in the machine

| Tool | Version in the original | Used for |
|---|---|---|
| Node.js | 22.23 | Build |
| npm | 10.9 | Packages |
| git | any | Version control |
| ffmpeg | 6.1.1 with libwebp | Cutting clips into frames, contact sheets |
| Python | 3.13 with Pillow 12.3 and numpy 2.5 | Image conversion, palette measurement, colour fixes |
| Playwright with Chromium | pre-installed | Screenshots and browser checks |
| curl | any | Header checks on the live site |

Network access is needed to: GitHub, the npm registry, the generation server, the video
download host that the generation server returns, and Vercel.

## 6. Project instruction file

Put `CLAUDE.md` (in this folder) at the root of the new repository **only if** you want to
skip steps 2 and 3 of `PROMPTS.md`. In the original, the file did not exist at the start; the
client asked for the rule and the model wrote the file.

The rule is about how the model writes chat messages to the client (Simplified Technical
English). It has no effect on the site.

## 7. The stop hook

The original session had a hook that ran each time the model finished a turn. If the
repository had uncommitted or untracked files, the hook sent this message back to the model:

> There are uncommitted changes in the repository. Please commit and push these changes to the remote branch.

Effects that this had on the original build:

- The model committed and pushed after almost every step. This is why the history has many
  small commits, and why each still was pushed as soon as it was made.
- Because the branch was the production branch, a push was a deploy. The model refused the
  hook several times while a subagent was in the middle of a change, and committed after it
  had reviewed the work.

To copy this, add a `Stop` hook to the agent's settings that checks `git status --porcelain`
and prints the message above when the output is not empty.

## 8. Limits that the original session met

These are part of "the same conditions". The new model may meet them too.

- A forced push to rewrite a commit message was denied.
- A recursive delete with a relative path after a `cd` was denied.
- A subagent's command to stop a test server was denied. The orchestrator did not run it for
  the subagent.
- The video tool's long waits can time out. Use short waits and poll.

## 9. What the new model must NOT be given

For a real start from zero, do **not** give the model:

- the original `src/` folder, `public/` folder or `assets/` folder;
- `handoff/reference/SOURCE.md`, `handoff/04-architecture.md`, `handoff/05-design-and-motion.md`;
- `handoff/02-asset-generation.md` (the original's generation prompts).

With any of these, the model will copy the original and will not do the work itself.
`README.md` in this folder lists two optional files of lessons that you can add if you want.
