import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`inset`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  const cases: Array<[string, Record<string, string | number>]> = [
    [`bottom-0`, { bottom: 0 }],
    [`top-0`, { top: 0 }],
    [`left-0`, { left: 0 }],
    [`right-0`, { right: 0 }],
    [`inset-0`, { top: 0, bottom: 0, left: 0, right: 0 }],
    [`bottom-1/3`, { bottom: `33.333333%` }],
    [`top-2`, { top: 8 }],
    [`-top-2`, { top: -8 }],
    [`inset-1`, { top: 4, bottom: 4, left: 4, right: 4 }],
    [`inset-y-1`, { top: 4, bottom: 4 }],
    [`inset-x-1`, { left: 4, right: 4 }],
    [`right-[333px]`, { right: 333 }],
    [`right-[-16px]`, { right: -16 }],
    [`-right-[16px]`, { right: -16 }],
    [`left-17/18`, { left: `${(17 / 18) * 100}%` }],
    [`top-px`, { top: 1 }],
    // arbitrary, not configged number
    [`top-15`, { top: 60 }],
    // auto values
    [`top-auto`, { top: `auto` }],
  ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toEqual(expected);
  });
});
