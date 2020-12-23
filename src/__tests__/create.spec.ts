import { describe, test } from '@jest/globals';
import { preProcessTwStyle } from '../create';

describe(`preProcessTwStyle()`, () => {
  describe(`box-shadow transformations`, () => {
    test(`transforms single shadow css var, removing spread`, () => {
      expect(
        preProcessTwStyle(`--tw-shadow`, `0 1px 2px 0 rgba(0, 0, 0, 0.05)`),
      ).toEqual([`--tw-shadow`, `0 1px 2px rgba(0, 0, 0, 0.05)`]);
    });

    test(`transforms single shadow css var, removing negative spread`, () => {
      expect(
        preProcessTwStyle(`--tw-shadow`, `0 1px 2px -3px rgba(0, 0, 0, 0.05)`),
      ).toEqual([`--tw-shadow`, `0 1px 2px rgba(0, 0, 0, 0.05)`]);
    });

    test(`transforms double shadow css var, removing spread`, () => {
      expect(
        preProcessTwStyle(
          `--tw-shadow`,
          `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`,
        ),
      ).toEqual([`--tw-shadow`, `0 1px 3px rgba(0, 0, 0, 0.1)`]);
    });

    test(`transforms box-shadow css value`, () => {
      expect(preProcessTwStyle(`box-shadow`, `<anything>`)).toEqual([
        `box-shadow`,
        `var(--tw-shadow)`,
      ]);
    });
  });
});
