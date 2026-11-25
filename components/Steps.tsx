export default function Steps({ at }: { at: 1 | 2 | 3 }) {
  return (
    <ol aria-label={`ขั้นตอนที่ ${at} จาก 3`} className="mb-6 mt-2 flex gap-2">
      {[1, 2, 3].map((i) => <li key={i} aria-hidden className={`h-1.5 flex-1 rounded-full ${i <= at ? "bg-jade" : "bg-line"}`} />)}
    </ol>
  );
}
