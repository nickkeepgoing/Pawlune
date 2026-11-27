import type { ReportData } from '@/app/(app)/report/ReportBuilder';

type On = Record<string, boolean>;
const C = { cream: '#F2EADB', paper: '#FBF7EF', sage: '#A9C3A0', jade: '#4E6E58', bark: '#6B4F3A', cocoa: '#3E2D22', honey: '#C99A5B' };

/** Split Thai/English text into words (Thai has no spaces) so lines wrap at word boundaries. */
function words(text: string): string[] {
  const Seg = (Intl as unknown as { Segmenter?: new (l: string, o: { granularity: string }) => { segment(t: string): Iterable<{ segment: string }> } }).Segmenter;
  if (!Seg) return text.split(/(\s+)/);
  return [...new Seg('th', { granularity: 'word' }).segment(text)].map((s) => s.segment);
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const lines: string[] = [];
  let cur = '';
  for (const w of words(text)) {
    // Never start a line with closing punctuation such as ")" or "%".
    const glue = /^[)\]}.,:;!?%]/.test(w);
    if (!glue && ctx.measureText(cur + w).width > maxW && cur) {
      // keep an opening bracket with the word after it
      const m = cur.match(/\s?\($/);
      if (m) { lines.push(cur.slice(0, -m[0].length).trimEnd()); cur = '(' + w; continue; }
      lines.push(cur.trimEnd()); cur = w.trimStart();
    }
    else cur += w;
  }
  if (cur.trim()) lines.push(cur.trimEnd());
  return lines;
}

/** Draws the same report as the print view onto a canvas (1080 px wide) and returns a PNG blob. Only engine numbers/copy. */
export async function renderReportImage(data: ReportData, on: On): Promise<Blob> {
  const W = 1080, P = 72, inner = W - P * 2;
  const font = getComputedStyle(document.body).fontFamily || 'sans-serif';
  if (document.fonts?.ready) await document.fonts.ready;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const F = (size: number, weight = 400) => `${weight} ${size}px ${font}`;

  // Two passes: measure height, then draw.
  const ops: ((y: number, draw: boolean) => number)[] = [];
  const text = (t: string, size: number, color = C.cocoa, weight = 400, gap = 10) => ops.push((y, draw) => {
    ctx.font = F(size, weight);
    const lines = wrap(ctx, t, inner);
    const lh = Math.round(size * 1.55);
    if (draw) { ctx.fillStyle = color; lines.forEach((l, i) => ctx.fillText(l, P, y + lh * (i + 1) - lh * 0.3)); }
    return y + lh * lines.length + gap;
  });
  const space = (h: number) => ops.push((y) => y + h);
  const rule = () => ops.push((y, draw) => { if (draw) { ctx.fillStyle = 'rgba(107,79,58,.2)'; ctx.fillRect(P, y, inner, 2); } return y + 28; });
  const heading = (t: string) => { space(8); text(t, 34, C.jade, 700, 12); };

  text('Pawlune', 30, C.jade, 700, 4);
  text('รายงานบันทึกส่วนตัว', 52, C.cocoa, 700, 8);
  text(`${data.name ? data.name + ' · ' : ''}ทำเมื่อ ${data.created} · ช่วงข้อมูล ${data.range}`, 28, C.bark, 400, 16);
  rule();
  if (on.pet) { heading('ข้อมูลน้อง'); text(data.pet, 30); }
  if (on.mood) {
    heading('อารมณ์รายสัปดาห์ (1–5)');
    text(`บันทึกทั้งหมด ${data.daysLogged} วัน${data.meanMood !== null ? ` · อารมณ์เฉลี่ย ${data.meanMood.toFixed(2)}` : ''}`, 30);
    if (data.weeks.length) ops.push((y, draw) => {
      const H = 240, n = data.weeks.length, bw = Math.min(90, (inner - (n - 1) * 14) / n);
      if (draw) data.weeks.forEach((w, i) => {
        const x = P + i * (bw + 14), h = (w.mean_mood / 5) * (H - 70);
        ctx.fillStyle = C.sage; ctx.fillRect(x, y + H - 40 - h, bw, h);
        ctx.fillStyle = C.jade; ctx.fillRect(x, y + H - 40 - h, bw, 4);
        ctx.fillStyle = C.cocoa; ctx.font = F(24, 600); ctx.textAlign = 'center';
        ctx.fillText(w.mean_mood.toFixed(2), x + bw / 2, y + H - 50 - h);
        ctx.fillStyle = C.bark; ctx.font = F(22); ctx.fillText(`ส.${w.week}`, x + bw / 2, y + H - 8);
        ctx.textAlign = 'left';
      });
      return y + H + 10;
    });
  }
  if (on.who5) {
    heading('คะแนนสุขภาวะทางใจ (WHO-5, 0–100)');
    if (data.who5.length) data.who5.forEach((w) => text(`${w.date}: ${w.pct}/100`, 30, C.cocoa, 400, 2)); else text('ยังไม่มีคำตอบ', 30);
  }
  if (on.st5) {
    heading('ความเครียด (ST-5, 0–15)');
    if (data.st5.length) data.st5.forEach((s) => text(`${s.date}: ${s.raw}/15 ${s.level}`, 30, C.cocoa, 400, 2)); else text('ยังไม่มีคำตอบ', 30);
  }
  if (on.trial && data.trial.length) { heading('การทดลองเลี้ยง'); data.trial.forEach((t) => text(t, 28, C.cocoa, 400, 4)); }
  if (on.patterns) {
    heading('รูปแบบ');
    if (data.patterns.length) data.patterns.forEach((p) => { text(`${p.sentence} (${p.chip})`, 28, C.cocoa, 400, 4); p.extra.forEach((e) => text(e, 26, C.bark, 400, 4)); space(10); });
    else text('ข้อมูลยังไม่พอสำหรับรูปแบบ', 28);
    text(data.limitation, 26, C.bark);
  }
  if (on.memories) {
    heading('สัตว์ที่เคยเลี้ยง (บันทึกโดยผู้ใช้)');
    if (data.memories.length) data.memories.forEach((m) => {
      text(`${m.name} (${m.species})${m.period ? ` · ${m.period}` : ''}${m.feeling ? ` · ความรู้สึกเมื่อนึกถึง ${m.feeling}/5` : ''}`, 28, C.cocoa, 600, 2);
      if (m.tags.length) text(m.tags.join(', '), 26, C.bark, 400, 2);
      if (m.note) text(m.note, 26, C.cocoa, 400, 2);
      space(10);
    }); else text('ไม่มีบันทึก', 28);
    text('ข้อมูลส่วนนี้ไม่ได้นำไปคำนวณรูปแบบ', 24, C.bark);
  }
  if (on.notes) {
    heading('โน้ต');
    if (data.notes.length) data.notes.forEach((n) => text(`${n.date}: ${n.note}`, 26, C.cocoa, 400, 4)); else text('ไม่มีโน้ต', 28);
  }
  space(12); rule();
  text('ข้อมูลบันทึกด้วยตนเอง ไม่ใช่การประเมินหรือวินิจฉัยทางคลินิก', 24, C.bark, 400, 0);

  let h = P; for (const op of ops) h = op(h, false); h += P;
  canvas.width = W; canvas.height = Math.min(h, 16000);
  ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, canvas.height);
  ctx.fillStyle = C.jade; ctx.fillRect(0, 0, W, 14);
  ctx.textBaseline = 'alphabetic';
  let y = P; for (const op of ops) y = op(y, true);
  return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('png'))), 'image/png'));
}
