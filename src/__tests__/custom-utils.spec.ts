import { describe, test, expect } from '@jest/globals';
// @ts-ignore
import tailwindPlugin from 'tailwindcss/plugin';
import type { TwConfig } from '../tw-config';
import { create, plugin } from '../';

describe(`custom registered utilities`, () => {
  test(`register custom utilities, using package plugin fn`, () => {
    const config: TwConfig = {
      plugins: [
        plugin(({ addUtilities }) => {
          addUtilities({
            btn: { paddingTop: 33 },
            custom: `mt-1 text-white`,
          });
        }),
      ],
    };
    const tw = create(config);
    expect(tw`btn`).toEqual({ paddingTop: 33 });
    expect(tw`custom`).toEqual({ marginTop: 4, color: `#fff` });
    // works with media queries
    expect(tw`md:btn`).toEqual({});
    tw.setWindowDimensions({ width: 800, height: 800 });
    expect(tw`md:btn`).toEqual({ paddingTop: 33 });
    expect(tw`md:custom`).toEqual({ marginTop: 4, color: `#fff` });
  });

  test(`supports leading dot for added utilities`, () => {
    const config: TwConfig = {
      plugins: [
        plugin(({ addUtilities }) => {
          addUtilities({
            '.btn': { textTransform: `uppercase` },
            '.resize-repeat': { resizeMode: `repeat` },
          });
        }),
      ],
    };
    const tw = create(config);
    expect(tw`resize-repeat`).toMatchObject({ resizeMode: `repeat` });
    expect(tw`btn`).toMatchObject({ textTransform: `uppercase` });
  });

  test(`registered custom utilities merge with regular utilities`, () => {
    const config: TwConfig = {
      plugins: [
        plugin(({ addUtilities }) => {
          addUtilities({
            custom: `mt-1 text-white`,
          });
        }),
      ],
    };
    const tw = create(config);
    expect(tw`custom mr-1`).toEqual({ marginTop: 4, color: `#fff`, marginRight: 4 });
  });

  test(`register custom utilities, using tailwindcss fn`, () => {
    const config: TwConfig = {
      plugins: [
        // @ts-ignore
        tailwindPlugin(({ addUtilities }) => {
          addUtilities({
            // @ts-ignore
            btn: { paddingTop: 33 },
            custom: `mt-1 text-white`,
          });
        }),
      ],
    };
    const tw = create(config);
    expect(tw`btn`).toEqual({ paddingTop: 33 });
    expect(tw`custom`).toEqual({ marginTop: 4, color: `#fff` });
    expect(tw`custom`).toEqual({ marginTop: 4, color: `#fff` });
  });

  test(`custom utils override built-in classes`, () => {
    const config: TwConfig = {
      plugins: [
        plugin(({ addUtilities }) => {
          addUtilities({
            'items-center': { paddingTop: 33 },
          });
        }),
      ],
    };
    const tw = create(config);
    expect(tw`items-center`).toEqual({ paddingTop: 33 });
  });

  test(`attempt to use anything but addUtilities throws`, () => {
    const config: TwConfig = {
      plugins: [
        plugin(({ addBase }) => {
          addBase();
        }),
      ],
    };
    expect(() => create(config)).toThrow();
  });
});
