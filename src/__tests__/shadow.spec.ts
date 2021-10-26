import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`shadow utilities`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  const cases: Array<[string, Record<string, string | number | Record<string, number>>]> =
    [
      [`shadow-white`, { shadowColor: `#fff` }],
      [`shadow-black`, { shadowColor: `#000` }],
      [`shadow-[#eaeaea]`, { shadowColor: `#eaeaea` }],
      [`shadow-black shadow-color-opacity-50`, { shadowColor: `rgba(0, 0, 0, 0.5)` }],
      [`shadow-opacity-50`, { shadowOpacity: 0.5 }],
      [`shadow-offset-1`, { shadowOffset: { width: 4, height: 4 } }],
      [`shadow-offset-[333px]`, { shadowOffset: { width: 333, height: 333 } }],
      [`shadow-offset-[23px]/[33px]`, { shadowOffset: { width: 23, height: 33 } }],
      [`shadow-offset-2/3`, { shadowOffset: { width: 8, height: 12 } }],
      [`shadow-radius-1`, { shadowRadius: 4 }],
      [`shadow-radius-[13px]`, { shadowRadius: 13 }],
    ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toEqual(expected);
  });
});
