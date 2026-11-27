import Image from 'next/image';

/**
 * A photo frame that works before the photo exists.
 *
 * Drop a file into `public/photos/` and pass `src="/photos/your-file.jpg"` — the frame,
 * ratio and rounding stay exactly the same, so the layout never shifts when real photos land.
 * Until then it renders a labelled placeholder saying which photo belongs here.
 *
 * Only use photos the shelter or the team actually owns, or ones whose licence allows it.
 */
export function PhotoSlot({
  src,
  alt,
  need = 'ยังไม่ได้ใส่รูปสำหรับช่องนี้',
  className = '',
  ratio = 'aspect-[4/3]',
  priority = false,
}: {
  /** Path under /public once the photo exists, e.g. "/photos/cat-window.jpg". */
  src?: string;
  /** Real alternative text for screen readers. Required either way. */
  alt: string;
  /** Short note describing the photo we still need here, shown only while `src` is empty. */
  need?: string;
  className?: string;
  ratio?: string;
  priority?: boolean;
}) {
  const frame = `relative overflow-hidden rounded-[var(--radius-sheet)] ${ratio} ${className}`;

  if (src) {
    return (
      <div className={frame}>
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority={priority} />
      </div>
    );
  }

  return (
    <div className={`${frame} photo-slot grid place-items-center border-[1.5px] border-dashed border-bark/30 p-6`}>
      <p className="max-w-[28ch] text-center text-sm text-bark">
        <span className="block font-semibold text-cocoa">ตรงนี้ใส่รูปจริง</span>
        {need}
      </p>
    </div>
  );
}
