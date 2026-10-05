import { describe, test, expect } from '@jest/globals';
import { create } from '../create';

describe(`color utility prefixes`, () => {
  test.each([`bg`, `text`, `border`, `border-l`])(
    `dark %s colors track the current color scheme`,
    (prefix) => {
      const tw = create({}, `ios`, undefined);
      tw.setColorScheme(`light`);
      expect(tw.color(`dark:${prefix}-red-500`)).toBeUndefined();
      tw.setColorScheme(`dark`);
      expect(tw.color(`dark:${prefix}-red-500`)).toBe(`#ef4444`);
      tw.setColorScheme(`light`);
      expect(tw.color(`dark:${prefix}-red-500`)).toBeUndefined();
      tw.setColorScheme(`dark`);
      expect(tw.color(`dark:${prefix}-red-500`)).toBe(`#ef4444`);
    },
  );

  test(`the reported custom red color resolves in dark mode`, () => {
    const tw = create({ theme: { colors: { red: `#f00` } } }, `ios`, undefined);
    tw.setColorScheme(`dark`);
    expect(tw.color(`dark:text-red`)).toBe(`#f00`);
  });

  test.each([
    `bg-white dark:bg-black`,
    `dark:bg-black bg-white`,
    `text-white dark:text-black`,
    `dark:text-black text-white`,
    `  dark:text-black text-white  `,
  ])(`conditional color fallback is order independent: %s`, (utility) => {
    const tw = create({}, `ios`, undefined);
    tw.setColorScheme(`light`);
    expect(tw.color(utility)).toBe(`#fff`);
    tw.setColorScheme(`dark`);
    expect(tw.color(utility)).toBe(`#000`);
    tw.setColorScheme(`light`);
    expect(tw.color(utility)).toBe(`#fff`);
  });

  test(`qualified utilities retain prefix-specific palettes`, () => {
    const tw = create(
      {
        theme: {
          extend: {
            colors: { brand: `#777` },
            textColor: { brand: `#123456` },
            backgroundColor: { brand: `#654321` },
            borderColor: { brand: `#abcdef` },
          },
        },
      },
      `ios`,
      undefined,
    );
    tw.setColorScheme(`dark`);
    expect(tw.color(`dark:text-brand`)).toBe(`#123456`);
    expect(tw.color(`dark:bg-brand`)).toBe(`#654321`);
    expect(tw.color(`dark:border-brand`)).toBe(`#abcdef`);
    expect(tw.color(`dark:border-t-brand`)).toBe(`#abcdef`);
  });

  test(`qualified opacity and legacy bare color syntax both work`, () => {
    const tw = create({}, `ios`, undefined);
    expect(tw.color(`white/25`)).toBe(`rgba(255, 255, 255, 0.25)`);
    expect(tw.color(`black opacity-50`)).toBe(`rgba(0, 0, 0, 0.5)`);
    expect(tw.color(`text-black opacity-50`)).toBe(`#000`);
    tw.setColorScheme(`dark`);
    expect(tw.color(`dark:text-red-500/50`)).toBe(`rgba(239, 68, 68, 0.5)`);
    expect(tw.color(`dark:bg-[#ff0000]/25`)).toBe(`rgba(255, 0, 0, 0.25)`);
    expect(tw.color(`dark:text-black opacity-50`)).toBe(`#000`);
  });

  test.each([`ios:md:text-red-500`, `md:ios:text-red-500`])(
    `every platform and screen prefix must match: %s`,
    (utility) => {
      const tw = create({}, `ios`, undefined);
      tw.setWindowDimensions({ width: 500, height: 400 });
      expect(tw.color(utility)).toBeUndefined();
      tw.setWindowDimensions({ width: 800, height: 600 });
      expect(tw.color(utility)).toBe(`#ef4444`);
      tw.setWindowDimensions({ width: 500, height: 400 });
      expect(tw.color(utility)).toBeUndefined();
    },
  );

  test.each([`dark:ios:text-red-500`, `ios:dark:text-red-500`])(
    `every color-scheme and platform prefix must match: %s`,
    (utility) => {
      const tw = create({}, `ios`, undefined);
      tw.setColorScheme(`light`);
      expect(tw.color(utility)).toBeUndefined();
      tw.setColorScheme(`dark`);
      expect(tw.color(utility)).toBe(`#ef4444`);
    },
  );

  test.each([
    `dark:ios`,
    `md:ios`,
    `portrait:ios`,
    `retina:ios`,
    `android:ios`,
    `unknown:ios`,
  ])(`a matching platform cannot undo an earlier rejection: %s`, (prefix) => {
    const tw = create({}, `ios`, undefined);
    tw.setColorScheme(`light`);
    tw.setWindowDimensions({ width: 500, height: 400 });
    tw.setPixelDensity(1);
    expect(tw.style(`${prefix}:text-red-500`)).toEqual({});
    expect(tw.prefixMatch(...prefix.split(`:`))).toBe(false);
  });

  test(`matching combined prefixes still apply`, () => {
    const tw = create({}, `ios`, undefined);
    tw.setColorScheme(`dark`);
    tw.setWindowDimensions({ width: 1000, height: 600 });
    tw.setPixelDensity(2);
    const prefixes = [`md`, `dark`, `ios`, `landscape`, `retina`];
    expect(tw.style(`${prefixes.join(`:`)}:bg-red-500`)).toEqual({
      backgroundColor: `#ef4444`,
    });
    expect(tw.prefixMatch(...prefixes)).toBe(true);
  });
});
