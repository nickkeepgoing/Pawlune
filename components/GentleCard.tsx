"use client";
import { useState, useSyncExternalStore } from "react";
import { openHelp } from "./HelpSheet";

const read = (key: string) => { try { return localStorage.getItem(key) === "1"; } catch { return false; } };
const noop = () => () => {};

/** Soft invitation (never a label, never gates anything). Dismissible per day. */
export default function GentleCard({ day }: { day: string }) {
  const key = `gentle-dismissed-${day}`;
  const stored = useSyncExternalStore(noop, () => read(key), () => true);
  const [dismissed, setDismissed] = useState(false);
  if (stored || dismissed) return null;
  return (
    <aside className="paper rise border-l-4 border-sage p-5">
      <p>ช่วงนี้ดูเหมือนจะเป็นช่วงที่ไม่ง่าย ถ้าอยากคุยกับใครสักคน กดตรงนี้ได้เลย</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={openHelp} className="btn btn-primary">อยากคุยกับใครสักคน</button>
        <button type="button" className="btn text-bark underline underline-offset-4"
          onClick={() => { try { localStorage.setItem(key, "1"); } catch {} setDismissed(true); }}>
          ไว้ก่อน
        </button>
      </div>
    </aside>
  );
}
