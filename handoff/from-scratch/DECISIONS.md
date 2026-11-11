# Decision sheet — the client's answers, by topic

Use this file to answer any question that the new model asks. It has every decision that the
client made in the original session, and nothing that the client did not decide.

If the model asks about something that is not here, the client did not decide it in the
original. The original model then chose a default and reported it. Tell the new model to do
the same: "Choose what you recommend, and tell me what you chose."

## 1. The brand

| Topic | Decision |
|---|---|
| Name | Bakersfield |
| Business | A bakery |
| Logo | A pixelated croissant with a French moustache on it |
| Logo source | No file existed. Generate it with the Gemini 3.1 Flash Image model of the Higgsfield MCP server. |
| Logo approval | The first result was approved. |
| Pixel style | Soft 16-bit (soft edges and gentle shading, not harsh 8-bit) |
| Fonts | Choose with the `taste-skill` and the typography skills. The model's proposal, Pixelify Sans for display and DM Sans for body, was approved. |
| Wordmark | The model asked "pixel font or serif?". The client did not answer directly; the approved font pair settled it (pixel font). |

## 2. The site

| Topic | Decision |
|---|---|
| Purpose | Brand showcase. No ordering, no shop. |
| Scope | One scroll page first |
| Stack | Next.js |
| Core interaction | "Option B": a scroll story where the croissant is made step by step, with a frame sequence. Not the video fly-through. |
| Skills | "Uses all those skills to make an interactive website" |
| Story beats | The model's eight beats were approved: Hero, Ingredients, Dough, Lamination, Proof, Bake, Mustache reveal, Visit |
| Video quality | 720p or lower, "so it is small but looks good enough" |
| Budget | No fixed cap. Keep a sense of the cost of AI generation. If it becomes too much, ask. |
| Copy | Not given. The model wrote it. No facts about the business were given, so none may be invented. |
| Contact details | Not given. Buttons link to a placeholder. |
| Host | Vercel, through the Vercel MCP |
| Domain | Not given. The default Vercel address is used. |

## 3. The working method

| Topic | Decision |
|---|---|
| Role of the main model | Orchestrator. It reviews the work. |
| Who builds | Subagents on a small fast model ("haiku") |
| Who writes the image and video prompts | The orchestrator |
| The `/pov` page | A subagent on a mid-size model ("sonnet 5.5") |
| Easy tasks after that | Subagents on the small fast model |
| Message style to the client | ASD-STE100 (Simplified Technical English), about 75%, for chat messages only. Saved as a standing rule in `CLAUDE.md`. |

## 4. Mobile

| Topic | Decision |
|---|---|
| Request | "Optimise it for mobile devices". No detail was given. The model chose what to do. |

## 5. The first-person version

| Topic | Decision |
|---|---|
| Idea | A separate version: a realistic first-person view of making the croissant, in place of the pixel animation |
| Location | A `/pov` route in the same site |
| Hands | None. Tools and ingredients move with no hands, "like crop out the hand" |
| Floating tools | Accepted ("Make the tools floating is ok") |
| Moustache ending | A chocolate moustache, piped onto the croissant |
| Kitchen | Clean marble, with some rustic colours in the marble |
| Page design | Calmer, photo-led style |
| Bake beat | The client wrote "Open view". The model read this as "oven view": a cut to an oven shot is acceptable. The client did not correct it. |
| Test look | Approved ("Yes this look is alright") |
| Camera | Steeper look down than the first test |

## 6. Polish

| Topic | Decision |
|---|---|
| Request | "More polished and premium" |
| Reference | The Apple design skills |
| Buttons | Liquid glass, with `skill-design-system-liquid` |

## 7. Images

| Topic | Decision |
|---|---|
| Format | All animation image assets as WebP |
| Goal | Small size, and fast loading first |

## 8. Approvals that the client gave during the work

| When | What |
|---|---|
| After the logo was shown | "Logo approved" |
| After the font proposal | "Looks good then" |
| After the beat list | "Yes looks good" |
| Vercel team access link | "Done" |
| GitHub connection in Vercel | "Done" |
| After the POV test clip | "Yes this look is alright" |

## 9. Things the client never decided

The original model chose these itself and reported them. The new model is free here.

- The exact palette (the original measured it from the logo).
- The copy and the tagline.
- Square or wide pixel frames.
- How the six beats join (the original made one continuous pinned story).
- Frame sizes, frame counts and quality settings.
- Every detail of the mobile pass.
- Every detail of the polish pass, apart from "liquid glass on the buttons".
- The cross-fade at the oven cut.
- The caching method.
- The link between the two versions.
