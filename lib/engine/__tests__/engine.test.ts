import { describe, expect, it } from 'vitest';
import { cardSentence } from '../index';
import { WALK_BASIC, allCopyStrings, computeAll, containsBanned, expected } from './run';

describe('engine matches tools/reference_engine.py (fixtures/expected.json)', () => {
  const got = computeAll();
  const exp = expected();
  it('basic', () => expect(got.basic).toEqual(exp.basic));
  it('who5', () => expect(got.who5).toEqual(exp.who5));
  it('low mood', () => expect(got.low_mood_case).toEqual(exp.low_mood_case));
  it('demo', () => expect(got.demo).toEqual(exp.demo));
});

describe('copy', () => {
  it('walk card in basic', () => expect(cardSentence(computeAll().basic.patterns.walk)).toBe(WALK_BASIC));
  it('no banned words', () => {
    for (const s of allCopyStrings()) expect(containsBanned(s)).toBeNull();
  });
});
