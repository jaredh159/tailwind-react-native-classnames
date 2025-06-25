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
    [`border-t-[steelblue]`, { borderTopColor: `steelblue` }],
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

describe(`custom borderWidth`, () => {
  test(`custom borderWidth values from theme config are applied`, () => {
    const tw = create({
      theme: {
        borderWidth: {
          DEFAULT: `1px`,
          0: `0`,
          2: `2px`,
          4: `4px`,
          8: `8px`,
          10: `10px`,
          0.5: `0.5px`,
          hw: `0.33`,
          foo: `3rem`,
          bar: `57px`,
        },
      },
    });
    expect(tw.style(`border-bar`)).toEqual({ borderWidth: 57 });
    expect(tw.style(`border-foo`)).toEqual({ borderWidth: 48 });
    expect(tw.style(`border-hw`)).toEqual({ borderWidth: 0.33 });
    expect(tw.style(`border-0.5`)).toEqual({ borderWidth: 0.5 });
    expect(tw.style(`border`)).toEqual({ borderWidth: 1 });
  });

  test(`custom borderWidth and width values from theme.extend are applied`, () => {
    const tw = create({
      plugins: [],
      theme: {
        extend: {
          borderWidth: {
            hw: `0.33`,
            foo: `3rem`,
            bar: `57px`,
          },
          width: { hw: `0.33` },
        },
      },
    });
    expect(tw.style(`border-hw w-hw`)).toEqual({ borderWidth: 0.33, width: 0.33 });
    expect(tw.style(`border-bar`)).toEqual({ borderWidth: 57 });
    expect(tw.style(`border-foo`)).toEqual({ borderWidth: 48 });
  });
});
