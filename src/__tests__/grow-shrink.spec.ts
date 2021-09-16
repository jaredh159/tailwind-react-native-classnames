import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`flex grow/shrink`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  const cases: Array<[string, Record<string, string | number>]> = [
    [`flex-shrink-0`, { flexShrink: 0 }],
    [`flex-shrink`, { flexShrink: 1 }],
    [`flex-grow-0`, { flexGrow: 0 }],
    [`flex-grow`, { flexGrow: 1 }],
    [`flex-grow-77`, { flexGrow: 77 }],
  ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toMatchObject(expected);
  });
});
