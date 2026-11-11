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
    body: 'A croissant with character.',
    kind: 'hero',
  },
  sequence(
    'ingredients',
    2,
    'ingredients',
    'Four simple things',
    'Flour, butter, water and yeast. Every croissant starts here.',
  ),
  sequence(
    'dough',
    3,
    'dough',
    'Into the dough',
    'The four come together and the dough turns smooth.',
  ),
  sequence(
    'lamination',
    4,
    'lamination',
    'Layer by layer',
    'Butter is folded in, again and again. Each fold makes new layers.',
  ),
  sequence(
    'proof',
    5,
    'proof',
    'Time to rise',
    'The croissant takes its shape. Then it rests and grows.',
  ),
  sequence(
    'bake',
    6,
    'bake',
    'Golden in the oven',
    'The oven glows. The croissant turns a deep golden brown.',
  ),
  sequence(
    'mustache',
    7,
    'mustache',
    'The finishing touch',
    'One fine French moustache. Now it is a Bakersfield.',
  ),
  {
    id: 'visit',
    slug: 'visit',
    index: 8,
    title: 'Come say bonjour',
    body: 'The croissant is ready. So are we.',
    kind: 'outro',
  },
];

export const sequenceBeats: readonly SequenceBeat[] = beats.filter(
  (beat): beat is SequenceBeat =>
    beat.kind === 'sequence' && beat.frames !== undefined && beat.poster !== undefined,
);
