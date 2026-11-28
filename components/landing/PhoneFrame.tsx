import { MoodFace } from '@/components/MoodFace';
import { MOOD_LABELS } from '@/lib/format';
import { ACTIVITIES } from '@/lib/engine';

/**
 * The daily check-in, drawn at phone size for the landing page.
 *
 * Every label here is pulled from the same source the real screen uses — the five
 * mood labels and the activity list — so the preview cannot drift away from the
 * app or show a feature that does not exist. It is a picture of a real screen,
 * not an invented one.
 */
export function PhoneCheckin({ className = '' }: { className?: string }) {
  const joy = (['walk', 'play', 'cuddle'] as const).map((k) => ACTIVITIES[k].th);
  const burden = (['night_wake'] as const).map((k) => ACTIVITIES[k].th);
  const chosen = 3;

  return (
    <div
      className={`relative w-[17rem] shrink-0 rounded-[2.4rem] border-[7px] border-[#2A211B] bg-cream shadow-[0_32px_60px_-30px_var(--c-shadow)] ${className}`}
      role="img"
      aria-label="ตัวอย่างหน้าจอบันทึกประจำวันของ Pawlune: เลือกอารมณ์วันนี้ กิจกรรมที่ทำกับน้อง และภาระที่เจอ"
    >
      {/* The notch, so it reads as a phone without a screenshot. */}
      <span aria-hidden className="absolute left-1/2 top-1 h-4 w-20 -translate-x-1/2 rounded-full bg-[#2A211B]" />

      <div className="overflow-hidden rounded-[1.9rem] p-4 pt-7" aria-hidden>
        <p className="text-[11px] text-bark">28 พ.ย. 69</p>
        <p className="text-[15px] font-bold leading-snug">วันนี้กับถั่วแดง เป็นยังไงบ้าง</p>

        <p className="mt-3 text-[11px] font-semibold">อารมณ์วันนี้</p>
        <div className="mt-1.5 grid grid-cols-5 gap-1">
          {[1, 2, 3, 4, 5].map((m) => (
            <div
              key={m}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-lg border py-1.5 text-[8px] ${
                m === chosen ? 'border-jade bg-sage font-semibold text-cocoa' : 'border-bark/15 bg-paper text-bark'
              }`}
            >
              <MoodFace mood={m} className="h-5 w-5" />
              {MOOD_LABELS[m - 1]}
            </div>
          ))}
        </div>

        <p className="mt-3 text-[11px] font-semibold">วันนี้กับน้อง</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {joy.map((t, i) => (
            <span
              key={t}
              className={`rounded-full border px-2 py-1 text-[9px] ${
                i === 0 ? 'border-jade bg-sage font-semibold' : 'border-bark/25 bg-paper text-bark'
              }`}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-3 rounded-lg border-l-[3px] border-honey bg-paper p-2">
          <p className="text-[11px] font-semibold">ภาระวันนี้</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {burden.map((t) => (
              <span key={t} className="rounded-full border border-bark/25 px-2 py-1 text-[9px] text-bark">{t}</span>
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-full bg-jade py-2 text-center text-[11px] font-semibold text-cream">บันทึก</div>
      </div>
    </div>
  );
}
