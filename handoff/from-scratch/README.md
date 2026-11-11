# From-scratch kit

This folder lets another model do the Bakersfield project again **from an empty repository**,
with the same skills, the same tools, the same working method and the same instructions from
the client that the original model had.

It has no code, no pictures and no generation prompts from the original. The new model does
the work itself.

## What is in the folder

| File | Use |
|---|---|
| `SETUP.md` | The environment to prepare: agent, model roles, repository, skills, MCP servers, machine tools, the stop hook. |
| `install-skills.sh` | Installs the same 73 skill folders at the same commits. Tested: the output is identical to the original. |
| `CLAUDE.md` | The client's standing rule about message style. Optional; see `SETUP.md`, section 6. |
| `PROMPTS.md` | The client's sixteen messages, word for word, in order, with what the original model did after each one. |
| `DECISIONS.md` | Every decision of the client, by topic. Use it to answer the new model's questions. |
| `KICKOFF-PROMPT.md` | One message that gives the whole brief and all decisions at once. |

## Two ways to run it

**Way 1 — Replay (closest to the original).**
Do the setup. Then send the messages of `PROMPTS.md` one at a time. Wait for the model to
finish each step. When the model asks a question, answer from `PROMPTS.md` or `DECISIONS.md`.

**Way 2 — Kickoff (fastest).**
Do the setup. Send the prompt in `KICKOFF-PROMPT.md`. The model stops at six points for your
approval. Answer from `DECISIONS.md`.

## Steps

1. Create a new, empty, **public** GitHub repository.
2. Start an agent session on it, with subagents available. Set the model roles (`SETUP.md`, section 1).
3. Connect the image and video MCP server and the Vercel MCP server (`SETUP.md`, section 4).
4. Check that ffmpeg, Python with Pillow, Node 22 and Playwright are in the machine (`SETUP.md`, section 5).
5. Install the skills, or let the first prompt do it:

```bash
bash install-skills.sh
```

6. Send the prompts (Way 1 or Way 2).

## What to expect

The new model gets the same inputs. It will not make the same site. It will choose its own
palette, copy, layout, prompts and code. The logo and the footage will be new pictures. You
get a site of the same kind, made under the same conditions.

If you want the same site, use the exact-copy package in the parent folder
(`../README.md`). That package is a different thing: it gives the model the finished code and
the saved pictures.

## Do not give the model these

They are in the parent folder. They hold the original's answers.

- `../reference/SOURCE.md`, `../04-architecture.md`, `../05-design-and-motion.md`
- `../02-asset-generation.md`, `../03-frame-pipeline.md`, `../06-build-prompts.md`, `../07-verification.md`
- the original `src/`, `public/` and `assets/` folders

The simplest safe method: copy only this `from-scratch/` folder into the new repository, or
keep it outside the repository and paste from it.

## Optional: give the model the lessons, but not the answers

The original model had no notes from an earlier build. If you want the new model to avoid the
same errors, you can add one file. It then has more than the original had.

| File | What it gives | Effect |
|---|---|---|
| `../09-decisions-and-pitfalls.md` | Sixteen errors that happened and their fixes, and the known limits | The model avoids the errors. It also learns some design choices of the original. |
| `../10-skills-and-tools.md` | What each skill gave to the original | The model reads the right skills sooner. |

## Differences that you cannot remove

- **Model behaviour.** Another model, or the same model on another day, makes other choices.
- **Generation.** Image and video models do not give the same output twice.
- **Skill versions.** The script pins the commits. If a source repository is deleted or its history is rewritten, that pin will fail; replace the commit with `HEAD` in the script.
- **Account skills.** Six skills came from the client's account, not from the repository (`SETUP.md`, section 3).
- **The MCP servers.** Their models and limits can change.
