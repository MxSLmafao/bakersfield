import type { FrameSet } from '@/content/beats';

export type PovBeatKind = 'hero' | 'sequence' | 'outro';

export type PovBeat = {
  id: string;
  slug: string;
  /** Position in the story, starting at 1 for the hero. */
  index: number;
  title: string;
  body: string;
  kind: PovBeatKind;
};

/** A beat that plays a first-person frame sequence. */
export type PovSequenceBeat = PovBeat & {
  frames: FrameSet;
  poster: string;
  framesSm: FrameSet;
  posterSm: string;
};

const sequence = (slug: string, index: number, title: string, body: string): PovSequenceBeat => ({
  id: slug,
  slug,
  index,
  title,
  body,
  kind: 'sequence',
  frames: { dir: `/pov/${slug}`, count: 51, ext: 'webp' },
  poster: `/pov/${slug}/poster.webp`,
  framesSm: { dir: `/pov-sm/${slug}`, count: 39, ext: 'webp' },
  posterSm: `/pov-sm/${slug}/poster.webp`,
});

export const povHero = {
  title: 'Bakersfield',
  line: "From the baker's side of the counter.",
  /** First frame of the story, used as the full-bleed backdrop. */
  image: '/pov/ingredients/0001.webp',
  imageSm: '/pov-sm/ingredients/0001.webp',
} as const;

export const povSequenceBeats: readonly PovSequenceBeat[] = [
  sequence('ingredients', 2, 'Four simple things', 'Flour, butter, water and yeast. Nothing else is needed.'),
  sequence('dough', 3, 'Into the dough', 'Water meets flour. A few turns, and it comes together.'),
  sequence(
    'lamination',
    4,
    'Layer by layer',
    'Butter is folded in, again and again. This is where the flakes come from.',
  ),
  sequence('proof', 5, 'Shape and rest', 'One cut, one roll. Then time does the work.'),
  sequence('bake', 6, 'Into the oven', 'It rises, it opens, it turns gold.'),
  sequence(
    'mustache',
    7,
    'The finishing touch',
    'One fine moustache, in dark chocolate. Now it is a Bakersfield.',
  ),
];

/** Number shown as "02 / 07": hero is 01, the last sequence beat is 07. */
export const POV_BEAT_TOTAL = 7;

/**
 * Segments that start with a hard cut to a different shot (proof to bake,
 * bake to mustache). The frame engine cross-fades these by scroll progress.
 */
export const POV_CUT_SEGMENTS: readonly number[] = [4, 5];

export const povOutro = {
  title: 'Come say bonjour',
  body: 'The croissant is ready. So are we.',
  cta: 'Come say bonjour',
  secondary: 'See the pixel version',
} as const;

export const POV_STORY_ALT =
  'A first-person view of a croissant being made on a marble worktop, from flour to a golden bake.';
