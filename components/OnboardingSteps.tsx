const STEPS = ['ข้อมูลของคุณ', 'ยืนยันอายุ', 'เรื่องน้อง'] as const;

/**
 * Progress through the three questions asked before the app opens.
 *
 * Onboarding really is a sequence, so the count earns its place: the bars show how
 * much is left, which the plain line "ขั้นที่ 1 จาก 3" could only state.
 */
export function OnboardingSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="mb-5">
      <p className="num text-sm font-semibold text-jade">
        ขั้นที่ {current} จาก {STEPS.length} — {STEPS[current - 1]}
      </p>
      <ol className="mt-2 flex gap-1.5" aria-label={`ขั้นที่ ${current} จาก ${STEPS.length}`}>
        {STEPS.map((label, i) => {
          const n = i + 1;
          return (
            <li
              key={label}
              aria-current={n === current ? 'step' : undefined}
              className={`h-1.5 flex-1 rounded-full ${n <= current ? 'bg-jade' : 'bg-bark/20'}`}
            >
              <span className="sr-only">{label}{n < current ? ' เสร็จแล้ว' : n === current ? ' กำลังทำ' : ' ยังไม่ถึง'}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
