import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`min/max width/height`, () => {
  let tw = create();
  beforeEach(() => {
    tw = create();
    tw.setWindowDimensions({ width: 800, height: 600 });
  });

  const cases: Array<[string, Record<string, string | number>]> = [
    [`min-w-0`, { minWidth: 0 }],
    [`min-w-full`, { minWidth: `100%` }],
    [`min-h-0`, { minHeight: 0 }],
    [`min-h-full`, { minHeight: `100%` }],

    // arbitrary min height/width
    [`min-w-1/4`, { minWidth: `25%` }],
    [`min-w-1/2`, { minWidth: `50%` }],
    [`min-w-1`, { minWidth: 4 }],
    [`min-h-1/4`, { minHeight: `25%` }],
    [`min-h-1`, { minHeight: 4 }],
    [`min-w-[50%]`, { minWidth: `50%` }],
    [`min-w-[160px]`, { minWidth: 160 }],

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

    // vw/vh things, with device.windowDimensions
    [`min-h-screen`, { minHeight: 600 }],
    [`min-w-screen`, { minWidth: 800 }],
    [`min-h-[50vh]`, { minHeight: 300 }],
    [`min-w-[25vw]`, { minWidth: 200 }],
  ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toEqual(expected);
  });
});
