import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`filter utilities`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  const cases: Array<[string, Record<string, Record<string, string | number>[]>]> = [
    // grayscale
    [`grayscale`, { filter: [{ grayscale: 1 }] }],
    [`grayscale-0`, { filter: [{ grayscale: 0 }] }],
    [`grayscale-[50%]`, { filter: [{ grayscale: 0.5 }] }],
    // invert
    [`invert`, { filter: [{ invert: 1 }] }],
    [`invert-0`, { filter: [{ invert: 0 }] }],
    [`invert-[25%]`, { filter: [{ invert: 0.25 }] }],
    // sepia
    [`sepia`, { filter: [{ sepia: 1 }] }],
    [`sepia-0`, { filter: [{ sepia: 0 }] }],
    [`sepia-[0.75]`, { filter: [{ sepia: 0.75 }] }],
    // contrast
    [`contrast-125`, { filter: [{ contrast: 1.25 }] }],
    [`contrast-[2.5]`, { filter: [{ contrast: 2.5 }] }],
    // brightness
    [`brightness-75`, { filter: [{ brightness: 0.75 }] }],
    [`brightness-110`, { filter: [{ brightness: 1.1 }] }],
    [`brightness-[1.75]`, { filter: [{ brightness: 1.75 }] }],
    // saturate
    [`saturate-0`, { filter: [{ saturate: 0 }] }],
    [`saturate-[.75]`, { filter: [{ saturate: 0.75 }] }],
    // hue rotate
    [`hue-rotate-90`, { filter: [{ hueRotate: `90deg` }] }],
    [`hue-rotate-[27deg]`, { filter: [{ hueRotate: `27deg` }] }],
    [`hue-rotate-[3rad]`, { filter: [{ hueRotate: `3rad` }] }],
    [`hue-rotate-[-270deg]`, { filter: [{ hueRotate: `-270deg` }] }],
    // all values mix
    [
      `grayscale contrast-25 brightness-25 invert sepia-25 saturate-75 hue-rotate-90`,
      {
        filter: [
          { grayscale: 1 },
          { contrast: 0.25 },
          { brightness: 0.25 },
          { invert: 1 },
          { sepia: 0.25 },
          { saturate: 0.75 },
          { hueRotate: `90deg` },
        ],
      },
    ],
  ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toEqual(expected);
  });
});
