'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSequence, type ScrollSequenceHandle } from './ScrollSequence';
import type { SequenceBeat } from '@/content/beats';
import styles from './BeatSection.module.css';

gsap.registerPlugin(ScrollTrigger);

/** How far the section stays pinned, as a multiple of the viewport height. */
const PIN_VIEWPORTS = 1.5;

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * One scroll beat: a full-viewport section that pins while the frame sequence plays.
 * The copy block fades in during the pin. Reduced motion: no pin, no scrub.
 */
export function BeatSection({ beat }: { beat: SequenceBeat }) {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<ScrollSequenceHandle>(null);
  const [reduced, setReduced] = useState(false);

  const titleId = `beat-${beat.slug}-title`;
  const sideClass = beat.index % 2 === 0 ? styles.left : styles.right;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const copy = copyRef.current;
    if (reduced || !section || !copy) return;

    const ctx = gsap.context(() => {
      const pinLength = () => `+=${Math.round(window.innerHeight * PIN_VIEWPORTS)}`;

      const sendProgress = (progress: number) => seqRef.current?.setProgress(progress);

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: pinLength,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => sendProgress(self.progress),
        onRefresh: (self) => sendProgress(self.progress),
      });

      // Copy fades and slides in over the first part of the pin.
      gsap.fromTo(
        copy,
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${Math.round(window.innerHeight * PIN_VIEWPORTS * 0.4)}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id={`beat-${beat.slug}`}
      className={styles.section}
      aria-labelledby={titleId}
      data-beat={beat.slug}
    >
      <div className={styles.stage}>
        <div className={styles.media}>
          <ScrollSequence
            ref={seqRef}
            dir={beat.frames.dir}
            count={beat.frames.count}
            ext={beat.frames.ext}
            poster={beat.poster}
            alt={`${beat.title}: ${beat.body}`}
          />
        </div>
        <div className={`${styles.layer} ${sideClass}`}>
          <div ref={copyRef} className={styles.copy}>
            <p className={styles.num} aria-hidden="true">
              {pad2(beat.index)}
            </p>
            <h2 id={titleId} className={styles.title}>
              {beat.title}
            </h2>
            <p className={styles.body}>{beat.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
