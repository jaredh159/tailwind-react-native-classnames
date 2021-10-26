import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`margin`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

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
    [`mt-auto`, { marginTop: `auto` }],
    [`mb-auto`, { marginBottom: `auto` }],
    [`ml-auto`, { marginLeft: `auto` }],
    [`mr-auto`, { marginRight: `auto` }],
    [`mx-auto`, { marginRight: `auto`, marginLeft: `auto` }],
    [`my-auto`, { marginTop: `auto`, marginBottom: `auto` }],
    [`mt-px`, { marginTop: 1 }],
    [`ml-[333px]`, { marginLeft: 333 }],
    [`-ml-1`, { marginLeft: -4 }],
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
