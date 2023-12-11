import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`z-index utilities`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  const cases: Array<[string, Record<string, string | number>]> = [
    [`z-0`, { zIndex: 0 }],
    [`z-10`, { zIndex: 10 }],
    [`z-30`, { zIndex: 30 }],
    [`-z-30`, { zIndex: -30 }],
    [`z-100`, { zIndex: 100 }],
    // arbitrary
    [`z-194`, { zIndex: 194 }],
  ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toEqual(expected);
  });
});
