# 02 — Asset generation: every prompt and parameter

This file records how every generated image and video clip was made, in order.

**Read this first.** AI image and video generation is not deterministic. If you run these
prompts again, you get similar results, not the same pixels. For an exact copy of the site,
**do not regenerate**: use the saved files in `assets/` (see section 1). Use the prompts only
if you must make the assets again (for example, for a different brand).

## 1. Saved outputs (use these for an exact copy)

| What | Path | Count | Format |
|---|---|---|---|
| Logo source | `assets/brand/logo-mark-source.jpg` | 1 | JPEG 1024×1024 |
| Pixel stills | `assets/scenes/s0…s6-*.jpg` | 7 | JPEG 1024×1024 |
| POV stills (used) | `assets/pov/q0…q6-*.jpg`, `assets/pov/o1-*.jpg`, `assets/pov/o2-*.jpg` | 9 | JPEG 1280×720 |
| POV stills (not used) | `assets/pov/p0…p2-*.jpg` | 3 | JPEG 1280×720. First test with a lower camera angle. Rejected. Keep for history only. |
| Pixel clips | `assets/video/pixel/c1…c6.mp4` | 6 | H.264, 960×960, 30 fps, 4.0 s, 120 frames, no audio |
| POV clips | `assets/video/pov/v1…v6.mp4` | 6 | H.264, 1280×720, 30 fps, 5.0 s, 150 frames, no audio |

Checksums and sizes of all of these are in `reference/ASSET-MANIFEST.md`.

The frames that the site serves (`public/frames*`, `public/pov*`) are built from the clips by
`scripts/build-frames.sh`. That step **is** deterministic. See `03-frame-pipeline.md`.

## 2. Tools and models

All generation used one MCP server ("Higgsfield MCP") with two tools.

| Tool | Model id | Used for |
|---|---|---|
| `generate_image` | `ag/gemini-3.1-flash-image` | Logo, first pixel still (text to image) |
| `generate_image` | `qwen-image-3.0-pro` | Every edit of an existing still (`reference_image_url`) |
| `generate_image` | `wan2.7-image-pro` | Photoreal base stills (text to image) |
| `generate_video` | `wan3.0-video` | Every clip, with a first frame and a last frame |

Rules that applied to every call:

- `prompt_extend: false` on every `qwen`, `wan2.7` and `wan3.0` call. The prompts are exact; do not let the service rewrite them.
- Video: `resolution: "720P"`, `audio: false`.
- The image and video tools need a **public URL** for a reference image or a first/last frame.
  Each still was saved as a JPEG (Pillow, `quality=93`, RGB), committed, pushed, and then
  referenced as
  `https://raw.githubusercontent.com/<owner>/<repo>/<branch>/assets/<folder>/<file>.jpg`.
  Any public host works.
- The image tool sometimes times out after 60 s. Retry the same call once.

## 3. The chaining method (the reason the story has no cuts)

1. Make one **base still** (the empty table, or the empty marble).
2. Make each next still by **editing the still before it** with `qwen-image-3.0-pro`. The edit
   prompt always ends by naming what must stay the same (table, camera angle, light,
   background). This keeps one scene across all stills.
3. Make each clip with `first_frame_url` = still N and `last_frame_url` = still N+1.
   The last frame of clip N is then the first frame of clip N+1, so the clips join with no
   visible cut when they play back to back.
4. Every video prompt starts with the style, then `locked-off static camera, no camera
   movement, no zoom`, and ends with a list of things that must not appear.

Review each still before you use it in a clip. Review each clip on a contact sheet
(`ffmpeg -i clip.mp4 -vf "select='not(mod(n,17))',scale=300:-1,tile=8x1" -frames:v 1 sheet.jpg`).

## 4. Logo

`generate_image`, model `ag/gemini-3.1-flash-image`, `size: "1024*1024"`, `quality: "hd"`,
`output_format: "png"` (the service returned a 1024×1024 JPEG). Saved as
`assets/brand/logo-mark-source.jpg`. One attempt, approved by the client.

```text
Logo mark for a bakery brand called Bakersfield. A pixelated croissant, viewed straight on, golden-brown with soft 16-bit pixel art shading (soft pixel edges, gentle gradients, not harsh 8-bit). The croissant wears a thin, neatly curled French mustache across its center, the mustache in dark brown. Clean flat background in plain cream (#F6EBD9), no text, no border, centered composition with generous margin, bold readable silhouette that works at small sizes.
```

The palette in `01-brand-and-copy.md` was measured from this image (median-cut quantisation of
the croissant pixels, background excluded). It was not chosen by eye.

## 5. Pixel version: stills

All stills are 1024×1024. The first was asked for at `1280*720`, but the Gemini model returned
a square image. The square was kept, because a square frame on a flat cream background blends
into the page on every screen shape.

### s1 — ingredients (the first still made)

`ag/gemini-3.1-flash-image`, `size: "1280*720"`, `output_format: "jpeg"`. Saved as `assets/scenes/s1-ingredients.jpg`.

```text
Soft 16-bit pixel art illustration, wide 16:9 scene, same style as a retro game cutscene with soft pixel edges and gentle shading. A wooden bakery worktable seen from a slight three-quarter top-down angle against a plain flat cream background (#F6E7CA). On the table: a small pile of white flour, a block of yellow butter, a glass jug of water, and a small bowl of yeast, arranged with space between them. Warm palette of cream, butter yellow, honey gold, amber, and dark chocolate brown outlines (#462217). No text, no people, no logo, clean composition, centered, generous margins.
```

### s0 — empty table

`qwen-image-3.0-pro`, reference `s1-ingredients.jpg`, `size: "1024*1024"`. Saved as `assets/scenes/s0-table.jpg`.

```text
Edit this pixel art image: remove the flour pile, the butter block, the water jug and the bowl from the table so the wooden table top is completely empty and clean. Keep the table, the camera angle, the pixel art style, the colours and the plain cream background exactly the same. No text.
```

### s2 — dough ball

`qwen-image-3.0-pro`, reference `s0-table.jpg`, `size: "1024*1024"`. Saved as `assets/scenes/s2-dough.jpg`.

```text
Edit this pixel art image: add one smooth round ball of pale cream-coloured bread dough sitting in the centre of the table top, with a light dusting of white flour on the wood around it. Soft 16-bit pixel art with dark brown outlines, matching the existing style. Keep the table, camera angle, colours and plain cream background exactly the same. No text.
```

### s3 — laminated slab

`qwen-image-3.0-pro`, reference `s0-table.jpg`, `size: "1024*1024"`. Saved as `assets/scenes/s3-laminated.jpg`.

```text
Edit this pixel art image: add one flat rectangular slab of folded laminated pastry dough in the centre of the table top, folded in three like a letter, with the cut side facing the viewer showing thin alternating stripes of pale dough and yellow butter layers. Light dusting of flour on the wood. Soft 16-bit pixel art with dark brown outlines, matching the existing style. Keep the table, camera angle, colours and plain cream background exactly the same. No text.
```

### s4 — raw croissant

`qwen-image-3.0-pro`, reference `s0-table.jpg`, `size: "1024*1024"`. Saved as `assets/scenes/s4-raw-croissant.jpg`.

```text
Edit this pixel art image: add one large raw unbaked croissant in the centre of the table top, crescent shaped with the two tips pointing down and visible rolled segments, pale cream dough colour (not browned), plump and puffy. Soft 16-bit pixel art with dark brown outlines, matching the existing style. Keep the table, camera angle, colours and plain cream background exactly the same. No text, no face.
```

### s5 — baked croissant

`qwen-image-3.0-pro`, reference `s4-raw-croissant.jpg`, `size: "1024*1024"`. Saved as `assets/scenes/s5-baked-croissant.jpg`.

```text
Edit this pixel art image: the croissant is now fully baked. Recolour only the croissant to a rich golden-brown with honey-gold highlights and amber and deep orange-brown shading, glossy flaky baked crust, slightly larger and puffier, same crescent shape and same position. Soft 16-bit pixel art with dark brown outlines. Keep the table, camera angle and plain cream background exactly the same. No text, no face.
```

### s6 — croissant with moustache

`qwen-image-3.0-pro`, reference `s5-baked-croissant.jpg`, `size: "1024*1024"`. Saved as `assets/scenes/s6-mustache.jpg`.

This is the **second** attempt. The first prompt asked for "a thick dark chocolate-brown French
handlebar mustache with curled-up tips across the middle of the golden croissant". The result
was a moustache larger than the croissant, and it was rejected. The prompt below fixes the
size with explicit limits.

```text
Edit this pixel art image: add a SMALL neat dark chocolate-brown French mustache on the front of the golden croissant, placed on the centre of the croissant's body. The mustache is only about half as wide as the croissant and stays completely inside the croissant's outline, it does not touch the table. Thin elegant shape with small curled-up tips. Most of the golden croissant remains clearly visible above, below and beside the mustache. Keep the croissant, the table, the camera angle and the plain cream background exactly the same. No eyes, no mouth, no text.
```

## 6. Pixel version: clips

All six: `generate_video`, `wan3.0-video`, `duration: 4`, `resolution: "720P"`, `audio: false`,
`prompt_extend: false`, `ratio` left at the default (`adaptive`). Output: 960×960, 30 fps,
120 frames. No clip needed a second attempt.

| Clip | Slug | First frame | Last frame |
|---|---|---|---|
| `c1.mp4` | ingredients | `s0-table.jpg` | `s1-ingredients.jpg` |
| `c2.mp4` | dough | `s1-ingredients.jpg` | `s2-dough.jpg` |
| `c3.mp4` | lamination | `s2-dough.jpg` | `s3-laminated.jpg` |
| `c4.mp4` | proof | `s3-laminated.jpg` | `s4-raw-croissant.jpg` |
| `c5.mp4` | bake | `s4-raw-croissant.jpg` | `s5-baked-croissant.jpg` |
| `c6.mp4` | mustache | `s5-baked-croissant.jpg` | `s6-mustache.jpg` |

### c1 — ingredients

```text
Pixel art animation, soft 16-bit retro game style, locked-off static camera, no camera movement, no zoom. An empty wooden bakery table on a plain cream background. One by one, four ingredients drop gently from above and land on the table with a small bounce: first a pile of white flour with a tiny puff of flour dust, then a block of yellow butter, then a glass jug of water, then a small bowl of yeast. The table, the background and the pixel art style stay perfectly stable and unchanged. Crisp pixel edges, flat colours, limited frame-by-frame sprite animation feel, no blur, no realistic lighting, no text.
```

### c2 — dough

```text
Pixel art animation, soft 16-bit retro game style, locked-off static camera, no camera movement, no zoom. On a wooden bakery table, a pile of flour, a block of butter, a jug of water and a bowl of yeast slide together toward the centre of the table and merge in a soft puff of white flour dust. Out of the puff appears a ball of pale dough, which squashes and stretches as if kneaded by invisible hands, then settles into a smooth round dough ball with flour dusted around it. The table and the plain cream background stay perfectly stable and unchanged. Crisp pixel edges, flat colours, sprite animation feel, no blur, no realistic lighting, no hands, no people, no text.
```

### c3 — lamination

```text
Pixel art animation, soft 16-bit retro game style, locked-off static camera, no camera movement, no zoom. On a wooden bakery table, a round ball of pale dough flattens out into a wide flat rectangle as if rolled by an invisible rolling pin. A flat yellow slab of butter drops onto it, then the dough folds over the butter in thirds like a letter, one fold, then another, ending as a neat folded slab that shows thin alternating layers of pale dough and yellow butter on its front edge. Small puffs of flour at each fold. The table and the plain cream background stay perfectly stable and unchanged. Crisp pixel edges, flat colours, sprite animation feel, no blur, no realistic lighting, no hands, no people, no text.
```

### c4 — proof

```text
Pixel art animation, soft 16-bit retro game style, locked-off static camera, no camera movement, no zoom. On a wooden bakery table, a folded slab of layered pastry dough rolls itself up from both ends and curls into a crescent-shaped raw croissant with rolled segments. Then the pale raw croissant slowly swells and puffs up as it proofs, gently breathing larger, until it is plump. The table and the plain cream background stay perfectly stable and unchanged. Crisp pixel edges, flat colours, sprite animation feel, no blur, no realistic lighting, no hands, no people, no text.
```

### c5 — bake

```text
Pixel art animation, soft 16-bit retro game style, locked-off static camera, no camera movement, no zoom. A pale raw croissant sits on a wooden bakery table. A warm orange oven glow slowly washes over the whole scene and small pixel heat-shimmer waves rise from the croissant. As it bakes, the croissant gradually turns from pale cream to rich golden-brown, grows a little larger and puffier, with glossy flaky crust and tiny wisps of pixel steam. At the end the orange glow fades away, leaving the golden baked croissant on the table. The table and the plain cream background stay stable. Crisp pixel edges, flat colours, sprite animation feel, no blur, no flames, no people, no text.
```

### c6 — mustache

```text
Pixel art animation, soft 16-bit retro game style, locked-off static camera, no camera movement, no zoom. A golden baked croissant sits on a wooden bakery table. A small dark brown curled French mustache floats down from the top of the frame, twirling once, and lands on the centre of the croissant with a little bounce and a squash-and-stretch wiggle. As it lands, a few small pixel sparkles twinkle around the croissant and the croissant gives a tiny proud hop, then settles. The table and the plain cream background stay perfectly stable and unchanged. Crisp pixel edges, flat colours, sprite animation feel, no blur, no eyes, no mouth, no people, no text.
```

## 7. POV version: client decisions that shaped the prompts

- Realistic first-person view of the same six beats.
- **No hands.** Tools and ingredients move by themselves ("as if the hand is cropped out"). Floating objects are accepted.
- Kitchen: **clean marble with rustic colours** in the veins.
- Camera: a **steep look down** at the worktop. No wall, no window, only marble.
- Bake beat: a **cut to an oven view** is accepted.
- Ending: a **chocolate moustache** piped onto the croissant.
- Format: 720p, 16:9.

## 8. POV version: stills

All stills are 1280×720 (`size: "1280*720"`).

### q0 — empty marble

`wan2.7-image-pro` (text to image). Saved as `assets/pov/q0-marble.jpg`.

```text
Photorealistic first-person point-of-view photograph looking steeply down at a bakery worktop, as seen through the baker's own eyes looking down at their work, camera angled about 75 degrees downward, almost overhead. A polished white marble worktop with soft warm veins in honey gold, amber and rust brown fills the ENTIRE frame edge to edge. No wall, no window, no horizon, no background visible, only the marble surface. The surface is completely empty and clean. Slight natural perspective: the far edge of the frame is a little further away than the near edge. Soft natural morning window light coming from the upper left, gentle soft shadows, warm colour palette of cream and honey. Shot on a 35mm lens, everything in sharp focus, high detail, appetising food-photography look. No people, no hands, no text, no logo, no objects.
```

### q1 — ingredients

`qwen-image-3.0-pro`, reference `q0-marble.jpg`. Saved as `assets/pov/q1-ingredients.jpg`.

```text
Edit this photograph, keep it photorealistic: on the marble worktop place baking ingredients arranged in the centre of the frame, seen from the same steep top-down angle: a small mound of white flour directly on the marble, a block of pale yellow butter on parchment paper, a small clear glass jug of water, and a small ceramic bowl of dry yeast. A wooden rolling pin lies along the right side. Natural soft shadows matching the existing light. Keep the marble, its warm veins, the reflections, the camera angle and the lighting exactly the same. No hands, no people, no text.
```

### q2 — dough ball

`qwen-image-3.0-pro`, reference `q1-ingredients.jpg`. Saved as `assets/pov/q2-dough.jpg`.

```text
Edit this photograph, keep it photorealistic: the flour, water and yeast have been mixed into dough. Remove the flour mound, the glass jug and the yeast bowl. Where the flour mound was, in the centre, there is now one smooth round ball of pale bread dough with a light dusting of flour on the marble around it. The butter block on its parchment paper and the wooden rolling pin stay exactly where they are. Keep the marble, its warm veins, the reflections, the camera angle and the lighting exactly the same. No hands, no people, no text.
```

### q3 — laminated slab

`qwen-image-3.0-pro`, reference `q2-dough.jpg`. Saved as `assets/pov/q3-laminated.jpg`.

```text
Edit this photograph, keep it photorealistic: the dough has been rolled out and the butter folded into it. Remove the dough ball, the butter block and the parchment paper. In the centre of the marble there is now one neat rectangular slab of laminated croissant dough, folded in three like a letter, about as wide as the rolling pin is long, with the cut edge facing the camera showing many thin alternating layers of pale dough and yellow butter. Light dusting of flour on the marble around it. The wooden rolling pin stays exactly where it is. Keep the marble, its warm veins, the reflections, the camera angle and the lighting exactly the same. No hands, no people, no text.
```

### q4 — raw croissant

`qwen-image-3.0-pro`, reference `q3-laminated.jpg`. Saved as `assets/pov/q4-raw-croissant.jpg`.

```text
Edit this photograph, keep it photorealistic: the laminated dough has been cut and shaped. Remove the dough slab. In the centre of the marble there is now a sheet of baking parchment, and on it one large raw unbaked croissant: classic crescent shape rolled from a triangle with clearly visible rolled segments, pale cream dough, plump and puffy after proofing, not browned. Light dusting of flour on the marble around the parchment. The wooden rolling pin stays exactly where it is. Keep the marble, its warm veins, the reflections, the camera angle and the lighting exactly the same. No hands, no people, no text.
```

### q5 — baked croissant

`qwen-image-3.0-pro`, reference `q4-raw-croissant.jpg`. Saved as `assets/pov/q5-baked-croissant.jpg`.

```text
Edit this photograph, keep it photorealistic: the croissant is now freshly baked. Change only the croissant: deep golden-brown, glossy, flaky, crisp layered crust with darker caramelised ridges, slightly larger and puffier, same crescent shape and same position on the parchment. A few golden flaky crumbs on the parchment. Remove the loose flour dust from the parchment. Keep the parchment, the wooden rolling pin, the marble, its warm veins, the reflections, the camera angle and the lighting exactly the same. No hands, no people, no text.
```

### q6 — chocolate moustache

`qwen-image-3.0-pro`, reference `q5-baked-croissant.jpg`. Saved as `assets/pov/q6-mustache.jpg`.

```text
Edit this photograph, keep it photorealistic: a small neat French handlebar mustache made of piped dark melted chocolate now sits on top of the baked croissant, across the middle of its widest central segment. The chocolate mustache is glossy dark brown, slightly raised like piped chocolate, symmetrical with small curled-up tips, about one third as wide as the croissant, and it stays completely on the croissant. Keep the croissant, the crumbs, the parchment, the wooden rolling pin, the marble, the reflections, the camera angle and the lighting exactly the same. No eyes, no mouth, no face, no hands, no people, no text.
```

### o1 — raw croissant in the oven

`wan2.7-image-pro` (text to image). Saved as `assets/pov/o1-oven-raw.jpg`.

```text
Photorealistic first-person point-of-view photograph looking into an open built-in oven from just in front of it, as seen through the baker's own eyes crouching at the oven. Inside, on the middle rack, a dark metal baking tray lined with baking parchment holds one large raw unbaked croissant: pale cream dough, classic crescent shape with clearly visible rolled segments, plump. The oven interior is dark enamel, lit by the warm orange glow of the oven light and heating elements. The oven cavity fills the frame, the croissant is centred. Shallow warm reflections on the tray, cinematic food-film look, 35mm lens, high detail. No people, no hands, no oven mitts, no text, no logo.
```

### o2 — baked croissant in the oven

`qwen-image-3.0-pro`, reference `o1-oven-raw.jpg`. Saved as `assets/pov/o2-oven-baked.jpg`.

```text
Edit this photograph, keep it photorealistic: the croissant in the oven is now fully baked. Change only the croissant: deep golden-brown, glossy, flaky, crisp layered crust with darker caramelised ridges, clearly larger and puffier than before, same position on the parchment. Keep the tray, parchment, oven racks, oven interior, lights, camera angle and lighting exactly the same. No hands, no people, no text.
```

## 9. POV version: clips

All six: `generate_video`, `wan3.0-video`, `duration: 5`, `resolution: "720P"`, `ratio: "16:9"`,
`audio: false`, `prompt_extend: false`. Output: 1280×720, 30 fps, 150 frames. No clip needed a
second attempt.

| Clip | Slug | First frame | Last frame | Join to the next clip |
|---|---|---|---|---|
| `v1.mp4` | ingredients | `q0-marble.jpg` | `q1-ingredients.jpg` | seamless |
| `v2.mp4` | dough | `q1-ingredients.jpg` | `q2-dough.jpg` | seamless |
| `v3.mp4` | lamination | `q2-dough.jpg` | `q3-laminated.jpg` | seamless |
| `v4.mp4` | proof | `q3-laminated.jpg` | `q4-raw-croissant.jpg` | **hard cut** (to the oven) |
| `v5.mp4` | bake | `o1-oven-raw.jpg` | `o2-oven-baked.jpg` | **hard cut** (back to the marble) |
| `v6.mp4` | mustache | `q5-baked-croissant.jpg` | `q6-mustache.jpg` | end |

The site softens the two hard cuts with a short cross-fade that scroll drives. See `04-architecture.md`.

### v1 — ingredients

```text
Photorealistic first-person POV cooking footage looking steeply down at a marble worktop, locked-off static camera, no camera movement, no zoom, warm natural window light. No hands and no people are ever visible: objects move by themselves, floating gently. One by one the baking items glide in from outside the frame and settle on the empty marble with a soft landing: first a sheet of parchment with a block of pale yellow butter slides in from the right, then a wooden rolling pin rolls in along the right side, then a small ceramic bowl of yeast, then a clear glass jug of water, and finally white flour pours down from above the frame in a soft stream and builds a mound in the centre with a little puff of flour dust. Realistic textures, real-time natural motion, soft shadows, appetising food-film look. No hands, no fingers, no arms, no text.
```

### v2 — dough

```text
Photorealistic first-person POV cooking footage looking steeply down at a marble worktop, locked-off static camera, no camera movement, no zoom, warm natural window light. No hands and no people are ever visible: objects move by themselves, floating gently. The glass jug lifts, tips and pours its water into a well in the mound of flour, then floats out of the frame. The small bowl lifts, tips and sprinkles the yeast in, then floats out of the frame. A flat metal dough scraper slides in from the bottom edge of the frame and folds and mixes the flour and water into a shaggy dough, pressing and turning it, until it becomes one smooth round ball of pale dough with flour dusted around it, then the scraper slides back out. The butter block on its parchment and the wooden rolling pin stay untouched in place. Realistic dough texture, real-time natural motion, soft shadows, appetising food-film look. No hands, no fingers, no arms, no text.
```

### v3 — lamination

```text
Photorealistic first-person POV cooking footage looking steeply down at a marble worktop, locked-off static camera, no camera movement, no zoom, warm natural window light. No hands and no people are ever visible: objects move by themselves, floating gently. The wooden rolling pin lifts from the right side, floats over the ball of dough and rolls it out flat into a wide rectangle with a few firm passes, then returns to its place on the right. The block of butter slides off its parchment onto the centre of the dough and is pressed flat; the parchment slides out of the frame. The dough folds over the butter in thirds like a letter, one fold then another, with small puffs of flour, ending as a neat folded slab whose front edge shows thin alternating layers of pale dough and yellow butter. Realistic dough and butter texture, real-time natural motion, soft shadows, appetising food-film look. No hands, no fingers, no arms, no text.
```

### v4 — proof

```text
Photorealistic first-person POV cooking footage looking steeply down at a marble worktop, locked-off static camera, warm natural window light. No hands and no people are ever visible: objects move by themselves, floating gently. A sheet of baking parchment slides in under the folded slab of laminated dough. A sharp knife floats in and cuts the slab into a long triangle, then floats out. The triangle of dough rolls itself up from its wide base to its tip and curves its ends into a classic crescent croissant with visible rolled segments. Then the pale raw croissant slowly swells and puffs up as it proofs, growing plump. The wooden rolling pin stays in place on the right. Realistic dough texture, natural motion, soft shadows, appetising food-film look. No hands, no fingers, no arms, no text.
```

### v5 — bake

```text
Photorealistic time-lapse footage looking into a lit oven at a croissant baking on a parchment-lined tray, locked-off static camera, no camera movement, no zoom. Over the shot the pale raw croissant slowly rises and puffs up, its layers separate and open, and its surface gradually turns from pale cream to light gold to a deep glossy golden-brown with caramelised ridges. Gentle heat shimmer in the air, the warm orange oven light glows steadily, butter sizzles faintly on the parchment. The tray, racks and oven interior stay perfectly still. Smooth continuous time-lapse, realistic pastry texture, cinematic food-film look. No hands, no people, no text.
```

### v6 — mustache

```text
Photorealistic first-person POV cooking footage looking steeply down at a freshly baked golden croissant on baking parchment on a marble worktop, locked-off static camera, no camera movement, no zoom, warm natural window light. No hands and no people are ever visible. A piping bag with a fine metal tip floats in from the top edge of the frame, tip pointing down, held from outside the frame. It pipes glossy dark melted chocolate onto the top of the croissant, drawing a French handlebar mustache in two smooth strokes from the centre outward, finishing each side with a small curled-up tip. The chocolate is thick, shiny and slightly raised. The piping bag lifts away and floats out of the frame, leaving the finished chocolate mustache on the croissant. The croissant, crumbs, parchment and wooden rolling pin stay still. Realistic chocolate texture, natural motion, soft shadows, appetising food-film look. No hands, no fingers, no arms, no face, no text.
```

## 10. Generation totals

| Version | Images made | Images kept | Clips made | Clips kept |
|---|---|---|---|---|
| Logo | 1 | 1 | — | — |
| Pixel | 8 | 7 | 6 | 6 |
| POV | 12 | 9 | 7 | 6 |

The rejected items are: the first moustache still (pixel), the three low-angle test stills
(`p0`–`p2`), and one low-angle test clip (POV).

## 11. What to look for when you review a new result

- **Stills:** the table or marble, the camera angle and the light must match the still before it. Reject a still if the scene moved.
- **Pixel clips:** the table and the background must not move or flicker. The background must stay flat cream.
- **POV clips:** no hands, fingers or arms. The marble veins must not drift. The rolling pin stays in its place.
- **All clips:** the first and last frames must match the two stills. If the last frame does not match, the join to the next clip will show.
