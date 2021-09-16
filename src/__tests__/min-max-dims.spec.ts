import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`min/max width/height`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  const cases: Array<[string, Record<string, string | number>]> = [
    [`min-w-0`, { minWidth: 0 }],
    [`min-w-full`, { minWidth: `100%` }],
    [`min-h-0`, { minHeight: 0 }],
    [`min-h-full`, { minHeight: `100%` }],

    // arbitrary min height/width
    [`min-w-1/4`, { minWidth: `25%` }],
    [`min-w-1`, { minWidth: 4 }],
    [`min-h-1/4`, { minHeight: `25%` }],
    [`min-h-1`, { minHeight: 4 }],

    [`max-w-px`, { maxWidth: 1 }],
    [`max-w-0`, { maxWidth: 0 }],
    [`max-w-screen-sm`, { maxWidth: 640 }],
    [`max-w-none`, { maxWidth: `99999%` }], // special case not supported in RN
    [`max-w-xs`, { maxWidth: 320 }],
    [`max-h-px`, { maxHeight: 1 }],
    [`max-h-0`, { maxHeight: 0 }],
    [`max-h-0.5`, { maxHeight: 2 }],
    [`max-w-full`, { maxWidth: `100%` }],
    [`max-h-full`, { maxHeight: `100%` }],

    // @TODO when vw/vh support added
    // [`min-h-screen`, { minHeight: 1234 }],
    // [`min-w-screen`, { minHeight: 1234 }],
  ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toMatchObject(expected);
  });
});
