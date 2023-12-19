import { describe, beforeEach, test, expect } from '@jest/globals';
import { create } from '../';

describe(`arbitrary breakpoint prefixes`, () => {
  let tw = create();
  beforeEach(() => {
    tw = create();
  });

  const cases: Array<
    [
      dims: { width: number; height: number } | null,
      utility: string,
      expected: Record<string, string | number>,
    ]
  > = [
    [{ width: 800, height: 600 }, `w-1 min-w-[900px]:w-2`, { width: 4 }],
    [{ width: 800, height: 600 }, `w-1 min-w-[700px]:w-2`, { width: 8 }],
    [{ width: 800, height: 600 }, `min-w-[700px]:w-2 w-1`, { width: 8 }],
    [{ width: 8, height: 6 }, `w-1 min-h-[7px]:w-2`, { width: 4 }],
    [{ width: 8, height: 6 }, `min-h-[7px]:w-2 w-1`, { width: 4 }],
    [{ width: 8, height: 6 }, `w-1 min-h-[5px]:max-h-[8px]:w-2`, { width: 8 }],
    [{ width: 4, height: 9 }, `w-1 min-h-[5px]:max-h-[8px]:w-2`, { width: 4 }],
    [null, `w-1 min-w-[900px]:w-2`, { width: 4 }],
  ];

  test.each(cases)(`tw\`%s\` -> %s`, (dims, utility, expected) => {
    if (dims) {
      tw.setWindowDimensions(dims);
    }
    expect(tw.style(utility)).toEqual(expected);
  });
});
