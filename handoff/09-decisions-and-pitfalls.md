# 09 — Decisions, their reasons, and pitfalls

A rebuild that follows the specification but does not know these points will repeat the same
errors. Each row is something that was decided, or something that went wrong and was fixed.

## 1. Product decisions

| Decision | Reason |
|---|---|
| Scroll-scrubbed **frame sequence**, not a video player | Scroll must drive time in both directions. Canvas frames give exact control and work on every browser. Video seeking is slow and uneven. |
| **One pinned stage** for all six beats | The clips join frame to frame. Six separate pinned sections would scroll the same table away and back six times. |
| **Square** pixel frames on a flat background | The model returned square stills. A square on a flat cream page fits desktop and phone with no crop. |
| **Contain** fit for the pixel frames, **cover** for POV in landscape | The pixel table reaches the frame edges, so a crop cuts it. The POV action is in the centre, so a crop is safe. |
| POV in portrait: 16:9 box on top, copy below | Cover-cropping 16:9 to a tall phone screen loses most of the picture. |
| Two frame sets per version | Phones and slow connections get smaller, fewer frames. |
| Load frames **two segments at a time** | A visitor who never scrolls downloads little. The current segment and the next are always ready. |
| Shorter pin on phones (85 vh per beat, desktop 130 vh) | Eight screens of swiping was too long on a phone. |
| No smooth-scroll library on touch devices | Native touch momentum must stay. Lenis runs only on fine pointers. |
| Cross-fade only at the two POV hard cuts | The other joins are seamless. A fade there would blur a good join. |
| Liquid glass on controls and cards only | `backdrop-filter` is costly. It is never used on a full-screen layer. |
| Pixel font kept for wordmark, numbers and titles on `/` | Crisp pixel type on soft glass is the signature of the pixel version. |
| `/pov` uses DM Sans for titles | The realistic version is calmer and led by the footage. |
| Plain `<a>` links between `/` and `/pov` | See pitfall 9. |

## 2. Pitfalls that happened, and the fix

1. **"fi" ligature.** "The finishing touch" showed as "The Anishing touch", because Pixelify
   Sans draws its "fi" ligature like an "A". Fix: `font-variant-ligatures: no-common-ligatures` on `:root`.
2. **Faint square around a frame.** The last pixel clip had a different background tint. Fix:
   normalise every frame's background to `#F7E3B8` (`03-frame-pipeline.md`), set the page
   colour to the same value, and mask the frame edge in CSS.
3. **Moustache too large.** The first edit prompt gave a moustache bigger than the croissant.
   Fix: give explicit size limits in the prompt ("about half as wide as the croissant and stays
   completely inside the croissant's outline").
4. **Gemini ignored the requested size** and returned 1024×1024. The square was kept on purpose.
5. **Deep links landed one beat early.** A target exactly on a segment boundary rounded down.
   Fix: aim 0.5% of a segment inside the segment, and add a small epsilon in `segmentAt`.
6. **Lazy loading that was not lazy.** The story starts about one screen below the hero, so a
   "near the viewport" gate fired at once and all frames loaded. Fix: load only the focus
   segment and the next one; load more only when the segment changes.
7. **Stale server.** A `next start` process from an earlier build kept the port and served old
   files. Tests then measured the old build. Fix: stop the old process and confirm the port is
   free before each test run.
8. **The `/pov` header rule.** `/pov` is a page and also an image folder. A rule such as
   `/pov/:path*` would also match the page and make its HTML immutable. Fix: match only
   `/pov/:slug/:file(.+\.webp)`.
9. **"Preloaded but not used" warning.** `/` preloads the first story frame. Next.js prefetched
   the linked route, so `/pov` received a preload it did not use. `prefetch={false}` did not
   stop it. Fix: the two links between the versions are plain `<a>` elements. The cost is a
   full page load when a visitor changes version.
10. **The same file under two URLs.** A preload or poster URL that differs from the frame
    loader's URL (for example by the `?v=` query) makes the browser fetch the file twice. Fix:
    build every image URL with `withVersion()`.
11. **Card hidden without JavaScript.** The visit card started hidden and waited for a script
    to reveal it. Fix: visible by default in CSS; the client adds the hidden state only when
    the card is below the fold and reduced motion is off.
12. **Hard colour step before the last section.** A flat butter block followed the story.
    Fix: a warm gradient close to the stage colour.
13. **Empty space on phones.** The pixel frame's top quarter is empty except when an item
    falls. The frame is lifted by 20% of its size. On `/pov` the frame and copy group is
    centred at about 46% of the screen height.
14. **A worktree was committed.** An agent's git worktree under `.claude/worktrees/` was added
    as an embedded repository link. It was removed and the folder is in `.gitignore`.
15. **Model name in a commit.** Commit `28b17c8` carries a `Co-Authored-By` trailer with a
    model name. Commit messages in this project must not name a model. A history rewrite was
    blocked, so that one commit stays as it is.
16. **A relative `rm -rf *` after `cd`.** A safety check stopped it. Never clean a folder with
    a relative glob. Write to a new empty folder instead.

## 3. Known limits of the current site (not fixed)

- Not tested on real phones, iOS Safari, Android Chrome or Firefox. All tests ran in Chromium, including emulated phones.
- `backdrop-filter` and `corner-shape` rendering are not verified outside Chromium.
- No Lighthouse or slow-network measurement.
- `prefers-reduced-transparency` is not handled.
- The beat numbers (about 3.9:1) and the focus ring (about 2.9:1) are a little under the strict contrast targets.
- On portrait phones, the POV frame moves about 12 px when the caption height changes between beats.
- The call-to-action links go to `#`.
- `npm audit` reported 8 issues in dependencies (7 moderate, 1 high) at scaffold time. They were not fixed.
- The first-frame preload on `/` does not match the chosen frame set in three cases, and the browser then logs "preloaded but not used": a short landscape phone (for example 844x390), a data-saver or slow connection on a wide screen, and reduced-motion mode (which loads no frames). The preload uses a width query only; the frame loader uses `wantsSmallFrames()`.
- More small quirks, found when the code was documented, are listed at the end of `04-architecture.md` and `05-design-and-motion.md` under "Known quirks". A rebuild must keep them to stay identical.

## 4. Working method that produced the site

- One orchestrator planned, wrote all generation prompts, reviewed every result and committed.
- Build work went to subagents with long, exact briefs. Hard tasks went to a larger model,
  small tasks to a small one.
- Every brief had the same parts: context, files to read first, exact tasks, files that must
  not be touched, a verification section with screenshots, and a report format that asks what
  was **not** tested.
- The orchestrator looked at the screenshots of every pass before a commit. Reports were not
  trusted alone.
- When two agents had to work at the same time on shared files, one worked in an isolated git
  worktree and wrote only new files.
