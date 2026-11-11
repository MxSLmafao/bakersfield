import { Hero } from '@/components/Hero';
import { StorySection } from '@/components/StorySection';
import { ProgressRail } from '@/components/ProgressRail';
import { Visit } from '@/components/Visit';
import { beats } from '@/content/beats';

export default function Home() {
  const hero = beats.find((beat) => beat.kind === 'hero');
  const visit = beats.find((beat) => beat.kind === 'outro');

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
