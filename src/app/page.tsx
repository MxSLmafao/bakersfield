import { preload } from 'react-dom';
import { Hero } from '@/components/Hero';
import { StorySection } from '@/components/StorySection';
import { ProgressRail } from '@/components/ProgressRail';
import { Visit } from '@/components/Visit';
import { beats, sequenceBeats } from '@/content/beats';
import { withVersion } from '@/lib/asset-version';

export default function Home() {
  const hero = beats.find((beat) => beat.kind === 'hero');
  const visit = beats.find((beat) => beat.kind === 'outro');

  // First frame of the first story segment, one per screen size. Same URL as the frame loader.
  const first = sequenceBeats[0];
  preload(withVersion(`${first.frames.dir}/0001.${first.frames.ext}`), {
    as: 'image',
    fetchPriority: 'low',
    media: '(min-width: 768px)',
  });
  preload(withVersion(`${first.framesSm.dir}/0001.${first.framesSm.ext}`), {
    as: 'image',
    fetchPriority: 'low',
    media: '(max-width: 767px)',
  });

  return (
    <>
      <main id="main">
        {hero && <Hero beat={hero} />}
        <StorySection />
        {visit && <Visit beat={visit} />}
      </main>
      <ProgressRail />
    </>
  );
}
