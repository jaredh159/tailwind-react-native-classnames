import { describe, test, expect } from '@jest/globals';
import { create } from '..';
import { TwTheme } from '../tw-config';

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
