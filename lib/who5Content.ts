import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Who5Text = { instruction: string; items: string[]; options: { value: number; label: string }[]; _source?: string };

/** Validated Thai text placed by the team (never AI-translated). Falls back to the official English version. */
export function loadWho5Text(): { text: Who5Text; isThai: boolean } {
  const read = (f: string) => JSON.parse(readFileSync(join(process.cwd(), "content", f), "utf-8")) as Who5Text;
  try { return { text: read("who5-th.json"), isThai: true }; }
  catch { return { text: read("who5-en.json"), isThai: false }; }
}
