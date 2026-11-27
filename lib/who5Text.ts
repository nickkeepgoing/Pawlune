import 'server-only';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface Who5Text { _source: string; instruction: string; items: string[]; options: { value: number; label: string }[]; isThai: boolean }

/** Validated Thai text if the team has added content/who5-th.json, else the official English (CLAUDE.md rule 5). */
export function loadWho5Text(): Who5Text {
  const dir = join(process.cwd(), 'content');
  const th = join(dir, 'who5-th.json');
  if (existsSync(th)) return { ...JSON.parse(readFileSync(th, 'utf8')), isThai: true };
  return { ...JSON.parse(readFileSync(join(dir, 'who5-en.json'), 'utf8')), isThai: false };
}
