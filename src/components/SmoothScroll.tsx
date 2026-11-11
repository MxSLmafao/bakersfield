'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Starts Lenis smooth scrolling and keeps it in step with GSAP ScrollTrigger.
 * Smooth scroll is not started when the visitor asks for reduced motion.
 * Renders nothing.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    // Keep ScrollTrigger in step with Lenis.
    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onLenisScroll);

    // Drive Lenis from the GSAP ticker so both use one clock.
    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.off('scroll', onLenisScroll);
      lenis.destroy();
    };
  }, []);

  return null;
}
