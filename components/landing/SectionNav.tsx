'use client';
import { useEffect, useState } from 'react';

/**
 * The landing page's section links, with the one being read marked.
 *
 * A section counts as current from the moment its top passes under the header until the
 * next listed section's does; unlisted blocks in between belong to the one above. Past the
 * end of the last listed section nothing is marked.
 */
export function SectionNav({ items }: { items: readonly (readonly [string, string])[] }) {
  const [current, setCurrent] = useState('');

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let found = '';
      items.forEach(([href], i) => {
        const box = document.querySelector(href)?.getBoundingClientRect();
        if (!box || box.top > line) return;
        if (i === items.length - 1 && box.bottom < line) found = '';
        else found = href;
      });
      setCurrent(found);
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(read); };
    read();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    return () => {
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <>
      {items.map(([href, label]) => {
        const on = current === href;
        return (
          <a key={href} href={href} aria-current={on ? 'location' : undefined}
            className={`hidden min-h-10 items-center whitespace-nowrap rounded-full px-4 transition-colors lg:flex ${
              on ? 'bg-sage/60 font-semibold text-cocoa' : 'text-bark hover:bg-paper hover:text-jade'
            }`}>
            {label}
          </a>
        );
      })}
    </>
  );
}
