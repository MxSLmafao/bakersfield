# The client's prompts, in order

These are the messages that the client sent in the original session, **word for word**, with
the original spelling. Send them one at a time to replay the session. Each step also says
what the original model did and asked, so that you know when to send the next message and
why the answer has that form.

A new model will not ask the same questions in the same order. If it asks something that is
not here, find the answer in `DECISIONS.md`.

Notes:

- Text in a `text` block is the client's message. Send it as it is.
- "Model" lines say what the original model did. They are for you. Do not send them.
- Steps 1–7 ran on a small fast model. Before step 8, the client changed the session to the
  largest model (`/model <model id>`). See `SETUP.md`, section 1.

---

## Part 1 — Setup

### Step 1 — Install the skills

```text
Install these skills
https://github.com/oso95/scroll-world
`https://www.npmjs.com/package/claude-skill-3d-animation-landing`
https://github.com/abdelrhman2007/scrollytelling-brand-site
https://github.com/higgsfield-ai/skills
https://github.com/OSideMedia/higgsfield-ai-prompt-skill
https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md
https://github.com/dickwu/apple-design-skill
```

Model: cloned each source, read the npm installer script before using it, and copied 50
skill folders into `.claude/skills/`. It took only `apple-design` from the `emilkowalski`
repository, because the link points at that one file. It reported that two skills have the
name `apple-design` and put the second in `apple-design-dickwu`. It committed and pushed when
the stop hook asked.

### Step 2 — The message style rule

```text
From now on, lock this into a standing rule, messages will be given in 75% ASD-STE 100 english. Only messages, anything else like code or files with be written normally.
```

Model: agreed, applied the rule to the session, and offered to save it in `CLAUDE.md`.

### Step 3 — Save the rule

```text
save it as a standing rule in CLAUDE.md
```

Model: created `CLAUDE.md` with the rule, committed and pushed.

---

## Part 2 — The pixel site

### Step 4 — The brief

```text
Lets plan the project
A website for a baker brand named Bakersfield logo is a pixelated crossiant with a french mustache on it
How I envision the site so basically uses all those skills to make a interactive website
Draft up a plan with the skills first and ask questions to refine
```

Model: read the three scroll-site skills, then wrote a plan with two options for the core
interaction and seven questions.

- Option A: a scroll fly-through made of pre-rendered video clips (`scroll-world`). Strong, costly, slow to render.
- Option B: a pixel scroll story, where the croissant is made step by step with a canvas frame sequence (`3d-animation-landing`, `scrollytelling-brand-site`). Cheap and fast to change.

The seven questions were:

1. Logo file: can you share the logo as a file?
2. Interaction: Option A, Option B, or both?
3. Scope: one scroll page, or several pages?
4. Purpose: brand showcase, online ordering, wholesale, or events?
5. Stack: Next.js, plain HTML, or another? Where is it hosted?
6. Budget: is there a cap for AI generation? Which backend?
7. Pixel style: strict 16-bit grid, or softer modern pixel art?

### Step 5 — Answers to the seven questions

```text
1. Use gemini 3.1 flash image from the higgsfield mcp to generate the logo
2. Option b
3. One scroll page first
4. Brand showcase 
5. Next.js then 
6. Budget, just have a sense of if ai generation takes too much, if too much ask me
7. Soft 16 bit trid
```

Model: generated the logo with the Gemini image model, saved it in the repository, measured
a seven-colour palette from the logo pixels, and asked two questions: is the logo approved,
and should the wordmark use a pixel font or a serif?

### Step 6 — Logo approval and font skills

```text
Logo approved, for font use this skill https://github.com/leonxlnx/taste-skill and https://github.com/jpoindexter/typography-skills
```

Model: installed both sources (22 more skill folders), read the pairing rules, and
recommended **Pixelify Sans** for display and **DM Sans** for body text. It asked for approval.

### Step 7 — Font approval

```text
Looks good then
```

Model: wrote a brand sheet (logo, palette, fonts, voice) and proposed eight story beats, one
screen each: Hero, Ingredients, Dough, Lamination, Proof, Bake, Mustache reveal, Visit. It
asked: do the beats work, and can the scaffold start?

**Before step 8, the client changed the session to the largest model.**

### Step 8 — Start the build, and the working method

```text
Yes looks good, you will be the orchestrator, so deploy haiku subagents to build it and then you will review and also you will be responsible for the prompting of the video generation. Quality should be 720p or lower so it is small but looks good enough.
```

Model, as orchestrator:

1. Sent a subagent to scaffold the Next.js site.
2. Generated one still, then made each next still by editing the one before it.
3. Made one test clip, checked it, then made the other five clips. Each clip starts on the last frame of the clip before it.
4. Cut the clips into WebP frames.
5. Reviewed the scaffold, then sent a second subagent to change six pinned sections into one continuous pinned story.
6. Reviewed screenshots, fixed two defects itself, committed and pushed.

It reported the result and listed open decisions (copy, the button link, the deploy host).

### Step 9 — Deploy

The client first connected the Vercel MCP server to the session. Then:

```text
Use vercel mcp and deploy
```

Model: was blocked, because the tool connection had no access to the Vercel team. It gave an
approval link.

### Step 10 — Two approvals

After the client approved the team access link:

```text
Done
```

Model: was blocked again, because the Vercel account had no GitHub connection. It gave the
steps to connect GitHub. After the client did that:

```text
Done
```

Model: created the Vercel project, deployed, checked the build state and the live URL.

### Step 11 — Mobile

```text
Optimise it for mobile devices
```

Model: made a smaller frame set for phones, then sent a subagent to serve it on phones and
slow connections, load frames per segment, shorten the story on phones, keep native touch
scrolling, and fix the layouts. It sent the subagent back once to finish open issues. It
reviewed screenshots, committed, and checked the live site.

---

## Part 3 — The first-person version

### Step 12 — Plan a second version

```text
Let’s plan a seperate version where instead of the pizelated animation of making the croissant, we use a realistic pov of making the croissant
```

Model: wrote a plan (a second route, stills first, clips between stills, a fixed camera,
risks, a cost estimate, one test clip before the full run) and six questions:

1. Location: a `/pov` route in the same site, or a separate branch and URL?
2. Hands: visible hands (more real, more risk), or tools and ingredients that move with no hands (safer)?
3. Ending: how does the moustache appear? (a) the real croissant changes into the pixel logo, (b) a chocolate moustache is piped on, (c) no moustache in the footage.
4. Kitchen look: warm rustic wood, or clean marble and steel?
5. Page design: keep the pixel font and cards on the footage, or a calmer photo-led style?
6. Bake beat: is a cut to an oven view acceptable, or should the camera stay above the table?

### Step 13 — Answers to the six questions

```text
1. /pov route is best
2. Tools and ingredients with no hands, like “crop out the hand”
3. b. The chocolate mustafhe
4. Mitchen look clean marble but with some rustic colours on the marble
5. Calmer photo led style
6. Open view
```

Model: read answer 6 as "oven view" (a cut to the oven is acceptable) and said so. It made
a marble base still, two more stills and one test clip, sent the client a contact sheet, and
stopped with three questions:

1. Do you approve this look?
2. Do the floating jug and bowl suit you, or should all tools come in from the frame edge?
3. Is the camera angle right, or do you want a steeper look down with no wall in view?

### Step 14 — Polish request, and answers to the three questions

```text
Make it more polished and premium use the apple design skills, implement liquid glass on the buttons https://github.com/sasaki-ta-instyle/skill-design-system-liquid

Answers to your questions:
Yes this look is alright
Make the tools floating is ok
Camera angle steeper look down
```

Model:

- Installed the liquid glass skill. It used only the glass material rules, not the brand of that skill.
- Sent a subagent to polish the pixel site: warm glass panels, liquid glass buttons, softer motion, blended section backgrounds.
- At the same time, made the POV stills again with a steeper camera, then all six clips, and cut them into frames.
- Reviewed the polish pass, committed and deployed it.

### Step 15 — Which model builds the POV page

```text
Send sonnet 5.5 to make the pov page but for the easier tasks send haiku
```

Model: sent a mid-size model, in an isolated copy of the repository, to build `/pov`. It
reviewed the result, merged and deployed it, then sent a small model for three small fixes
(phone layout, a link between the versions, the card with JavaScript off).

---

## Part 4 — Image optimisation

### Step 16 — WebP and fast loading

```text
Make all the image assets for the animations to be webp to be size efficent and prioritize fast loading
```

Model: found that all frames were already WebP and that the real problem was the missing
browser cache. It re-encoded the frames at smaller sizes, converted the logo to WebP, and
sent a subagent to add long-term caching with a version tag in each image URL, and to give
the first images priority. It checked the headers on the live site.

---

## The end state

After step 16 the original had: two routes (`/` and `/pov`), six scroll-driven beats on each,
two frame sets per route, liquid glass controls, a phone layout, and a live deploy on Vercel.

Things that the client never gave, and that the original left open:

- Real contact details. The buttons link to `#`.
- Changes to the copy. All text is the model's draft.
- Tests on real phones, Safari or Firefox.
