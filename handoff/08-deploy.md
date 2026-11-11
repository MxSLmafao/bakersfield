# 08 — Deploy

The site is a static Next.js build on Vercel. Both routes are prerendered. There is no
server code, no database and no environment variable.

## 1. Current deployment

| Item | Value |
|---|---|
| Host | Vercel |
| Project name | `bakersfield` |
| Framework preset | Next.js (auto-detected) |
| Build command | default (`next build`) |
| Output | default |
| Root directory | repository root |
| Git link | GitHub repository, production branch = the working branch |
| Production URL | `https://bakersfield-ten.vercel.app` |
| Routes | `/` and `/pov` |
| Environment variables | none |

Each push to the production branch starts a new production deployment.

## 2. Steps to deploy a rebuild

1. Push the repository to GitHub (or GitLab or Bitbucket).
2. In Vercel, create a project from that repository. Accept the detected Next.js settings.
3. Set the production branch.
4. Deploy. Wait for state `READY`.
5. Run the header checks in `07-verification.md` against the live URL.

With the Vercel MCP tools the same steps are: `create_git_project` (with the team id and
`owner/repo`), then `get_deployment` until `READY`.

## 3. Two blockers met during the first deploy

| Symptom | Cause | Fix |
|---|---|---|
| `403 forbidden … Not authorized: Trying to access resource under scope …` | The tool connection had no grant for the team. | Call `authorize_team_access` with the team id. A person must open the returned link and approve. The link works once and expires in 10 minutes. |
| `Failed to link <repo>. You need to add a Login Connection to your GitHub account first.` and then `429 GitHub API rate limit exceeded` on a direct deploy | The Vercel account had no GitHub login connection, so Vercel read GitHub with no login. | A person connects GitHub in Vercel account settings (Authentication → Login Connections) and gives the Vercel GitHub app access to the repository. |

A deploy by file upload was not possible through the tools, because the site has more than a
thousand binary frame files.

## 4. Rules that protect the live site

- The working branch **is** the production branch. Every push goes live.
- Do not push unfinished work. Build and review first, then push.
- Do not commit an agent worktree. `.claude/worktrees/` is in `.gitignore`, because a
  worktree folder was once committed by mistake as an embedded repository link.
- After a deploy, check the live site, not only the build state. A good check is one file that
  only the new build has, or a header that only the new build sends.

## 5. Cache behaviour to keep

- Image files under `/frames/`, `/frames-sm/`, `/pov/<slug>/`, `/pov-sm/<slug>/` and `/brand/`:
  `Cache-Control: public, max-age=31536000, immutable`.
- The HTML of `/` and `/pov`: **not** immutable (`public, max-age=0, must-revalidate` on Vercel).
- `/pov` is a page and also a folder of images. The header rule must match only the image
  files. The exact rule is in `next.config.mjs` and in `04-architecture.md`.
