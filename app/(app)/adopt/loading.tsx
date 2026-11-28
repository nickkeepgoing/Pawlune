import { PawLoader } from '@/components/PawLoader';

export default function Loading() {
  return (
    <div className="wide space-y-4 py-4">
      <PawLoader text="กำลังหาเพื่อนที่เข้ากับคุณ" />
      <div aria-hidden className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="overflow-hidden rounded-3xl bg-paper">
            <div className="shimmer aspect-[4/3]" />
            <div className="space-y-2 p-4">
              <div className="shimmer h-6 w-1/2 rounded" />
              <div className="shimmer h-4 w-3/4 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
