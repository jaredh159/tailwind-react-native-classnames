import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`vertical align`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  const cases: Array<[string, Record<string, string>]> =
    [
      [`align-auto`, { verticalAlign: `auto` }],
      [`align-top`, { verticalAlign: `top` }],
      [`align-bottom`,{ verticalAlign: `bottom` }],
      [`align-middle`, { verticalAlign: `middle` }],
    ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toEqual(expected);
  });
});
