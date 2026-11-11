'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PovSequence, type PovSequenceHandle } from './PovSequence';
import { POV_BEAT_TOTAL, POV_CUT_SEGMENTS, POV_STORY_ALT, povSequenceBeats } from '@/content/pov';
import { withVersion } from '@/lib/asset-version';
import { PHONE_QUERY, isCoarsePointer, isPhone, stableViewportHeight, wantsSmallFrames } from '@/lib/device';
import { registerPovY, scrollToPovBeat, setPovState, usePovState } from '@/lib/pov-store';
import { segmentAt } from '@/lib/segments';
import styles from './PovStory.module.css';

gsap.registerPlugin(ScrollTrigger);
// Mobile browsers resize the viewport when the address bar shows or hides.
// Do not refresh the pin for that. A real width change still refreshes it.
ScrollTrigger.config({ ignoreMobileResize: true });

/** Scroll length per beat, as a multiple of the viewport height. */
const VH_PER_BEAT = 1.3;
const VH_PER_BEAT_PHONE = 0.85;
/** Cross-fade length at a hard cut, as a fraction of one segment. */
const FADE_SPAN = 0.08;
const SEGMENTS = povSequenceBeats.length;
const FRAME_SETS = povSequenceBeats.map((beat) => beat.frames);
const SMALL_FRAME_SETS = povSequenceBeats.map((beat) => beat.framesSm);
const POSTER = withVersion(povSequenceBeats[0].poster);
const POSTER_SM = withVersion(povSequenceBeats[0].posterSm);
const HASH_PREFIX = '#pov-';

const pad2 = (n: number) => String(n).padStart(2, '0');
const beatNumber = (index: number) => `${pad2(index)} / ${pad2(POV_BEAT_TOTAL)}`;

/** Global progress where segment i starts: 0.5% of a segment inside, so rounding never picks the previous one. */
const beatProgress = (i: number) => (i + 0.005) / SEGMENTS;

function pinLength(): number {
  const phone = isPhone();
  const vh = isCoarsePointer() ? stableViewportHeight() : window.innerHeight;
  return Math.round(vh * (phone ? VH_PER_BEAT_PHONE : VH_PER_BEAT) * SEGMENTS);
}

function Progress({ zone, segment }: { zone: string; segment: number }) {
  return (
    <div className={styles.bar} aria-hidden="true">
      {povSequenceBeats.map((beat, i) => {
        const state = zone !== 'story' ? 'future' : i === segment ? 'current' : i < segment ? 'past' : 'future';
        return <span key={beat.id} className={styles.cell} data-state={state} />;
      })}
    </div>
  );
}

/**
 * The six first-person segments as one pinned, scroll-scrubbed story.
 * One canvas plays all six frame sets, full-bleed on landscape screens.
 * On portrait screens the frame sits at the top with the copy below it.
 * Reduced motion: no pin and no frames, a plain list of six stills.
 */
export function PovStory() {
  const [mode, setMode] = useState<'pending' | 'pinned' | 'reduced'>('pending');
  // Chosen once on mount and never switched, so no frames load twice.
  const [frameSet, setFrameSet] = useState<'full' | 'small' | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const seqRef = useRef<PovSequenceHandle>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelsRef = useRef<HTMLDivElement>(null);
  const { zone, segment } = usePovState();

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

  useEffect(() => {
    const section = sectionRef.current;
    if (mode !== 'pinned' || !section) return;

    const ctx = gsap.context(() => {
      let lastSegment = -1;
      let shownPanel = -1;
      const unregister: (() => void)[] = [];

      // One panel in, the previous one out. Anything else is hidden at once,
      // so a fast scroll never leaves two or zero panels behind.
      const showPanel = (next: number) => {
        const els = panelRefs.current;
        const prev = shownPanel;
        shownPanel = next;
        els.forEach((el, i) => {
          if (!el || i === next || i === prev) return;
          gsap.killTweensOf(el);
          gsap.set(el, { autoAlpha: 0 });
        });
        const out = prev >= 0 && prev !== next ? els[prev] : null;
        if (out) {
          gsap.killTweensOf(out);
          gsap.to(out, { autoAlpha: 0, y: -8, duration: 0.16, ease: 'power1.in' });
        }
        const el = els[next];
        if (!el) return;
        // The caption box follows the height of the copy in view.
        if (panelsRef.current) {
          if (prev < 0) gsap.set(panelsRef.current, { height: el.offsetHeight });
          else gsap.to(panelsRef.current, { height: el.offsetHeight, duration: 0.5, ease: 'power3.out', overwrite: true });
        }
        gsap.killTweensOf(el);
        gsap.set(el, { autoAlpha: 0, y: 18 });
        gsap.to(el, { autoAlpha: 1, duration: 0.4, delay: out ? 0.08 : 0, ease: 'power2.out' });
        gsap.to(el, { y: 0, duration: 0.8, delay: out ? 0.08 : 0, ease: 'back.out(1.5)' });
      };

      const apply = (self: ScrollTrigger) => {
        seqRef.current?.setProgress(self.progress);
        const y = window.scrollY;
        if (y < self.start) {
          setPovState('hero', 0);
          return;
        }
        if (y >= self.end) {
          setPovState('outro', SEGMENTS - 1);
          return;
        }
        const seg = segmentAt(self.progress, SEGMENTS);
        if (seg !== lastSegment) {
          lastSegment = seg;
          showPanel(seg);
        }
        setPovState('story', seg);
      };

      // After a resize the copy can wrap differently: fit the caption box again.
      const fitBox = () => {
        const h = shownPanel >= 0 ? panelRefs.current[shownPanel]?.offsetHeight : 0;
        if (h && panelsRef.current) gsap.set(panelsRef.current, { height: h });
      };

      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${pinLength()}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          fitBox();
          apply(self);
        },
        onUpdate: apply,
        onEnter: apply,
        onEnterBack: apply,
        onLeave: apply,
        onLeaveBack: apply,
      });

      const yFor = (i: number) => st.start + beatProgress(i) * (st.end - st.start);
      povSequenceBeats.forEach((beat, i) => {
        unregister.push(registerPovY(beat.slug, () => yFor(i)));
      });

      // Deep links: #pov-<slug> opens the story at the start of that segment.
      const goToHash = () => {
        const slug = window.location.hash.startsWith(HASH_PREFIX)
          ? window.location.hash.slice(HASH_PREFIX.length)
          : '';
        const i = povSequenceBeats.findIndex((beat) => beat.slug === slug);
        if (i >= 0) window.scrollTo({ top: yFor(i) });
      };
      goToHash();
      window.addEventListener('hashchange', goToHash);

      const onClick = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (!(event.target instanceof Element)) return;
        const link = event.target.closest<HTMLAnchorElement>(`a[href^="${HASH_PREFIX}"]`);
        if (!link) return;
        const slug = (link.getAttribute('href') ?? '').slice(HASH_PREFIX.length);
        if (scrollToPovBeat(slug)) event.preventDefault();
      };
      document.addEventListener('click', onClick);

      return () => {
        unregister.forEach((fn) => fn());
        window.removeEventListener('hashchange', goToHash);
        document.removeEventListener('click', onClick);
      };
    }, section);

    return () => {
      ctx.revert();
      setPovState('hero', 0);
    };
  }, [mode]);

  if (mode === 'reduced') {
    return (
      <section className={styles.list} aria-labelledby="pov-story-title">
        <h2 id="pov-story-title" className={styles.srOnly}>
          How a Bakersfield croissant is made
        </h2>
        <ol className={styles.listInner}>
          {povSequenceBeats.map((beat) => (
            <li key={beat.id} id={`pov-${beat.slug}`} className={styles.item}>
              <picture>
                <source media={PHONE_QUERY} srcSet={withVersion(beat.posterSm)} />
                <img className={styles.still} src={withVersion(beat.poster)} width={960} height={540} loading="lazy" alt="" />
              </picture>
              <div className={styles.card}>
                <p className={styles.num} aria-hidden="true">
                  {beatNumber(beat.index)}
                </p>
                <h3 className={styles.title}>{beat.title}</h3>
                <p className={styles.body}>{beat.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  const small = frameSet === 'small';

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="pov-story-title">
      <h2 id="pov-story-title" className={styles.srOnly}>
        How a Bakersfield croissant is made
      </h2>
      {/* Invisible anchor targets for #pov-<slug>. */}
      {povSequenceBeats.map((beat) => (
        <span key={beat.id} id={`pov-${beat.slug}`} className={styles.anchor} aria-hidden="true" />
      ))}
      <div className={styles.stage}>
        <div className={styles.media}>
          {mode === 'pinned' && frameSet !== null ? (
            <PovSequence
              ref={seqRef}
              segments={small ? SMALL_FRAME_SETS : FRAME_SETS}
              poster={POSTER}
              posterSm={POSTER_SM}
              alt={POV_STORY_ALT}
              concurrency={small ? 4 : 6}
              capToFrame={small}
              fit="cover"
              cuts={POV_CUT_SEGMENTS}
              fadeSpan={FADE_SPAN}
            />
          ) : (
            <picture>
              <source media={PHONE_QUERY} srcSet={POSTER_SM} />
              <img className={styles.poster} src={POSTER} alt={POV_STORY_ALT} width={960} height={540} />
            </picture>
          )}
        </div>
        <div className={styles.copy}>
          <div ref={panelsRef} className={styles.panels}>
            {povSequenceBeats.map((beat, i) => (
              <div
                key={beat.id}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                className={styles.panel}
              >
                <p className={styles.num} aria-hidden="true">
                  {beatNumber(beat.index)}
                </p>
                <h3 className={styles.title}>{beat.title}</h3>
                <p className={styles.body}>{beat.body}</p>
              </div>
            ))}
          </div>
          <Progress zone={zone} segment={segment} />
        </div>
        <nav className={styles.rail} aria-label="Story steps">
          {povSequenceBeats.map((beat, i) => (
            <button
              key={beat.id}
              type="button"
              className={styles.railButton}
              aria-label={`${beat.title}, step ${i + 1} of ${SEGMENTS}`}
              aria-current={zone === 'story' && segment === i ? 'step' : undefined}
              onClick={() => scrollToPovBeat(beat.slug)}
            >
              <span className={styles.railDot} data-active={zone === 'story' && segment === i} />
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
