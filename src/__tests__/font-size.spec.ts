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

  test(`line-height shorthand`, () => {
    expect(tw`text-sm leading-6`).toMatchObject({ fontSize: 14, lineHeight: 24 });
    expect(tw`text-sm/6`).toMatchObject({ fontSize: 14, lineHeight: 24 });
  });

  test.each<[string, number, number]>([
    [`text-xl/[1]`, 20, 20],
    [`text-2xl/none`, 24, 24],
    [`text-xs/tight`, 12, 15],
    [`text-sm/snug`, 14, 19.25],
    [`text-lg/normal`, 18, 27],
    [`text-xl/relaxed`, 20, 32.5],
    [`text-base/loose`, 16, 32],
    [`text-[13px]/[1.5]`, 13, 19.5],
    [`text-xl/[0]`, 20, 0],
    [`text-[0px]/none`, 0, 0],
  ])(`relative line-height shorthand %s`, (utility, fontSize, lineHeight) => {
    expect(tw.style(utility)).toEqual({ fontSize, lineHeight });
  });

  test(`relative shorthand preserves other configured font properties`, () => {
    tw = create({
      theme: {
        extend: {
          fontSize: {
            brand: [
              `1.25rem`,
              { lineHeight: `2rem`, letterSpacing: `1px`, fontWeight: `700` },
            ],
          },
          lineHeight: { brand: `1.25` },
        },
      },
    });
    expect(tw`text-brand/brand`).toEqual({
      fontSize: 20,
      lineHeight: 25,
      letterSpacing: 1,
      fontWeight: 700,
    });
  });

  test(`relative shorthand does not change a cached font-size style`, () => {
    const original = tw`text-xl`;
    expect(tw`text-xl/none`).toEqual({ fontSize: 20, lineHeight: 20 });
    expect(tw`text-xl`).toBe(original);
    expect(original).toEqual({ fontSize: 20, lineHeight: 28 });
  });

  test(`relative shorthand follows viewport-dependent font sizes`, () => {
    tw.setWindowDimensions({ width: 800, height: 600 });
    expect(tw`text-[10vw]/[1.5]`).toEqual({ fontSize: 80, lineHeight: 120 });
    tw.setWindowDimensions({ width: 400, height: 600 });
    expect(tw`text-[10vw]/[1.5]`).toEqual({ fontSize: 40, lineHeight: 60 });
  });

  test(`relative shorthand composes with explicit line-height utilities`, () => {
    expect(tw`text-xl/none leading-8`).toEqual({ fontSize: 20, lineHeight: 32 });
    expect(tw`leading-8 text-xl/none`).toEqual({ fontSize: 20, lineHeight: 20 });
    expect(tw`text-xl/[30px]`).toEqual({ fontSize: 20, lineHeight: 30 });
  });

  test(`color opacity remains separate from font-size shorthand`, () => {
    expect(tw`text-red-500/50`).toEqual({ color: `rgba(239, 68, 68, 0.5)` });
    expect(tw`text-[#ff0000]/50`).toEqual({ color: `rgba(255, 0, 0, 0.5)` });
  });

  test(`invalid font-size and line-height shorthand stays unsupported`, () => {
    expect(tw`text-missing/none`).toEqual({});
    expect(tw`text-xl/not-a-line-height`).toEqual({});
    tw = create({ theme: { fontSize: { ratio: `100%` } } });
    expect(tw`text-ratio/none`).toEqual({});
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

    tw = create({ theme: { fontSize: { xs: [`0.75rem`, { fontWeight: `700` }] } } });
    expect(tw`text-xs`).toEqual({ fontSize: 12, fontWeight: 700 });

    tw = create({
      theme: {
        fontSize: { xs: [`0.75rem`, { lineHeight: `0.5rem`, letterSpacing: `1px` }] },
      },
    });
    expect(tw`text-xs`).toEqual({ fontSize: 12, letterSpacing: 1, lineHeight: 8 });
  });
});
