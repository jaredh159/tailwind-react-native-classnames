import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`text-decoration utilities`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  const cases: Array<[string, Record<string, string | number>]> = [
    // outline style
    [`outline`, { outlineStyle: `solid` }],
    [`outline-dotted`, { outlineStyle: `dotted` }],
    [`outline-dashed`, { outlineStyle: `dashed` }],
    // outline width
    [`outline-4`, { outlineWidth: 4 }],
    [`outline-[5px]`, { outlineWidth: 5 }],
    // outline offset
    [`outline-offset-0`, { outlineOffset: 0 }],
    [`outline-offset-[-3px]`, { outlineOffset: -3 }],
    // all values mix
    [
      `outline outline-1 outline-[#58c4dc] outline-offset-2`,
      {
        outlineWidth: 1,
        outlineStyle: `solid`,
        outlineOffset: 2,
        outlineColor: `#58c4dc`,
      },
    ],
    [
      `outline-dashed outline-[6px] outline-offset-[-2px] outline-black/50`,
      {
        outlineWidth: 6,
        outlineStyle: `dashed`,
        outlineOffset: -2,
        outlineColor: `rgba(0, 0, 0, 0.5)`,
      },
    ],
  ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toEqual(expected);
  });
});
