// Runs the same checks as the vitest suite with plain tsx: `npm run test:engine`
import { isDeepStrictEqual } from 'node:util';
import { cardSentence } from '../lib/engine';
import { WALK_BASIC, allCopyStrings, computeAll, containsBanned, expected } from '../lib/engine/__tests__/run';

const got = computeAll() as Record<string, unknown>;
const exp = expected();
let fail = 0;
for (const k of ['basic', 'who5', 'low_mood_case', 'demo']) {
  const ok = isDeepStrictEqual(JSON.parse(JSON.stringify(got[k])), exp[k]);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${k}`);
  if (!ok) { fail++; console.log(JSON.stringify(got[k]).slice(0, 600)); }
}
const walk = cardSentence((got.basic as ReturnType<typeof computeAll>['basic']).patterns.walk);
console.log(`${walk === WALK_BASIC ? 'PASS' : 'FAIL'} walk copy: ${walk}`); if (walk !== WALK_BASIC) fail++;
const bad = allCopyStrings().filter((s) => containsBanned(s));
console.log(`${bad.length ? 'FAIL' : 'PASS'} banned words`); if (bad.length) { fail++; console.log(bad); }
import('../lib/engine/__tests__/trialRun').then(({ checkTrialCases }) => {
  const t = checkTrialCases();
  console.log(`${t.length ? 'FAIL' : 'PASS'} st5 / match / trial`); if (t.length) { fail++; console.log(t); }
  process.exit(fail ? 1 : 0);
});
