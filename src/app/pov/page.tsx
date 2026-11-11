import type { Metadata } from 'next';
import { PovHero } from '@/components/pov/PovHero';
import { PovStory } from '@/components/pov/PovStory';
import { PovOutro } from '@/components/pov/PovOutro';

export const metadata: Metadata = {
  title: "Bakersfield — the baker's view",
  description:
    "Follow a Bakersfield croissant from flour to oven, filmed from the baker's side of the counter.",
};

export default function PovPage() {
  return (
    <main id="main">
      <PovHero />
      <PovStory />
      <PovOutro />
    </main>
  );
}
