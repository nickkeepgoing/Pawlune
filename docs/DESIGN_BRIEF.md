# DESIGN_BRIEF.md

Use the `frontend-design` skill. Install in Claude Code if missing:
`/plugin install frontend-design@claude-plugins-official`
(fallback: `/plugin marketplace add anthropics/claude-code` then `/plugin install frontend-design@claude-code-plugins`).

## Feeling
Calm, warm, private — like a small notebook you keep next to your pet's bowl. Not clinical, not a fitness app,
not cute-overload. Honest data presented gently.

## Team constraints (from past feedback)
- NO neon / gradient text. The team rejected it.
- Team likes green families and the Anuphan typeface for Thai. Pair it with one clearly distinct Latin/number face.
- Previous designs were rejected as plain and templated — make deliberate, specific choices.

## Palette (team decision 2026-11-26): muted sage green + earth brown + cream
Inspired by soft herbal greens (the team's reference was an anime apothecary's outfit) — colors only, no character imagery.
| Token | Hex | Use |
|---|---|---|
| cream | #F2EADB | page background |
| paper | #FBF7EF | cards, sheets |
| sage | #A9C3A0 | soft fills, selected chips, chart "with" bar |
| jade | #4E6E58 | primary buttons, links, focus ring |
| bark | #6B4F3A | secondary text, icons, chart "without" bar |
| cocoa | #3E2D22 | body text, headings |
| honey | #C99A5B | small highlights only (streak, badge) |
Rules: text is always cocoa or bark on cream/paper; cream text only on jade or cocoa. Check every pair for WCAG AA
(4.5:1 body text) and adjust lightness, not hue, if a pair fails. No gradients on text. Burden chips: bark outline, never red.

## Signature element
The user's own pet photo is the hero of the check-in card. Everything else stays quiet.

## Components that matter
- 5 mood faces: custom SVG, not emoji; each has a Thai label (แย่มาก, ไม่ค่อยดี, เฉยๆ, ดี, ดีมาก); selectable by keyboard.
- Activity chips in two groups: "วันนี้กับน้อง" (joy) and "ภาระวันนี้" (burden). Burden chips use neutral styling, never red.
- Pattern card: the sentence first, then a small two-bar comparison (with vs without, n under each bar),
  status chip, limitation line in muted text. Insufficient cards show a progress meter "อีก N วัน".
- WHO-5 timeline: points every 14 days with a line; no colored "danger zones".
- "ต้องการคนรับฟัง" button: always visible, soft but findable (contrast AA).
- "ข้อมูลจำลอง" badge on demo accounts: persistent, top of every screen.

## Copy tone
Second person, short, kind, no exclamation marks, no medical words. Examples:
- Empty patterns: "บันทึกต่ออีกไม่กี่วัน แล้วเราจะเริ่มเห็นรูปแบบของคุณกับน้อง"
- After check-in: "บันทึกแล้ว ขอบคุณที่ดูแลใจตัวเองวันนี้"
- WHO-5 intro: "5 คำถามเกี่ยวกับ 2 สัปดาห์ที่ผ่านมา ใช้เวลาไม่ถึงนาที"

## Learn page `/learn` — cute moving animals (Phase 6)
- Two ORIGINAL characters drawn as inline SVG by us: a round sage-collared dog "ถั่วแดง" and a cream cat "มะขาม".
  Not based on any existing character, mascot or brand.
- Idle motion (CSS keyframes on SVG groups, 2–4 s loops): dog tail wag, cat tail sway, slow blink, gentle breathing (scale 1 → 1.02).
- Interaction: tap/hover a pet → small hop + one heart floats up; the pet "points" at the nearest fact card.
- Scroll story, one fact per card, each card has the pet reacting:
  1. "เลี้ยงสัตว์ ≠ สัตว์บำบัด" (therapy uses trained animals + professionals)
  2. "งานวิจัยยังได้ผลหลายทาง" (EVIDENCE #1: 17 / 19 / 13 / 5 of 54 — show as 4 small paw-print groups)
  3. "การเลี้ยงสัตว์มีภาระด้วย" (EVIDENCE #3) — the cat looks tired, then is comforted
  4. "แอปนี้ช่วยให้คุณสังเกตตัวเอง ไม่ได้ตัดสิน" → CTA "เริ่มบันทึก"
- Performance/a11y: pure CSS + SVG (no heavy animation library), < 60 KB for both SVGs, animations paused when off-screen,
  `prefers-reduced-motion: reduce` → no movement at all, every SVG has `role="img"` + Thai `aria-label`.
- The same two pets (static) can appear in empty states and the check-in success screen.

## Landing page (Phase 2)
Hero: the question "เวลาแบบไหนกับน้อง ที่ไปด้วยกันกับวันดีของคุณ?" + one screenshot of a Pattern card + CTA "เริ่มบันทึก".
Sections: how it works (3 steps), honesty promise ("เราไม่บอกว่าสัตว์รักษาใจ เราช่วยให้คุณสังเกต"), privacy promise,
footer with help line 1323. No fake testimonials, no fake user counts.
