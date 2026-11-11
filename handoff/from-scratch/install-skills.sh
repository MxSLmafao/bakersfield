#!/usr/bin/env bash
# Install the same skills, at the same versions, that the original build had.
#
# Usage:  bash install-skills.sh [TARGET_DIR]
# Default TARGET_DIR: .claude/skills   (run from the root of the new, empty repository)
#
# Needs: git, npm, tar. Network access to github.com and registry.npmjs.org.
# Result: 73 skill folders in TARGET_DIR.
#
# Each source is pinned to the commit that the original build used. To take the
# newest version of a source instead, replace its commit with "HEAD".
set -euo pipefail

TARGET="${1:-.claude/skills}"
mkdir -p "$TARGET"
TARGET="$(cd "$TARGET" && pwd)"
WORK="$(mktemp -d)"

# fetch <name> <repo url> <commit>  -> checks the commit out in $WORK/<name>
fetch() {
  local name="$1" url="$2" commit="$3"
  mkdir -p "$WORK/$name"
  git -C "$WORK/$name" init -q
  git -C "$WORK/$name" remote add origin "$url"
  if [ "$commit" = "HEAD" ]; then
    git -C "$WORK/$name" fetch -q --depth 1 origin HEAD
  else
    git -C "$WORK/$name" fetch -q --depth 1 origin "$commit"
  fi
  git -C "$WORK/$name" checkout -q FETCH_HEAD
  echo "fetched $name @ $(git -C "$WORK/$name" rev-parse --short HEAD)"
}

# 1. scroll-world  (one skill)
fetch scroll-world https://github.com/oso95/scroll-world.git 71cc36d3bb150248ae36a2c552f9cbf88802a79c
cp -r "$WORK/scroll-world/skills/scroll-world" "$TARGET/"

# 2. 3d-animation-landing  (npm package, version 1.0.1; SKILL.md, README.md, references/)
mkdir -p "$WORK/npm" "$TARGET/3d-animation-landing"
( cd "$WORK/npm" && npm pack --silent claude-skill-3d-animation-landing@1.0.1 >/dev/null \
  && tar xzf claude-skill-3d-animation-landing-1.0.1.tgz )
cp -r "$WORK/npm/package/SKILL.md" "$WORK/npm/package/README.md" "$WORK/npm/package/references" \
  "$TARGET/3d-animation-landing/"

# 3. scrollytelling-brand-site  (one skill)
fetch scrollytelling https://github.com/abdelrhman2007/scrollytelling-brand-site.git aff7df4e6bb9942f9dd92afc971a387be7d30143
cp -r "$WORK/scrollytelling/skills/scrollytelling-brand-site" "$TARGET/"

# 4. higgsfield-ai/skills  (9 skills at the repository root)
fetch higgsfield-ai https://github.com/higgsfield-ai/skills.git 27000402070db19d958789d05b3b52b6f4718d7c
for d in "$WORK"/higgsfield-ai/higgsfield-*/; do cp -r "$d" "$TARGET/"; done

# 5. OSideMedia/higgsfield-ai-prompt-skill  (root router as "higgsfield" + 36 sub-skills)
fetch osidemedia https://github.com/OSideMedia/higgsfield-ai-prompt-skill.git 6a6a5dd105d285782dd6992692be4d8b3825ca13
mkdir -p "$TARGET/higgsfield"
cp "$WORK/osidemedia/SKILL.md" "$TARGET/higgsfield/"
for d in "$WORK"/osidemedia/skills/higgsfield-*/; do cp -r "$d" "$TARGET/"; done

# 6. emilkowalski/skills  (ONLY the apple-design skill; the client linked that one file)
fetch emil https://github.com/emilkowalski/skills.git 715c1807e08c497cfd1dc4feb450a2a3300ef2a9
cp -r "$WORK/emil/skills/apple-design" "$TARGET/"

# 7. dickwu/apple-design-skill  (also named "apple-design", so it goes in its own folder)
fetch dickwu https://github.com/dickwu/apple-design-skill.git ff4ebddf0488598723a82bfdce1afb04de0b1c44
mkdir -p "$TARGET/apple-design-dickwu"
cp -r "$WORK/dickwu/SKILL.md" "$WORK/dickwu/references" "$WORK/dickwu/scripts" "$TARGET/apple-design-dickwu/"

# 8. leonxlnx/taste-skill  (one skill; installed later, when fonts were chosen)
fetch taste https://github.com/leonxlnx/taste-skill.git f6b76575f949707b4e3c37cd86cb44b0b98643e8
cp -r "$WORK/taste/skills/taste-skill" "$TARGET/"

# 9. jpoindexter/typography-skills  (21 skills; installed with the taste skill)
fetch typography https://github.com/jpoindexter/typography-skills.git 615006a142464d1a5abfa16304fbafa5e2ffef20
for d in "$WORK"/typography/skills/*/; do cp -r "$d" "$TARGET/"; done

# 10. sasaki-ta-instyle/skill-design-system-liquid  (one skill; installed for the polish pass)
fetch liquid https://github.com/sasaki-ta-instyle/skill-design-system-liquid.git 720813af3df7ed3bfdccaf14cc97c055e7623bcd
mkdir -p "$TARGET/skill-design-system-liquid"
cp -r "$WORK/liquid/SKILL.md" "$WORK/liquid/README.md" "$WORK/liquid/LICENSE" \
  "$WORK/liquid/rules" "$WORK/liquid/examples" "$WORK/liquid/assets" \
  "$TARGET/skill-design-system-liquid/"

echo "installed $(find "$TARGET" -mindepth 1 -maxdepth 1 -type d | wc -l) skill folders in $TARGET"
echo "temporary clones are in $WORK (safe to delete by hand)"
