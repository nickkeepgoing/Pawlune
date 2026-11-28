'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Brings `[data-reveal]` elements in as they are scrolled to.
 *
 * The server renders everything visible; only elements still below the fold are hidden,
 * and only once this runs. No script, or reduced motion, means nothing is ever hidden.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (reducedMotion()) return;
    const els = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('reveal-in');
        io.unobserve(e.target);
      }),
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
      el.classList.add('reveal-ready');
      io.observe(el);
    });
    return () => {
      io.disconnect();
      els.forEach((el) => el.classList.remove('reveal-ready', 'reveal-in'));
    };
  }, []);
  return null;
}

/** Layers marked `.depth` slide by different amounts under the pointer, so they read as stacked. */
export function Parallax({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      el.style.setProperty('--px', String(clamp((e.clientX - r.left - r.width / 2) / (r.width / 2))));
      el.style.setProperty('--py', String(clamp((e.clientY - r.top - r.height / 2) / (r.height / 2))));
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

/** Counts up to a sourced figure when it scrolls into view. The server renders the real value. */
export function CountUp({ value, suffix = '', className = '' }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || el.getBoundingClientRect().top < window.innerHeight) return;
    let raf = 0;
    setShown(0);
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1200);
        setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);
  // Screen readers get the figure itself, not the frames on the way to it.
  return (
    <p ref={ref} className={className}>
      <span aria-hidden>{shown}{suffix}</span>
      <span className="sr-only">{value}{suffix}</span>
    </p>
  );
}
