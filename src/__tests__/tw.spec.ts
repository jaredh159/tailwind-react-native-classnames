import rn from 'react-native';
import { describe, test, expect } from '@jest/globals';
import type { ViewStyle } from 'react-native';
import type { TwConfig } from '../tw-config';
import { create } from '../';

jest.mock(`react-native`, () => ({
  Platform: { OS: `ios` },
}));

describe(`tw`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  test(`cached utilities are === to prevent needless re-renders`, () => {
    expect(tw`w-0`).toBe(tw`w-0`);
  });

  test(`interpolation supports falsy numbers`, () => {
    const falsyNumber = 0;
    expect(tw`opacity-${falsyNumber}`).toEqual({ opacity: 0 });
  });

  test(`media queries`, () => {
    const config: TwConfig = { theme: { screens: { md: `768px` } } };
    tw = create(config);
    tw.setWindowDimensions({ width: 500, height: 500 });
    expect(tw`md:text-lg text-xs`).toMatchObject({ fontSize: 12 });
    tw.setWindowDimensions({ width: 800, height: 500 });
    expect(tw`md:text-lg text-xs`).toMatchObject({ fontSize: 18 });
  });

  test(`media queries boundaries`, () => {
    tw = create();
    // default breakpoints
    const utilities = `text-xs sm:text-lg md:text-xl lg:text-2xl xl:text-3xl`;
    expect(tw.style(utilities)).toMatchObject({ fontSize: 12 });
    tw.setWindowDimensions({ width: 500, height: 500 });
    expect(tw.style(utilities)).toMatchObject({ fontSize: 12 });
    tw.setWindowDimensions({ width: 639, height: 500 });
    expect(tw.style(utilities)).toMatchObject({ fontSize: 12 });
    tw.setWindowDimensions({ width: 640, height: 500 });
    expect(tw.style(utilities)).toMatchObject({ fontSize: 18 });
    tw.setWindowDimensions({ width: 767, height: 500 });
    expect(tw.style(utilities)).toMatchObject({ fontSize: 18 });
    tw.setWindowDimensions({ width: 768, height: 500 });
    expect(tw.style(utilities)).toMatchObject({ fontSize: 20 });
    tw.setWindowDimensions({ width: 1023, height: 500 });
    expect(tw.style(utilities)).toMatchObject({ fontSize: 20 });
    tw.setWindowDimensions({ width: 1024, height: 500 });
    expect(tw.style(utilities)).toMatchObject({ fontSize: 24 });
    tw.setWindowDimensions({ width: 1279, height: 500 });
    expect(tw.style(utilities)).toMatchObject({ fontSize: 24 });
    tw.setWindowDimensions({ width: 1280, height: 500 });
    expect(tw.style(utilities)).toMatchObject({ fontSize: 30 });
    // custom breakpoints
    tw = create({ theme: { screens: { custom: `555px` } } });
    tw.setWindowDimensions({ width: 554, height: 500 });
    expect(tw`text-xs custom:text-lg`).toMatchObject({ fontSize: 12 });
    tw.setWindowDimensions({ width: 555, height: 500 });
    expect(tw`text-xs custom:text-lg`).toMatchObject({ fontSize: 18 });
  });

  test(`multiple media queries`, () => {
    const config: TwConfig = { theme: { screens: { sm: `640px`, md: `768px` } } };
    tw = create(config);
    tw.setWindowDimensions({ width: 800, height: 0 });
    expect(tw`text-xs sm:text-md md:text-lg`).toMatchObject({ fontSize: 18 });
    // out of order
    expect(tw`md:text-lg sm:text-base text-xs`).toMatchObject({ fontSize: 18 });
    expect(tw`sm:text-base md:text-lg text-xs`).toMatchObject({ fontSize: 18 });
    expect(tw`md:text-lg text-xs sm:text-base`).toMatchObject({ fontSize: 18 });
  });

  test(`media queries + dependent style`, () => {
    const config: TwConfig = { theme: { screens: { md: `768px` } } };
    tw = create(config);
    tw.setWindowDimensions({ width: 800, height: 0 });
    expect(tw`text-xs leading-none md:leading-tight`).toEqual({
      fontSize: 12,
      lineHeight: 15,
    });
  });

  test(`orientation utilities`, () => {
    tw = create();
    tw.setWindowDimensions({ width: 600, height: 800 });
    expect(tw`mt-0 landscape:mt-1`).toEqual({ marginTop: 0 });
    expect(tw`landscape:mt-1 mt-0`).toEqual({ marginTop: 0 });
    expect(tw`landscape:mt-1 mt-0 portrait:mt-2`).toEqual({ marginTop: 8 });
    expect(tw`mt-0 portrait:mt-2 landscape:mt-1`).toEqual({ marginTop: 8 });
    tw = create();
    tw.setWindowDimensions({ width: 800, height: 600 });
    expect(tw`mt-0 landscape:mt-1`).toEqual({ marginTop: 4 });
    expect(tw`landscape:mt-1 mt-0`).toEqual({ marginTop: 4 });
    tw = create();
    expect(tw`mt-0 landscape:mt-1 portrait:mt-2`).toEqual({ marginTop: 0 });
    expect(tw`landscape:mt-1 mt-0 portrait:mt-2`).toEqual({ marginTop: 0 });
  });

  test(`multiple prefixes`, () => {
    rn.Platform.OS = `android`;
    const config: TwConfig = { theme: { screens: { md: `768px` } } };
    tw = create(config);
    tw.setWindowDimensions({ width: 800, height: 0 });
    tw.setColorScheme(`dark`);
    expect(
      tw`android:md:text-xs android:text-2xl ios:text-lg android:dark:mt-2 mt-1`,
    ).toMatchObject({
      fontSize: 12,
      marginTop: 8,
    });
  });

  test(`platform-matching`, () => {
    rn.Platform.OS = `ios`;
    tw = create();
    expect(tw`android:text-lg ios:text-xs`).toMatchObject({ fontSize: 12 });
    rn.Platform.OS = `android`;
    tw = create();
    expect(tw`android:text-lg ios:text-xs`).toMatchObject({ fontSize: 18 });
  });

  const relativeLineHeight: Array<[string, number, number]> = [
    [`text-xs leading-none`, 12, 12],
    [`text-xs leading-tight`, 12, 15],
    [`text-xs leading-snug`, 12, 16.5],
    [`text-xs leading-normal`, 12, 18],
    [`text-xs leading-relaxed`, 12, 19.5],
    [`text-xs leading-loose`, 12, 24],
  ];

  test.each(relativeLineHeight)(
    `line-height derived from font size "%s"`,
    (classes, fontSize, lineHeight) => {
      expect(tw`${classes}`).toEqual({ fontSize, lineHeight });
    },
  );

  const absoluteLineHeight: Array<[string, number]> = [
    [`leading-3`, 12],
    [`leading-4`, 16],
    [`leading-5`, 20],
    [`leading-6`, 24],
    [`leading-7`, 28],
    [`leading-8`, 32],
    [`leading-9`, 36],
    [`leading-[333px]`, 333],
  ];

  test.each(absoluteLineHeight)(
    `absolute line-height "%s" -> %dpx`,
    (classes, lineHeight) => {
      expect(tw`${classes}`).toEqual({ lineHeight });
    },
  );

  test(`customized line-height`, () => {
    tw = create({ theme: { lineHeight: { '5': `2rem`, huge: `400px` } } });
    expect(tw`leading-5`).toEqual({ lineHeight: 32 });
    expect(tw`leading-huge`).toEqual({ lineHeight: 400 });
  });

  test(`font-family`, () => {
    expect(tw`font-sans`).toEqual({ fontFamily: `ui-sans-serif` });
    tw = create({ theme: { fontFamily: { sans: `font1`, serif: [`font2`, `font3`] } } });
    expect(tw`font-sans`).toEqual({ fontFamily: `font1` });
    expect(tw`font-serif`).toEqual({ fontFamily: `font2` });
  });

  test(`negated values`, () => {
    expect(tw`-mt-1 -pb-2`).toEqual({ marginTop: -4, paddingBottom: -8 });
  });

  test(`arbitrary value`, () => {
    expect(tw`mt-[333px]`).toEqual({ marginTop: 333 });
    expect(tw`mt-[-333px]`).toEqual({ marginTop: -333 });
    expect(tw`-mt-[333px]`).toEqual({ marginTop: -333 });
  });

  test(`elevation (android-only)`, () => {
    expect(tw`elevation-1`).toEqual({ elevation: 1 });
    expect(tw`elevation-2`).toEqual({ elevation: 2 });
    expect(tw`elevation-17`).toMatchObject({ elevation: 17 });
  });

  describe(`font-variant-numeric support`, () => {
    test(`oldstyle-nums`, () => {
      expect(tw`oldstyle-nums`).toEqual({ fontVariant: [`oldstyle-nums`] });
    });

    test(`lining-nums`, () => {
      expect(tw`lining-nums`).toEqual({ fontVariant: [`lining-nums`] });
    });

    test(`tabular-nums`, () => {
      expect(tw`tabular-nums`).toEqual({ fontVariant: [`tabular-nums`] });
    });

    test(`proportional-nums`, () => {
      expect(tw`proportional-nums`).toEqual({ fontVariant: [`proportional-nums`] });
    });

    test(`multiple font variants`, () => {
      expect(tw`oldstyle-nums lining-nums tabular-nums proportional-nums`).toEqual({
        fontVariant: [
          `oldstyle-nums`,
          `lining-nums`,
          `tabular-nums`,
          `proportional-nums`,
        ],
      });
    });
  });

  test(`opacity-X`, () => {
    expect(tw`opacity-0`).toEqual({ opacity: 0 });
    expect(tw`opacity-5`).toEqual({ opacity: 0.05 });
    expect(tw`opacity-50`).toEqual({ opacity: 0.5 });
    expect(tw`opacity-100`).toEqual({ opacity: 1 });
    // arbitrary
    expect(tw`opacity-73`).toEqual({ opacity: 0.73 });
  });

  test(`tw.color()`, () => {
    expect(tw.color(`black`)).toBe(`#000`);
    expect(tw.color(`bg-black`)).toBe(`#000`); // incorrect usage, but still works
    expect(tw.color(`border-black`)).toBe(`#000`); // incorrect usage, but still works
    expect(tw.color(`text-black`)).toBe(`#000`); // incorrect usage, but still works
    expect(tw.color(`white/25`)).toBe(`rgba(255, 255, 255, 0.25)`);
    expect(tw.color(`black opacity-50`)).toBe(`rgba(0, 0, 0, 0.5)`);
    expect(tw.color(`red-500`)).toBe(`#ef4444`);
    // @see https://github.com/jaredh159/tailwind-react-native-classnames/issues/273
    tw = create({
      theme: { extend: { colors: { text: { primary: `#F9E` } } } },
    });
    expect(tw.color(`text-primary`)).toBe(`#F9E`);
  });

  test(`merging in user styles`, () => {
    expect(tw.style(`bg-black`, { textShadowColor: `#ff0` })).toEqual({
      backgroundColor: `#000`,
      textShadowColor: `#ff0`,
    });

    expect(tw.style({ lineHeight: 16 }, { elevation: 3 })).toEqual({
      lineHeight: 16,
      elevation: 3,
    });
  });

  test(`mapped style after platform prefix works`, () => {
    rn.Platform.OS = `ios`;
    tw = create();
    expect(tw`ios:hidden`).toEqual({ display: `none` });
  });

  test(`style-object only doesn't confuse cache`, () => {
    expect(tw.style({ width: 90 })).toEqual({ width: 90 });
    expect(tw.style({ width: 40 })).toEqual({ width: 40 });
  });

  test(`rn style objects don't confuse cache`, () => {
    expect(tw.style(`pt-1`, { width: 90 })).toEqual({ paddingTop: 4, width: 90 });
    expect(tw.style(`pt-1`, { width: 100 })).toEqual({ paddingTop: 4, width: 100 });
  });

  test(`unknown prefixes produce null styles`, () => {
    expect(tw`w-1 foo:w-2`.width).toBe(4);
    expect(tw`lol:hidden`.display).toBeUndefined();
  });

  test(`retina prefix`, () => {
    expect(tw`w-1 retina:w-2`.width).toBe(4);
    expect(tw`retina:w-2 w-1`.width).toBe(4);
    tw.setPixelDensity(1);
    expect(tw`w-1 retina:w-2`.width).toBe(4);
    expect(tw`retina:w-2 w-1`.width).toBe(4);
    tw.setPixelDensity(2);
    expect(tw`w-1 retina:w-2`.width).toBe(8);
    expect(tw`retina:w-2 w-1`.width).toBe(8);
  });

  // @see https://github.com/jaredh159/tailwind-react-native-classnames/issues/60
  test(`user styles not mixed into cache`, () => {
    expect(tw.style(`text-base mb-4`, { opacity: 0.5 })).toEqual({
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 16,
      opacity: 0.5,
    });

    expect(tw`text-base mb-4`).toEqual({
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 16,
    });
  });

  // @see https://github.com/jaredh159/tailwind-react-native-classnames/issues/96
  test(`no typescript error when passing ViewStyle to tw.style()`, () => {
    const rnViewStyle: ViewStyle = { backgroundColor: `#ff000` };
    expect(tw.style(rnViewStyle)).toEqual({ backgroundColor: `#ff000` });
  });

  // @see https://github.com/jaredh159/tailwind-react-native-classnames/issues/159
  test(`override font default styles`, () => {
    expect(tw`font-sans`).toEqual({ fontFamily: `ui-sans-serif` });
    expect(tw`font-bold`).toEqual({ fontWeight: `bold` });

    tw = create({
      theme: { fontFamily: { bold: `Poppins-bold` }, fontWeight: { light: 600 } },
    });
    expect(tw`font-sans`).toEqual({}); // Erased by override font families
    expect(tw`font-bold`).toEqual({ fontFamily: `Poppins-bold` });
    expect(tw`font-light`).toEqual({ fontWeight: `600` });

    tw = create({
      theme: {
        extend: { fontFamily: { bold: `Poppins-bold` }, fontWeight: { light: 600 } },
      },
    });
    expect(tw`font-sans`).toEqual({ fontFamily: `ui-sans-serif` });
    expect(tw`font-bold`).toEqual({ fontFamily: `Poppins-bold` });
    expect(tw`font-light`).toEqual({ fontWeight: `600` });
  });

  test(`ir caching between breakpoints`, () => {
    const tw = create(); // one creation, reused so cache is shared
    tw.setWindowDimensions({ width: 1100, height: 600 }); // breakpoint=lg

    expect(tw.style(`w-3`)).toEqual({ width: 12 });
    expect(tw.style(`w-1 lg:w-3`)).toEqual({ width: 12 });
    expect(tw.style(`w-1 md:w-2 lg:w-3`)).toEqual({ width: 12 });
  });

  test(`duplicated style priority`, () => {
    expect(tw`bg-white bg-black`).toEqual({ backgroundColor: `#000` });
    expect(tw`bg-white bg-black bg-white`).toEqual({ backgroundColor: `#fff` });
  });
});
