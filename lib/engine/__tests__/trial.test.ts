import { describe, expect, it } from 'vitest';
import { checkTrialCases } from './trialRun';

describe('ST-5, matching, trial helpers (fixtures/trial-cases.json)', () => {
  it('all cases pass', () => expect(checkTrialCases()).toEqual([]));
});
