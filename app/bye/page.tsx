import Link from 'next/link';
import { CatMakham } from '@/components/Pets';

export default function StopPage() {
  return (
    <main className="mx-auto max-w-md px-5 py-12 text-center">
      <CatMakham className="mx-auto h-28 w-28" />
      <h1 className="mt-4 text-2xl font-bold">ขอบคุณที่สนใจนะ</h1>
      <p className="mt-2 text-bark">ตอนนี้ Pawlune ยังเปิดให้เฉพาะผู้ที่อายุ 20 ปีขึ้นไป เราไม่ได้เก็บข้อมูลของคุณไว้</p>
      <p className="mt-4 text-bark">ถ้าอยากคุยกับใครสักคน โทรสายด่วนสุขภาพจิต <a href="tel:1323" className="num font-semibold text-jade underline">1323</a></p>
      <Link href="/" className="btn btn-ghost mt-6">กลับหน้าแรก</Link>
    </main>
  );
}
