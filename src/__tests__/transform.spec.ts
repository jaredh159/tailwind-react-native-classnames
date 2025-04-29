import { create } from '../';

describe(`transform utilities`, () => {
  let tw = create();

  beforeEach(() => {
    tw = create();
  });

  const cases: Array<[string, Record<'transform', Record<string, number>[]>]> = [
    [`scale-0`, { transform: [{ scale: 0 }] }],
    [`scale-x-0`, { transform: [{ scaleX: 0 }] }],
    [`scale-y-0`, { transform: [{ scaleY: 0 }] }],
    [`scale-50`, { transform: [{ scale: 0.5 }] }],
    [`scale-x-50`, { transform: [{ scaleX: 0.5 }] }],
    [`scale-y-50`, { transform: [{ scaleY: 0.5 }] }],
    [`scale-100`, { transform: [{ scale: 1 }] }],
    [`scale-x-100`, { transform: [{ scaleX: 1 }] }],
    [`scale-y-100`, { transform: [{ scaleY: 1 }] }],
    [`scale-150`, { transform: [{ scale: 1.5 }] }],
    [`scale-x-150`, { transform: [{ scaleX: 1.5 }] }],
    [`scale-y-150`, { transform: [{ scaleY: 1.5 }] }],
    [`-scale-50`, { transform: [{ scale: -0.5 }] }],
    [`-scale-x-50`, { transform: [{ scaleX: -0.5 }] }],
    [`-scale-y-50`, { transform: [{ scaleY: -0.5 }] }],
    [`scale-[1.7]`, { transform: [{ scale: 1.7 }] }],
    [`scale-x-[1.7]`, { transform: [{ scaleX: 1.7 }] }],
    [`scale-y-[1.7]`, { transform: [{ scaleY: 1.7 }] }],
  ];

  test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
    expect(tw.style(utility)).toMatchObject(expected);
  });

  test(`transform w/extended theme`, () => {
    tw = create({
      theme: {
        extend: {
          scale: {
            custom: `1.99`,
          },
        },
      },
    });

    expect(tw.style(`scale-custom`)).toMatchObject({ transform: [{ scale: 1.99 }] });
  });
});
