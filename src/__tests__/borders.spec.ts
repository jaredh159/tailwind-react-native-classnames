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
    [`border-blue-200`, { borderColor: `#bfdbfe` }],
    [`border-black border-opacity-50`, { borderColor: `rgba(0, 0, 0, 0.5)` }],
    [`border-dashed`, { borderStyle: `dashed` }],
    [`border-solid`, { borderStyle: `solid` }],
    [`border-dotted`, { borderStyle: `dotted` }],
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
    [`rounded-l-lg`, { borderLeftRadius: 8 }],
    [`rounded-l`, { borderLeftRadius: 4 }],
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
