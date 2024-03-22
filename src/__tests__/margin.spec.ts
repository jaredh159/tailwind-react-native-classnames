import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`margin`, () => {
  let tw = create();
  beforeEach(() => {
    tw = create();
    tw.setWindowDimensions({ width: 800, height: 600 });
  });

  const cases: Array<[string, Record<string, string | number>]> = [
    [
      `m-auto`,
      {
        marginTop: `auto`,
        marginBottom: `auto`,
        marginLeft: `auto`,
        marginRight: `auto`,
      },
    ],
    [`mt-1`, { marginTop: 4 }],
    [`mt-0.5`, { marginTop: 2 }],
    [`mt-0.25`, { marginTop: 1 }],
    [`mt-1.25`, { marginTop: 5 }],
    [`ml-0.5`, { marginLeft: 2 }],
    [`ml-0.25`, { marginLeft: 1 }],
    [`ml-1.25`, { marginLeft: 5 }],
    [`mt-auto`, { marginTop: `auto` }],
    [`mb-auto`, { marginBottom: `auto` }],
    [`ml-auto`, { marginLeft: `auto` }],
    [`mr-auto`, { marginRight: `auto` }],
    [`mx-auto`, { marginRight: `auto`, marginLeft: `auto` }],
    [`my-auto`, { marginTop: `auto`, marginBottom: `auto` }],
    [`mt-px`, { marginTop: 1 }],
    [`ml-[333px]`, { marginLeft: 333 }],
    [`-ml-1`, { marginLeft: -4 }],
    [`mb-[100vh]`, { marginBottom: 600 }],
    [`ml-[100vw]`, { marginLeft: 800 }],
    [`mr-[1vw]`, { marginRight: 8 }],
  ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toEqual(expected);
  });

  test(`margin w/extended theme`, () => {
    tw = create({
      theme: {
        extend: {
          spacing: {
            custom: `1000rem`,
          },
        },
      },
    });

    expect(tw`m-custom`).toEqual({
      marginTop: 16000,
      marginBottom: 16000,
      marginLeft: 16000,
      marginRight: 16000,
    });

    expect(tw`m-1`).toEqual({
      marginTop: 4,
      marginBottom: 4,
      marginLeft: 4,
      marginRight: 4,
    });

    expect(tw`m-0.5`).toEqual({
      marginTop: 2,
      marginBottom: 2,
      marginLeft: 2,
      marginRight: 2,
    });
  });
});
