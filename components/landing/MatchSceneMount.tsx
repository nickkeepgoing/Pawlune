'use client';
import dynamic from 'next/dynamic';

/** Client boundary: three.js is requested by the browser, never rendered on the server. */
const MatchScene = dynamic(() => import('./MatchScene'), { ssr: false });

export function MatchSceneMount({ className = '' }: { className?: string }) {
  return <MatchScene className={className} />;
}
