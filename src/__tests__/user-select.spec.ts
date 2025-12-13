import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`user-select utilities`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  const cases: Array<[string, Record<string, string>]> = [
    [`select-none`, { userSelect: `none` }],
    [`select-auto`, { userSelect: `auto` }],
    [`select-text`, { userSelect: `text` }],
    [`select-all`, { userSelect: `all` }],
    [`select-contain`, { userSelect: `contain` }],
  ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toEqual(expected);
  });
});
