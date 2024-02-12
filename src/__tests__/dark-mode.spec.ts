import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`dark mode`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  test(`dark mode`, () => {
    expect(tw`mt-1 dark:mt-2`).toEqual({ marginTop: 4 });
    tw.setColorScheme(`dark`);
    expect(tw`mt-1 dark:mt-2`).toEqual({ marginTop: 8 });
    tw.setColorScheme(`light`);
    expect(tw`mt-1 dark:mt-2`).toEqual({ marginTop: 4 });
    tw.setColorScheme(undefined);
    expect(tw`mt-1 dark:mt-2`).toEqual({ marginTop: 4 });
    tw.setColorScheme(`dark`);
    // out of order
    expect(tw`dark:mt-2 mt-1`).toEqual({ marginTop: 8 });
  });

  test(`mixing color opacity with dark mode`, () => {
    expect(tw`bg-gray-100 dark:bg-gray-800 bg-opacity-50`).toEqual({
      backgroundColor: `rgba(243, 244, 246, 0.5)`,
    });

    tw.setColorScheme(`dark`);

    expect(tw`bg-gray-100 dark:bg-gray-800 bg-opacity-50`).toEqual({
      backgroundColor: `rgba(31, 41, 55, 0.5)`,
    });
  });

  test(`dark mode opacity shorthands`, () => {
    expect(tw`bg-gray-100/50 dark:bg-gray-800/50`).toEqual({
      backgroundColor: `rgba(243, 244, 246, 0.5)`,
    });

    expect(tw`bg-white dark:bg-white/50`).toEqual({
      backgroundColor: `#fff`,
    });

    tw.setColorScheme(`dark`);

    expect(tw`bg-gray-100/50 dark:bg-gray-800/50`).toEqual({
      backgroundColor: `rgba(31, 41, 55, 0.5)`,
    });

    expect(tw`bg-white dark:bg-white/50`).toEqual({
      backgroundColor: `rgba(255, 255, 255, 0.5)`,
    });
  });
});
