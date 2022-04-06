import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`aspect ratio`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  const cases: Array<[string, Record<string, string | number | Record<string, number>>]> =
    [
      [`aspect-square`, { aspectRatio: 1 }],
      [`aspect-video`, { aspectRatio: 16 / 9 }],
      [`aspect-1`, { aspectRatio: 1 }],
      [`aspect-4`, { aspectRatio: 4 }],
      [`aspect-0.5`, { aspectRatio: 0.5 }],
      [`aspect-.5`, { aspectRatio: 0.5 }],
      [`aspect-16/9`, { aspectRatio: 16 / 9 }],
      // legacy, deprecated
      [`aspect-ratio-1`, { aspectRatio: 1 }],
      [`aspect-ratio-4`, { aspectRatio: 4 }],
      [`aspect-ratio-0.5`, { aspectRatio: 0.5 }],
      [`aspect-ratio-.5`, { aspectRatio: 0.5 }],
      [`aspect-ratio-16/9`, { aspectRatio: 16 / 9 }],
    ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toEqual(expected);
  });
});
