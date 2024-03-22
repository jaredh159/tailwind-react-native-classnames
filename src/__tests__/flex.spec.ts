import { describe, expect, test } from '@jest/globals';
import type { TwTheme } from '../tw-config';
import { create } from '..';

describe(`flex grow/shrink`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  const cases: Array<[string, Record<string, string | number>]> = [
    [`flex-shrink-0`, { flexShrink: 0 }],
    [`flex-shrink`, { flexShrink: 1 }],
    [`flex-grow-0`, { flexGrow: 0 }],
    [`flex-grow`, { flexGrow: 1 }],
    [`flex-grow-77`, { flexGrow: 77 }],
    [`grow`, { flexGrow: 1 }],
    [`grow-0`, { flexGrow: 0 }],
    [`grow-33`, { flexGrow: 33 }],
    [`grow-[33]`, { flexGrow: 33 }],
    [`shrink`, { flexShrink: 1 }],
    [`shrink-0`, { flexShrink: 0 }],
    [`shrink-77`, { flexShrink: 77 }],

    [`basis-0`, { flexBasis: 0 }],
    [`basis-1`, { flexBasis: 4 }],
    [`basis-1/2`, { flexBasis: `50%` }],
    [`basis-3.5`, { flexBasis: 14 }],
    [`basis-auto`, { flexBasis: `auto` }],
    [`basis-full`, { flexBasis: `100%` }],
    [`flex-basis-0`, { flexBasis: 0 }],
    [`flex-basis-1`, { flexBasis: 4 }],
    [`flex-basis-1/2`, { flexBasis: `50%` }],
    [`flex-basis-3.5`, { flexBasis: 14 }],
    [`flex-basis-auto`, { flexBasis: `auto` }],
    [`flex-basis-full`, { flexBasis: `100%` }],
  ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toEqual(expected);
  });
});

describe(`flex shorthand utilities`, () => {
  const cases: Array<[string, Record<string, string | number>, TwTheme['flex'] | null]> =
    [
      [`flex-auto`, { flexGrow: 1, flexShrink: 1, flexBasis: `auto` }, null],
      [`flex-initial`, { flexGrow: 0, flexShrink: 1, flexBasis: `auto` }, null],
      [`flex-none`, { flexGrow: 0, flexShrink: 0, flexBasis: `auto` }, null],
      [`flex-1`, { flexGrow: 1, flexShrink: 1, flexBasis: `0%` }, null],

      // unsupported
      [`flex-revert`, {}, null],
      [`flex-unset`, {}, null],
      [`flex-min-content`, {}, null],

      // arbitrary
      [`flex-33`, { flexGrow: 33, flexBasis: `0%` }, null],
      [`flex-0.2`, { flexGrow: 0.2, flexBasis: `0%` }, null],

      // configged with two numeric values
      [`flex-custom`, { flexGrow: 11, flexShrink: 22 }, { custom: `11 22` }],

      // configged with number/width combo
      [`flex-custom2`, { flexGrow: 3, flexBasis: 10 }, { custom2: `3 10px` }],

      // configged with 3 values
      [
        `flex-custom3`,
        { flexGrow: 5, flexShrink: 6, flexBasis: `10%` },
        { custom3: `5 6 10%` },
      ],
    ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected, config) => {
    const tw = create(config ? { theme: { flex: config } } : {});
    expect(tw.style(utility)).toEqual(expected);
  });
});

describe(`flex gap`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  const cases: Array<[string, Record<string, string | number>]> = [
    [`gap-0`, { gap: 0 }],
    [`gap-1`, { gap: 4 }],
    [`gap-1.5`, { gap: 6 }],
    [`gap-y-0`, { rowGap: 0 }],
    [`gap-y-1`, { rowGap: 4 }],
    [`gap-y-1.5`, { rowGap: 6 }],
    [`gap-x-0`, { columnGap: 0 }],
    [`gap-x-1`, { columnGap: 4 }],
    [`gap-x-1.5`, { columnGap: 6 }],
    [`gap-px`, { gap: 1 }],
    [`gap-1px`, { gap: 1 }],
    [`gap-[1px]`, { gap: 1 }],
    [`gap-[10px]`, { gap: 10 }],
  ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toEqual(expected);
  });
});
