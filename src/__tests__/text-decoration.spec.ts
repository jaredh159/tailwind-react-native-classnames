import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`text-decoration utilities`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  const cases: Array<[string, Record<string, string>]> = [
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
      `underline decoration-dashed decoration-[#58c4dc]`,
      {
        textDecorationLine: `underline`,
        textDecorationStyle: `dashed`,
        textDecorationColor: `#58c4dc`,
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
