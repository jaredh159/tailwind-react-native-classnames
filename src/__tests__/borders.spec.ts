import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`borders`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  const basicCases: Array<[string, Record<string, number | string>]> = [
    [`border-0`, { borderWidth: 0 }],
    [`border`, { borderWidth: 1 }],
    [`border-2`, { borderWidth: 2 }],
    [`border-4`, { borderWidth: 4 }],
    [`border-8`, { borderWidth: 8 }],
    [`border-t-2`, { borderTopWidth: 2 }],
    [`border-r-2`, { borderRightWidth: 2 }],
    [`border-b-2`, { borderBottomWidth: 2 }],
    [`border-l-2`, { borderLeftWidth: 2 }],
    [`border-white`, { borderColor: `#fff` }],
    [`border-t-white`, { borderTopColor: `#fff` }],
    [`border-t-[#e9c46a]`, { borderTopColor: `#e9c46a` }],
    [`border-blue-200`, { borderColor: `#bfdbfe` }],
    [`border-black border-opacity-50`, { borderColor: `rgba(0, 0, 0, 0.5)` }],
    [`border-dashed`, { borderStyle: `dashed` }],
    [`border-solid`, { borderStyle: `solid` }],
    [`border-dotted`, { borderStyle: `dotted` }],
    // Arbitrary Pixel Values
    [`border-[25px]`, { borderWidth: 25 }],
    [`border-t-[25px]`, { borderTopWidth: 25 }],
    [`border-r-[25px]`, { borderRightWidth: 25 }],
    [`border-b-[25px]`, { borderBottomWidth: 25 }],
    [`border-l-[25px]`, { borderLeftWidth: 25 }],
    // Arbitrary Rem Values
    [`border-[2.5rem]`, { borderWidth: 40 }],
    [`border-t-[2.5rem]`, { borderTopWidth: 40 }],
    [`border-r-[2.5rem]`, { borderRightWidth: 40 }],
    [`border-b-[2.5rem]`, { borderBottomWidth: 40 }],
    [`border-l-[2.5rem]`, { borderLeftWidth: 40 }],

    [`border-[7%]`, {}], // not supported in RN
  ];

  test.each(basicCases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toEqual(expected);
  });
});

describe(`border-radius`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  const cases: Array<[string, Record<string, number | string>]> = [
    [`rounded-none`, { borderRadius: 0 }],
    [`rounded-t-2xl`, { borderTopLeftRadius: 16, borderTopRightRadius: 16 }],
    [`rounded-b-2xl`, { borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }],
    [`rounded-2xl`, { borderRadius: 16 }],
    [`rounded-l-lg`, { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }],
    [`rounded-l`, { borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }],
    [`rounded-r`, { borderTopRightRadius: 4, borderBottomRightRadius: 4 }],
    [`rounded-tl-lg`, { borderTopLeftRadius: 8 }],

    // arbitrary
    [`rounded-[30px]`, { borderRadius: 30 }],
    [`rounded-[7rem]`, { borderRadius: 7 * 16 }],
    [`rounded-[30%]`, {}], // not supported in RN
  ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toEqual(expected);
  });
});
