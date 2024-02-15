import { expect, test, describe } from '@jest/globals';
import type { TwTheme } from '../tw-config';
import screens from '../screens';

describe(`screens()`, () => {
  const cases: Array<[TwTheme['screens'], ReturnType<typeof screens>]> = [
    [
      {
        sm: `640px`,
        md: `768px`,
        lg: `1024px`,
        xl: `1280px`,
      },
      {
        sm: [640, Infinity, 0],
        md: [768, Infinity, 1],
        lg: [1024, Infinity, 2],
        xl: [1280, Infinity, 3],
      },
    ],
    [{ jared: `100px` }, { jared: [100, Infinity, 0] }],
    [
      {
        '2xl': { max: `1535px` },
        xl: { max: `1279px` },
        lg: { max: `1023px` },
        md: { max: `767px` },
        sm: { max: `639px` },
      },
      {
        sm: [0, 639, 0],
        md: [0, 767, 1],
        lg: [0, 1023, 2],
        xl: [0, 1279, 3],
        '2xl': [0, 1535, 4],
      },
    ],
    [
      {
        sm: { min: `640px`, max: `767px` },
        lg: { min: `1024px`, max: `1279px` },
        md: { min: `768px`, max: `1023px` },
        xl: { min: `1280px`, max: `1535px` },
        '2xl': { min: `1536px` },
      },
      {
        sm: [640, 767, 0],
        md: [768, 1023, 1],
        lg: [1024, 1279, 2],
        xl: [1280, 1535, 3],
        '2xl': [1536, Infinity, 4],
      },
    ],
  ];

  // https://tailwindcss.com/docs/breakpoints#custom-media-queries
  test.each(cases)(`converts tw screens to ranges`, (input, expected) => {
    expect(screens(input)).toEqual(expected);
  });
});
