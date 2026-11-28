import { PawLoader } from '@/components/PawLoader';

/** Shown the moment a tab is tapped, while the page's data is still on its way. */
export default function Loading() {
  return (
    <div className="space-y-4 py-4">
      <PawLoader />
      <div aria-hidden className="space-y-4">
        <div className="shimmer h-24 rounded-2xl" />
        <div className="grid grid-cols-2 gap-3">
          <div className="shimmer h-24 rounded-2xl" />
          <div className="shimmer h-24 rounded-2xl" />
        </div>
        <div className="shimmer h-40 rounded-2xl" />
      </div>
    </div>
  );
}
