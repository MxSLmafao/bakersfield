export type BeatKind = 'hero' | 'sequence' | 'outro';

export type FrameSet = {
  /** Public folder that holds the frame files, e.g. /frames/dough */
  dir: string;
  /** Number of frames. 0 means the frames are not delivered yet. */
  count: number;
  /** File extension of the frames. */
  ext: 'webp' | 'jpg';
};

export type Beat = {
  id: string;
  slug: string;
  /** Position in the page, starting at 1 for the hero. */
  index: number;
  title: string;
  body: string;
  kind: BeatKind;
  frames?: FrameSet;
  poster?: string;
};

/** A beat that plays a frame sequence. */
export type SequenceBeat = Beat & { frames: FrameSet; poster: string };

const sequence = (slug: string, index: number, id: string, title: string, body: string): Beat => ({
  id,
  slug,
  index,
  title,
  body,
  kind: 'sequence',
  frames: { dir: `/frames/${slug}`, count: 60, ext: 'webp' },
  poster: `/frames/${slug}/poster.webp`,
});

export const beats: readonly Beat[] = [
  {
    id: 'hero',
    slug: 'hero',
    index: 1,
    title: 'Bakersfield',
    body: 'Warm bread, baked with care.',
    kind: 'hero',
  },
  sequence(
    'ingredients',
    2,
    'ingredients',
    'Simple ingredients',
    'Flour, butter, water and yeast come together. Good bread starts here.',
  ),
  sequence(
    'dough',
    3,
    'dough',
    'Kneaded by hand',
    'The dough is worked until it is smooth and strong.',
  ),
  sequence(
    'lamination',
    4,
    'lamination',
    'Layer by layer',
    'Cold butter is folded in, again and again. Each fold makes a new layer.',
  ),
  sequence(
    'proof',
    5,
    'proof',
    'Time to rise',
    'The dough rests and grows slowly, light and full of air.',
  ),
  sequence(
    'bake',
    6,
    'bake',
    'Golden in the oven',
    'The oven glows. The croissant turns a deep, golden brown.',
  ),
  sequence(
    'mustache',
    7,
    'mustache',
    'Our little moustache',
    'Look closely. Can you spot the moustache?',
  ),
  {
    id: 'visit',
    slug: 'visit',
    index: 8,
    title: 'Come and visit',
    body: 'Pop in and say hello. We would love to see you.',
    kind: 'outro',
  },
];

export const sequenceBeats: readonly SequenceBeat[] = beats.filter(
  (beat): beat is SequenceBeat =>
    beat.kind === 'sequence' && beat.frames !== undefined && beat.poster !== undefined,
);
