"use client";
export default function ErrorView({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="paper mt-8 p-6 text-center">
      <h1 className="text-lg font-semibold">โหลดข้อมูลไม่สำเร็จ</h1>
      <p className="mt-1 text-bark">ลองอีกครั้งได้เลย ข้อมูลที่บันทึกไว้แล้วไม่หายไปไหน</p>
      <button onClick={reset} className="btn btn-primary mt-4">ลองอีกครั้ง</button>
    </div>
  );
}
