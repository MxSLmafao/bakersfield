import { Hero } from '@/components/Hero';
import { BeatSection } from '@/components/BeatSection';
import { ProgressRail } from '@/components/ProgressRail';
import { Visit } from '@/components/Visit';
import { beats, sequenceBeats } from '@/content/beats';

export default function Home() {
  const hero = beats.find((beat) => beat.kind === 'hero');
  const visit = beats.find((beat) => beat.kind === 'outro');

  return (
    <>
      <main id="main">
        {hero && <Hero beat={hero} />}
        {sequenceBeats.map((beat) => (
          <BeatSection key={beat.id} beat={beat} />
        ))}
        {visit && <Visit beat={visit} />}
      </main>
      <ProgressRail />
    </>
  );
}
