# 00 — Master prompt

Give the text below to the model that will rebuild the site. Give it the whole `handoff/`
folder too, and the `assets/` and `public/` folders if you want an exact copy (Mode A).

If the model cannot read files, paste the documents in this order after the prompt:
`01`, `04`, `05`, `reference/SOURCE.md`, `07`, then the others.

---

```text
You will rebuild an existing website so that it matches the original exactly. The website is
"Bakersfield", a brand-showcase site for a bakery. It has two routes:

  /      a pixel-art story of a croissant being made, driven by scroll
  /pov   the same story as realistic first-person footage, driven by scroll

You have a handoff package. Read it before you write any code. The files, in priority order:

  reference/SOURCE.md            The complete source code of the original. THIS IS THE GROUND TRUTH.
                                 If any other document disagrees with it, SOURCE.md is correct.
  04-architecture.md             Every file, component, formula and constant, explained.
  05-design-and-motion.md        Every design token, layout, breakpoint and animation.
  01-brand-and-copy.md           Brand, palette, fonts, voice and every string of copy.
  03-frame-pipeline.md           How the animation frames are built from the video clips.
  02-asset-generation.md         How the logo, stills and clips were generated (prompts and settings).
  07-verification.md             The acceptance tests. Your work is done only when these pass.
  06-build-prompts.md            The build split into phases, with a prompt for each phase.
  08-deploy.md                   Deployment.
  09-decisions-and-pitfalls.md   Why things are as they are, and the errors to avoid.
  10-skills-and-tools.md         The tools and design references that were used.
  reference/ASSET-MANIFEST.md    Checksums and sizes of every binary asset.

CHOOSE A MODE FIRST

Mode A, exact copy (default). You have the folders assets/ and public/ from the original.
  - Do NOT generate any image or video. Use the files you were given.
  - Recreate every source file so that it matches reference/SOURCE.md. Same file paths, same
    exports, same constants, same CSS values, same copy.
  - Check the binary assets against reference/ASSET-MANIFEST.md.
  - You may rebuild the frames with handoff/scripts/build-frames.sh. With the tool versions in
    03-frame-pipeline.md the result is byte-identical. If your tool versions differ, copy the
    frames, do not rebuild them.

Mode B, from scratch. You do not have assets/ and public/.
  - Generate the logo, the stills and the clips with the prompts and settings in
    02-asset-generation.md, in the order given, and review each one with the criteria there.
  - Be honest with the user: image and video generation is not deterministic. The new assets
    will look similar to the original. They will not be the same pixels.
  - Then build the frames with handoff/scripts/build-frames.sh and continue as in Mode A.

RULES THAT ALWAYS APPLY

1. Fidelity first. Do not improve, modernise, refactor or restyle anything. Do not upgrade a
   dependency. Use the exact versions in package.json. If you think something is a bug, keep
   it and report it. 04 and 05 each have a "Known quirks" section.
2. Never invent facts about the business: no opening hours, prices, addresses, years, awards
   or product claims. Use the copy in 01-brand-and-copy.md exactly. The call-to-action links
   stay href="#" with the TODO comment.
3. Do not add dependencies, fonts, analytics, images or files that the original does not have.
4. Fonts come from the npm packages @fontsource/pixelify-sans and @fontsource-variable/dm-sans.
   Do not use next/font/google or a font CDN.
5. Every image URL goes through withVersion() (src/lib/asset-version.ts). The same file must
   always be requested with the same URL string.
6. Keep commit messages plain. Do not put a model name in a commit message.
7. Do not deploy and do not push to a production branch until the acceptance tests pass and
   the user says to deploy.
8. Work phase by phase as 06-build-prompts.md describes. After each phase, run the checks for
   that phase and fix what fails before you continue.
9. Verify with your own eyes. Take screenshots at the viewports in 07-verification.md and look
   at them. A passing build is not proof that the page looks right.
10. Report honestly. At the end, list what matches, what differs and why, and what you did not
    test. Do not say that something works if you did not check it.

DEFINITION OF DONE

  - npm run lint and npm run build pass with zero errors.
  - Every check in 07-verification.md passes, on both routes, at every listed viewport.
  - A file-by-file comparison of your src/ with reference/SOURCE.md shows no difference, or you
    list every difference and its reason.
  - In Mode A, every binary asset matches reference/ASSET-MANIFEST.md.

Start now: read the package, tell me which mode applies and why, then begin Phase 0.
```

---

## Notes for the person who uses this prompt

- **For a true copy, the fastest method is to clone the repository.** This package is for the
  case where another model must build the site again from a description.
- **Give the model the binary folders if you can.** Without `assets/` and `public/`, the
  pictures will be new and different. The code can match exactly; the generated pictures
  cannot.
- **`reference/SOURCE.md` is long** (several thousand lines). A model with a small context
  window should read it one file at a time, in the order of `06-build-prompts.md`.
- **If you want the same working method** (one orchestrator, subagents for the build, a review
  of screenshots before each commit), give the model section 4 of `09-decisions-and-pitfalls.md`.
