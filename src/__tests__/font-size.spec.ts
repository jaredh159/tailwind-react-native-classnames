import { describe, test, expect } from '@jest/globals';
import type { TwConfig } from '../tw-config';
import { create } from '..';

describe(`font size`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  test(`font-sizes`, () => {
    expect(tw`text-xs`).toMatchObject({ fontSize: 12, lineHeight: 16 });
    expect(tw`text-sm`).toMatchObject({ fontSize: 14, lineHeight: 20 });
    expect(tw`text-base`).toMatchObject({ fontSize: 16, lineHeight: 24 });
    expect(tw`text-lg`).toMatchObject({ fontSize: 18, lineHeight: 28 });
    expect(tw`text-2xl`).toMatchObject({ fontSize: 24, lineHeight: 32 });
    expect(tw`text-3xl`).toMatchObject({ fontSize: 30, lineHeight: 36 });
    expect(tw`text-4xl`).toMatchObject({ fontSize: 36, lineHeight: 40 });
    expect(tw`text-5xl`).toMatchObject({ fontSize: 48, lineHeight: 48 });
    expect(tw`text-6xl`).toMatchObject({ fontSize: 60, lineHeight: 60 });
    expect(tw`text-7xl`).toMatchObject({ fontSize: 72, lineHeight: 72 });
    expect(tw`text-8xl`).toMatchObject({ fontSize: 96, lineHeight: 96 });
    expect(tw`text-9xl`).toMatchObject({ fontSize: 128, lineHeight: 128 });
  });

  test(`arbitrary font sizes`, () => {
    expect(tw`text-[11px]`).toMatchObject({ fontSize: 11 });
    tw.setWindowDimensions({ width: 800, height: 600 });
    expect(tw`text-[50vw]`).toMatchObject({ fontSize: 400 });
    expect(tw`text-[50vh]`).toMatchObject({ fontSize: 300 });
  });

  test(`font-sizes with relative line-height`, () => {
    const config: TwConfig = {
      theme: {
        fontSize: {
          relative: [`1.25rem`, { lineHeight: `1.5` }],
          relativeem: [`1.25rem`, { lineHeight: `1.5em` }],
          twostrings: [`1.25rem`, `1.5`],
          twostringsem: [`1.25rem`, `1.5em`],
        },
      },
    };
    tw = create(config);
    expect(tw`text-relative`).toMatchObject({ fontSize: 20, lineHeight: 30 });
    expect(tw`text-relativeem`).toMatchObject({ fontSize: 20, lineHeight: 30 });
    expect(tw`text-twostrings`).toMatchObject({ fontSize: 20, lineHeight: 30 });
    expect(tw`text-twostringsem`).toMatchObject({ fontSize: 20, lineHeight: 30 });
  });

  test(`customized font-size variations`, () => {
    tw = create({ theme: { fontSize: { xs: `0.75rem` } } });

    expect(tw`text-xs`).toEqual({ fontSize: 12 });

    tw = create({ theme: { fontSize: { xs: [`0.75rem`, `0.75rem`] } } });
    expect(tw`text-xs`).toEqual({ fontSize: 12, lineHeight: 12 });

    tw = create({ theme: { fontSize: { xs: [`0.75rem`, { lineHeight: `0.75rem` }] } } });
    expect(tw`text-xs`).toEqual({ fontSize: 12, lineHeight: 12 });

    tw = create({ theme: { fontSize: { xs: [`0.75rem`, { letterSpacing: `1px` }] } } });
    expect(tw`text-xs`).toEqual({ fontSize: 12, letterSpacing: 1 });

    tw = create({
      theme: {
        fontSize: { xs: [`0.75rem`, { lineHeight: `0.5rem`, letterSpacing: `1px` }] },
      },
    });
    expect(tw`text-xs`).toEqual({ fontSize: 12, letterSpacing: 1, lineHeight: 8 });
  });
});
