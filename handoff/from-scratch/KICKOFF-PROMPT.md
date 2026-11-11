# Kickoff prompt — one message that starts the whole project

Use this if you do not want to replay the sixteen steps of `PROMPTS.md`. It gives the new
model the same brief, the same tools, the same working method and the same client decisions
in one message. The model then works from an empty repository to a live site.

Before you send it: do the setup in `SETUP.md` (agent, repository, skills, MCP servers).
Replace the three `<…>` placeholders.

It has the client's requirements and nothing else. It has no code, no generation prompts and
no lessons from the original build.

---

```text
You will plan, build and deploy a website from an empty repository. You are the orchestrator.

THE BRIEF

A website for a bakery brand named Bakersfield. The logo is a pixelated croissant with a
French moustache on it. The site is a brand showcase: no shop, no ordering. It is an
interactive scroll site, built with Next.js, that uses the skills installed in
.claude/skills/.

There are two versions of one story, the making of a croissant from scratch:

  /      a pixel-art version, soft 16-bit style, on one scroll page
  /pov   a separate realistic version, seen from the baker's point of view

YOUR TOOLS

- The skills in .claude/skills/. Read the ones that fit each task before you do it: the three
  scroll-site skills, the taste and typography skills for fonts, the Apple design skills and
  the liquid glass skill for the polish.
- The Higgsfield MCP server for every image and video. Its models: ag/gemini-3.1-flash-image,
  qwen-image-3.0-pro, wan2.7-image-pro, wan2.7-image, wan3.0-video.
- The Vercel MCP server for the deploy.
- Subagents. Shell, git, ffmpeg, Python with Pillow, Playwright with Chromium.

HOW YOU WORK

- You are the orchestrator. You plan, you review, you commit.
- Subagents on <SMALL FAST MODEL> build the site. Send <MID-SIZE MODEL> to build the /pov
  page. Use the small model for the easier tasks.
- You write every image and video prompt yourself.
- Review each subagent's work yourself, with screenshots, before you commit it.
- Keep a sense of the cost of AI generation. If it becomes too much, stop and ask me.
- Write your chat messages to me in ASD-STE100 (Simplified Technical English) at about 75%
  compliance. This applies to messages only. Code, files, commands and commit messages stay
  in normal English. Save this as a standing rule in CLAUDE.md.
- Work on the branch <BRANCH NAME>. Commit and push your work there. Do not open a pull
  request.

DECISIONS I HAVE ALREADY MADE

Brand and pixel version
- Generate the logo with the Gemini 3.1 Flash Image model of the Higgsfield MCP.
- Pixel style: soft 16-bit.
- Choose the fonts with the taste skill and the typography skills.
- The core interaction is a scroll story where the croissant is made step by step. It is
  not a video fly-through.
- One scroll page first.
- Video quality: 720p or lower, so it is small but looks good enough.
- Optimise the site for mobile devices.

First-person version
- It is a separate version at the route /pov.
- No hands. Tools and ingredients move with no hands, as if the hand is cropped out.
  Floating tools are acceptable.
- The kitchen is clean marble, with some rustic colours in the marble.
- The camera looks steeply down at the worktop.
- A cut to an oven view is acceptable for the bake.
- The moustache at the end is a chocolate moustache on the croissant.
- The page has a calmer, photo-led style.

Polish
- Make the site polished and premium. Use the Apple design skills.
- Put liquid glass on the buttons, with the skill-design-system-liquid skill.

Images
- All image assets for the animations are WebP, small in size. Fast loading comes first.

Deploy
- Deploy with the Vercel MCP.

WHAT I HAVE NOT GIVEN YOU

I have given you no copy, no opening hours, no prices, no address and no contact details.
Write the copy yourself. Do not invent facts about the business. Use a placeholder for the
contact link.

WHERE TO STOP AND ASK ME

Stop and show me your work at these points. Continue when I approve.
  1. Your plan, with your questions, before you build anything.
  2. The logo.
  3. The fonts.
  4. The story beats.
  5. One test clip of the first-person version, before you make the others.
  6. Before the first deploy. I may need to approve access for the Vercel tool.

For every other choice, decide what you recommend, do it, and tell me what you chose.

At the end, tell me plainly what is done, what you checked and how, and what you did not
test.

Start with the plan.
```

---

## Notes

- The stop points 1–5 are the points where the original model stopped and the client
  answered. To let the model run with no stop, remove that section and add the line
  "Do not stop for approval. Make every choice yourself and report it at the end."
- The prompt lists the decisions in the order of the final state. In the original they came
  over sixteen messages. The step-by-step version is in `PROMPTS.md`.
- The new model will make its own plan, its own prompts and its own design. With the same
  inputs it will reach a site of the same kind, not the same site. That is the meaning of a
  start from scratch.
