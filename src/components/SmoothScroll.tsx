'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToBeat, setSmoother } from '@/lib/scroll';

gsap.registerPlugin(ScrollTrigger);

const BEAT_LINK = '#beat-';

/**
 * Starts Lenis smooth scrolling and keeps it in step with GSAP ScrollTrigger.
 * Smooth scroll is not started when the visitor asks for reduced motion.
 * Beat links (#beat-<slug>) always go through scrollToBeat, so they land on the
 * right story position. Renders nothing.
 */
export function SmoothScroll() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>(`a[href^="${BEAT_LINK}"]`);
      if (!link) return;
      const slug = (link.getAttribute('href') ?? '').slice(BEAT_LINK.length);
      if (scrollToBeat(slug)) event.preventDefault();
    };
    document.addEventListener('click', onClick);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;
    let onTick: ((time: number) => void) | null = null;
    let onLenisScroll: (() => void) | null = null;

    if (!reduce.matches) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
      });
      setSmoother(lenis);

      // Keep ScrollTrigger in step with Lenis.
      onLenisScroll = () => ScrollTrigger.update();
      lenis.on('scroll', onLenisScroll);

      // Drive Lenis from the GSAP ticker so both use one clock.
      onTick = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
    }

    return () => {
      document.removeEventListener('click', onClick);
      if (lenis) {
        setSmoother(null);
        if (onTick) gsap.ticker.remove(onTick);
        if (onLenisScroll) lenis.off('scroll', onLenisScroll);
        lenis.destroy();
      }
    };
  }, []);

  return null;
}
