'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSequence, type ScrollSequenceHandle } from './ScrollSequence';
import { sequenceBeats } from '@/content/beats';
import { withVersion } from '@/lib/asset-version';
import { setBeatState, useBeatState } from '@/lib/beat-store';
import { PHONE_QUERY, isCoarsePointer, isPhone, stableViewportHeight, wantsSmallFrames } from '@/lib/device';
import { registerBeatY } from '@/lib/scroll';
import { segmentAt } from '@/lib/segments';
import styles from './StorySection.module.css';

gsap.registerPlugin(ScrollTrigger);
// Mobile browsers resize the viewport when the address bar shows or hides.
// Do not refresh the pin for that. A real width change still refreshes it.
ScrollTrigger.config({ ignoreMobileResize: true });

/** Scroll length per beat, as a multiple of the viewport height. */
const VH_PER_BEAT = 1.3;
/** Shorter scroll per beat on phones, so the story is about five screens. */
const VH_PER_BEAT_PHONE = 0.85;
const SEGMENTS = sequenceBeats.length;
const FRAME_SETS = sequenceBeats.map((beat) => beat.frames);
const SMALL_FRAME_SETS = sequenceBeats.map((beat) => beat.framesSm);
const STORY_POSTER = withVersion(sequenceBeats[0].poster);
const STORY_POSTER_SM = withVersion(sequenceBeats[0].posterSm);
const STORY_ALT = 'A croissant being made, from simple ingredients to a golden bake.';

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * Global progress where beat i starts. Aims 0.5% of a segment inside the
 * segment, so rounding never lands on the previous beat.
 */
const beatProgress = (i: number) => (i + 0.005) / SEGMENTS;

/** Pin length in px. Phones use the stable 100svh height, so the address bar does not move it. */
function pinLength(): number {
  const phone = isPhone();
  const vh = isCoarsePointer() ? stableViewportHeight() : window.innerHeight;
  return Math.round(vh * (phone ? VH_PER_BEAT_PHONE : VH_PER_BEAT) * SEGMENTS);
}

/**
 * The poster. The browser picks the small file on phones, before any script runs,
 * so the first paint is the same on the server and in the browser.
 */
function StoryPoster() {
  return (
    <picture className={styles.picture}>
      <source media={PHONE_QUERY} srcSet={STORY_POSTER_SM} />
      <img className={styles.poster} src={STORY_POSTER} alt={STORY_ALT} />
    </picture>
  );
}

/**
 * The six sequence beats as one pinned story. One canvas plays all six
 * frame sets back to back. Each beat has its own copy panel.
 * Reduced motion: no pin and no frames. A plain list with one poster per beat.
 */
export function StorySection() {
  // 'pending' until the motion preference is known, so frames never load in reduced mode.
  const [mode, setMode] = useState<'pending' | 'pinned' | 'reduced'>('pending');
  // Which frame set to use. Chosen once on mount and never switched, so no frames load twice.
  const [frameSet, setFrameSet] = useState<'full' | 'small' | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const seqRef = useRef<ScrollSequenceHandle>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { zone, segment } = useBeatState();

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMode(mq.matches ? 'reduced' : 'pinned');
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    setFrameSet(wantsSmallFrames() ? 'small' : 'full');
  }, []);

  // Pinned story: one ScrollTrigger drives the frames, the panels and the store.
  useEffect(() => {
    const section = sectionRef.current;
    if (mode !== 'pinned' || !section) return;

    const ctx = gsap.context(() => {
      let lastSegment = -1;
      const unregister: (() => void)[] = [];
      // The panel that is showing now (or fading out). -1 before the first one.
      let shownIndex = -1;

      /**
       * Crossfade between beat panels. Interruptible: every panel that is not
       * the incoming one is either fading out (only the previous one) or
       * hidden at once. So fast scrolling never leaves two panels fully shown
       * or none. Desktop adds a light blur-in. Phones keep the plain rise.
       */
      const showPanel = (next: number) => {
        const incoming = panelRefs.current[next];
        if (!incoming) return;
        const outgoing = shownIndex;
        shownIndex = next;

        panelRefs.current.forEach((el, i) => {
          if (!el || i === next) return;
          gsap.killTweensOf(el);
          if (i === outgoing) {
            // Outgoing: quick fade and a rise of 8px.
            gsap.to(el, { autoAlpha: 0, y: -8, duration: 0.18, ease: 'power1.in' });
          } else {
            gsap.set(el, { autoAlpha: 0, y: 0 });
          }
        });

        const blur = !isPhone();
        gsap.killTweensOf(incoming);
        gsap.fromTo(
          incoming,
          { autoAlpha: 0, y: 14, filter: blur ? 'blur(6px)' : 'none' },
          {
            autoAlpha: 1,
            y: 0,
            filter: blur ? 'blur(0px)' : 'none',
            duration: 0.42,
            // A spring-like settle: a small overshoot, then rest.
            ease: 'back.out(1.2)',
            clearProps: 'filter',
          },
        );
      };

      const apply = (self: ScrollTrigger) => {
        seqRef.current?.setProgress(self.progress);
        const y = window.scrollY;
        if (y < self.start) {
          setBeatState('hero', 0);
          return;
        }
        if (y >= self.end) {
          setBeatState('visit', SEGMENTS - 1);
          return;
        }
        const segment = segmentAt(self.progress, SEGMENTS);
        if (segment !== lastSegment) {
          lastSegment = segment;
          showPanel(segment);
        }
        setBeatState('story', segment);
      };

      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${pinLength()}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: apply,
        onUpdate: apply,
        onEnter: apply,
        onEnterBack: apply,
        onLeave: apply,
        onLeaveBack: apply,
      });

      // Each beat is addressable: its anchor is where its segment starts.
      sequenceBeats.forEach((beat, i) => {
        unregister.push(
          registerBeatY(beat.slug, () => st.start + beatProgress(i) * (st.end - st.start)),
        );
      });

      // Open the page at a beat when the URL names one, e.g. #beat-bake.
      const hash = window.location.hash.replace('#beat-', '');
      const hashIndex = sequenceBeats.findIndex((beat) => beat.slug === hash);
      if (hashIndex >= 0) {
        window.scrollTo({ top: st.start + beatProgress(hashIndex) * (st.end - st.start) });
      }

      return () => unregister.forEach((fn) => fn());
    }, section);

    return () => ctx.revert();
  }, [mode]);

  // Reduced motion: mark the beat in view, for the progress rail.
  useEffect(() => {
    if (mode !== 'reduced') return;
    const ids = ['beat-hero', ...sequenceBeats.map((beat) => `beat-${beat.slug}`), 'beat-visit'];
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (id === 'beat-hero') setBeatState('hero', 0);
          else if (id === 'beat-visit') setBeatState('visit', SEGMENTS - 1);
          else {
            const i = sequenceBeats.findIndex((beat) => `beat-${beat.slug}` === id);
            if (i >= 0) setBeatState('story', i);
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [mode]);

  const lead = <div className={styles.lead} aria-hidden="true" />;

  if (mode === 'reduced') {
    return (
      <>
        {lead}
        <section id="story" className={styles.list} aria-label="The croissant story">
          <ol className={styles.listInner}>
            {sequenceBeats.map((beat) => (
              <li key={beat.id} id={`beat-${beat.slug}`} className={styles.item}>
                <picture className={styles.picture}>
                  <source media={PHONE_QUERY} srcSet={withVersion(beat.posterSm)} />
                  <img
                    className={styles.still}
                    src={withVersion(beat.poster)}
                    width={720}
                    height={720}
                    loading="lazy"
                    alt=""
                  />
                </picture>
                <div className={styles.card}>
                  <p className={styles.num} aria-hidden="true">
                    {pad2(beat.index)}
                  </p>
                  <h2 id={`beat-${beat.slug}-title`} className={styles.title}>
                    {beat.title}
                  </h2>
                  <p className={styles.body}>{beat.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </>
    );
  }

  const small = frameSet === 'small';

  return (
    <>
      {lead}
      <section
        ref={sectionRef}
        id="story"
        className={styles.section}
        aria-label="The croissant story"
      >
        {/* Invisible anchor targets. Clicks are routed to the segment start by scroll.ts. */}
        {sequenceBeats.map((beat) => (
          <span key={beat.id} id={`beat-${beat.slug}`} className={styles.anchor} aria-hidden="true" />
        ))}
        <div className={styles.stage}>
          <div className={styles.media}>
            {mode === 'pinned' && frameSet !== null ? (
              <ScrollSequence
                ref={seqRef}
                segments={small ? SMALL_FRAME_SETS : FRAME_SETS}
                poster={small ? STORY_POSTER_SM : STORY_POSTER}
                alt={STORY_ALT}
                concurrency={small ? 4 : 6}
                capToFrame={small}
              />
            ) : (
              <StoryPoster />
            )}
          </div>
          <div className={styles.copy}>
            <div className={styles.panels}>
              {sequenceBeats.map((beat, i) => (
                <div
                  key={beat.id}
                  ref={(el) => {
                    panelRefs.current[i] = el;
                  }}
                  className={styles.panel}
                >
                  <p className={styles.num} aria-hidden="true">
                    {pad2(beat.index)}
                  </p>
                  <h2 id={`beat-${beat.slug}-title`} className={styles.title}>
                    {beat.title}
                  </h2>
                  <p className={styles.body}>{beat.body}</p>
                </div>
              ))}
            </div>
            <div className={styles.bar} aria-hidden="true">
              {sequenceBeats.map((beat, i) => {
                const state =
                  zone !== 'story' ? 'future' : i === segment ? 'current' : i < segment ? 'past' : 'future';
                return <span key={beat.id} className={styles.cell} data-state={state} />;
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
