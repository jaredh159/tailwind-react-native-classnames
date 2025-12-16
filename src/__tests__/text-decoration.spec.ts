import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`text-decoration utilities`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  const cases: Array<[string, Record<string, string>]> = [
    // decoration line
    [`underline`, { textDecorationLine: `underline` }],
    [`line-through`, { textDecorationLine: `line-through` }],
    [`no-underline`, { textDecorationLine: `none` }],
    // decoration style
    [`decoration-solid`, { textDecorationStyle: `solid` }],
    [`decoration-double`, { textDecorationStyle: `double` }],
    [`decoration-dotted`, { textDecorationStyle: `dotted` }],
    [`decoration-dashed`, { textDecorationStyle: `dashed` }],
    // with color
    [
      `decoration-solid decoration-black`,
      { textDecorationStyle: `solid`, textDecorationColor: `#000` },
    ],
    [
      `decoration-double decoration-black/50`,
      { textDecorationStyle: `double`, textDecorationColor: `rgba(0, 0, 0, 0.5)` },
    ],
    // all values mix
    [
      `underline decoration-dashed decoration-black`,
      {
        textDecorationLine: `underline`,
        textDecorationStyle: `dashed`,
        textDecorationColor: `#000`,
      },
    ],
    [
      `line-through decoration-solid decoration-black/50`,
      {
        textDecorationLine: `line-through`,
        textDecorationStyle: `solid`,
        textDecorationColor: `rgba(0, 0, 0, 0.5)`,
      },
    ],
  ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toEqual(expected);
  });
});
