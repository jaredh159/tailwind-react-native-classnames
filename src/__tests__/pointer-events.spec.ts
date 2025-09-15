import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`pointer-events utilities`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  const cases: Array<[string, Record<string, string>]> = [
    [`pointer-events-none`, { pointerEvents: `none` }],
    [`pointer-events-auto`, { pointerEvents: `auto` }],
    [`pointer-events-box-only`, { pointerEvents: `box-only` }],
    [`pointer-events-box-none`, { pointerEvents: `box-none` }],
  ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toEqual(expected);
  });
});
