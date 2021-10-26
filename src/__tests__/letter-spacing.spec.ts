import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`letter-spacing (tracking-X)`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  it(`handles relative letter-spacing`, () => {
    expect(tw`text-xs tracking-tighter`).toMatchObject({ letterSpacing: -0.6 });
    expect(tw`text-base tracking-tighter`).toMatchObject({ letterSpacing: -0.8 });
    expect(tw`text-base tracking-tight`).toMatchObject({ letterSpacing: -0.4 });
    expect(tw`text-base tracking-normal`).toMatchObject({ letterSpacing: 0 });
    expect(tw`text-base tracking-wide`).toMatchObject({ letterSpacing: 0.4 });
    expect(tw`text-base tracking-wider`).toMatchObject({ letterSpacing: 0.8 });
    expect(tw`text-base tracking-widest`).toMatchObject({ letterSpacing: 1.6 });
  });

  test(`non-em configged letter-spacing`, () => {
    tw = create({ theme: { letterSpacing: { custom1: `0.125rem`, custom2: `3px` } } });
    expect(tw`tracking-custom1`).toMatchObject({ letterSpacing: 2 });
    expect(tw`tracking-custom2`).toMatchObject({ letterSpacing: 3 });
  });

  test(`letter-spacing with no font-size has no effect`, () => {
    expect(tw`tracking-wide`).toEqual({});
  });

  test(`letter-spacing not dependent on className order`, () => {
    expect(tw`tracking-wide text-base`).toMatchObject({ letterSpacing: 0.4 });
  });

  const arbitrary: Array<[string, Record<string, string | number>]> = [
    [`tracking-[3px]`, { letterSpacing: 3 }],
    [`tracking-[-3px]`, { letterSpacing: -3 }],
    [`-tracking-[3px]`, { letterSpacing: -3 }],
  ];

  test.each(arbitrary)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toEqual(expected);
  });
});
