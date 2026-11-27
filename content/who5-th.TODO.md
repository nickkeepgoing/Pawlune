# TODO (team, before Phase 4): create content/who5-th.json

> Status 2026-11-26: not done. The validated Thai text exists only as an image inside the supplementary .docx below,
> and Claude could not open that file from its workspace. Fastest path: download the .docx yourself
> (link in docs/EVIDENCE.md #4), open it, screenshot the Thai questionnaire, and either type it in, or send the
> screenshot to Claude and ask it to **transcribe exactly what is printed** (copying the image, not translating).
> Either way a teacher must compare the result with the image before it goes in the app.

1. Open the supplementary file listed in docs/EVIDENCE.md #4 (Thai WHO-5 shown as an image).
2. Type the Thai instruction, 5 items and 6 answer labels EXACTLY as printed. Do not rephrase. Do not use AI translation.
3. Ask a teacher to compare your typing with the image.
4. Save with the same shape as content/who5-en.json:
   { "_source": "...", "instruction": "...", "items": ["…5 items…"], "options": [{"value":5,"label":"…"}, … {"value":0,"label":"…"}] }
   Keep the value order 5 → 0 as in the original form.
If you cannot get the validated text, the app shows English items with a banner — say this honestly in the pitch.
