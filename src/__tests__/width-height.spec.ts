import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`width/height utilities`, () => {
  let tw = create();
  beforeEach(() => {
    tw = create({ theme: { screens: {} } });
    tw.setWindowDimensions({ width: 800, height: 600 });
  });

  const cases: Array<[string, Record<string, string | number>]> = [
    [`w-0`, { width: 0 }],
    [`h-0`, { height: 0 }],
    [`w-px`, { width: 1 }],
    [`h-px`, { height: 1 }],
    [`w-0.25`, { width: 1 }],
    [`w-0.5`, { width: 2 }],
    [`h-0.5`, { height: 2 }],
    [`w-1`, { width: 4 }],
    [`h-1`, { height: 4 }],
    [`-w-1`, { width: -4 }],
    [`-h-1`, { height: -4 }],
    [`w-1/2`, { width: `50%` }],
    [`h-1/2`, { height: `50%` }],
    [`w-3/4`, { width: `75%` }],
    [`h-3/4`, { height: `75%` }],
    [`w-full`, { width: `100%` }],
    [`h-full`, { height: `100%` }],
    [`w-auto`, { width: `auto` }],
    [`h-auto`, { height: `auto` }],

    // vw/vh
    [`h-screen`, { height: 600 }],
    [`h-[25vh]`, { height: 150 }],
    [`w-screen`, { width: 800 }],
    [`w-[50vw]`, { width: 400 }],

    // arbitrary
    [`h-[333px]`, { height: 333 }],

    // not configged, use 0.25rem = 1 as formula
    [`h-81`, { height: (81 / 4) * 16 }],

    // arbitrary fraction, not configged
    [`h-17/19`, { height: `${(17 / 19) * 100}%` }],
  ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toEqual(expected);
  });
});
