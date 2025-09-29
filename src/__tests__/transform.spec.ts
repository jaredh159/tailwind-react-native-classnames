import { Platform } from 'react-native';
import { create } from '../';

describe(`transform utilities`, () => {
  let tw = create();

  beforeEach(() => {
    tw = create();
  });

  describe(`scale`, () => {
    const cases: Array<[string, Record<'transform', Record<string, number>[]>]> = [
      [`scale-0`, { transform: [{ scale: 0 }] }],
      [`scale-x-0`, { transform: [{ scaleX: 0 }] }],
      [`scale-y-0`, { transform: [{ scaleY: 0 }] }],
      [`scale-50`, { transform: [{ scale: 0.5 }] }],
      [`scale-x-50`, { transform: [{ scaleX: 0.5 }] }],
      [`scale-y-50`, { transform: [{ scaleY: 0.5 }] }],
      [`-scale-50`, { transform: [{ scale: -0.5 }] }],
      [`-scale-x-50`, { transform: [{ scaleX: -0.5 }] }],
      [`-scale-y-50`, { transform: [{ scaleY: -0.5 }] }],

      // arbitrary
      [`scale-[1.7]`, { transform: [{ scale: 1.7 }] }],
      [`scale-x-[1.7]`, { transform: [{ scaleX: 1.7 }] }],
      [`scale-y-[1.7]`, { transform: [{ scaleY: 1.7 }] }],

      // not configged
      [`scale-99`, { transform: [{ scale: 0.99 }] }],
      [`scale-x-99`, { transform: [{ scaleX: 0.99 }] }],
      [`scale-y-99`, { transform: [{ scaleY: 0.99 }] }],
    ];

    test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
      expect(tw.style(utility)).toMatchObject(expected);
    });

    test(`scale w/extended theme`, () => {
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
      expect(tw.style(`scale-x-custom`)).toMatchObject({ transform: [{ scaleX: 1.99 }] });
      expect(tw.style(`scale-y-custom`)).toMatchObject({ transform: [{ scaleY: 1.99 }] });
    });

    test(`combine repeated scale utilities into one`, () => {
      expect(tw.style(`scale-50 scale-100`)).toMatchObject({ transform: [{ scale: 1 }] });
      expect(tw.style(`scale-x-50 scale-x-100`)).toMatchObject({
        transform: [{ scaleX: 1 }],
      });
      expect(tw.style(`scale-y-50 scale-y-100`)).toMatchObject({
        transform: [{ scaleY: 1 }],
      });
    });
  });

  describe(`rotate`, () => {
    const cases: Array<[string, Record<'transform', Record<string, string>[]>]> = [
      [`rotate-0`, { transform: [{ rotate: `0deg` }] }],
      [`rotate-x-0`, { transform: [{ rotateX: `0deg` }] }],
      [`rotate-y-0`, { transform: [{ rotateY: `0deg` }] }],
      [`rotate-z-0`, { transform: [{ rotateZ: `0deg` }] }],
      [`rotate-90`, { transform: [{ rotate: `90deg` }] }],
      [`rotate-x-90`, { transform: [{ rotateX: `90deg` }] }],
      [`rotate-y-90`, { transform: [{ rotateY: `90deg` }] }],
      [`rotate-z-90`, { transform: [{ rotateZ: `90deg` }] }],
      [`-rotate-90`, { transform: [{ rotate: `-90deg` }] }],
      [`-rotate-x-90`, { transform: [{ rotateX: `-90deg` }] }],
      [`-rotate-y-90`, { transform: [{ rotateY: `-90deg` }] }],
      [`-rotate-z-90`, { transform: [{ rotateZ: `-90deg` }] }],

      // arbitrary
      [`rotate-[90deg]`, { transform: [{ rotate: `90deg` }] }],
      [`rotate-x-[90deg]`, { transform: [{ rotateX: `90deg` }] }],
      [`rotate-y-[90deg]`, { transform: [{ rotateY: `90deg` }] }],
      [`rotate-z-[90deg]`, { transform: [{ rotateZ: `90deg` }] }],
      [`rotate-[3.142rad]`, { transform: [{ rotate: `3.142rad` }] }],
      [`rotate-x-[3.142rad]`, { transform: [{ rotateX: `3.142rad` }] }],
      [`rotate-y-[3.142rad]`, { transform: [{ rotateY: `3.142rad` }] }],
      [`rotate-z-[3.142rad]`, { transform: [{ rotateZ: `3.142rad` }] }],

      // not configged
      [`rotate-99`, { transform: [{ rotate: `99deg` }] }],
      [`rotate-x-99`, { transform: [{ rotateX: `99deg` }] }],
      [`rotate-y-99`, { transform: [{ rotateY: `99deg` }] }],
      [`rotate-z-99`, { transform: [{ rotateZ: `99deg` }] }],
    ];

    test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
      expect(tw.style(utility)).toMatchObject(expected);
    });

    test(`rotate w/extended theme`, () => {
      tw = create({
        theme: {
          extend: {
            rotate: {
              custom: `1.99rad`,
            },
          },
        },
      });

      expect(tw.style(`rotate-custom`)).toMatchObject({
        transform: [{ rotate: `1.99rad` }],
      });
      expect(tw.style(`rotate-x-custom`)).toMatchObject({
        transform: [{ rotateX: `1.99rad` }],
      });
      expect(tw.style(`rotate-y-custom`)).toMatchObject({
        transform: [{ rotateY: `1.99rad` }],
      });
      expect(tw.style(`rotate-z-custom`)).toMatchObject({
        transform: [{ rotateZ: `1.99rad` }],
      });
    });

    test(`combine repeated rotate utilities into one`, () => {
      expect(tw.style(`rotate-50 rotate-100`)).toMatchObject({
        transform: [{ rotate: `100deg` }],
      });
      expect(tw.style(`rotate-x-50 rotate-x-100`)).toMatchObject({
        transform: [{ rotateX: `100deg` }],
      });
      expect(tw.style(`rotate-y-50 rotate-y-100`)).toMatchObject({
        transform: [{ rotateY: `100deg` }],
      });
    });
  });

  describe(`skew`, () => {
    const cases: Array<[string, Record<'transform', Record<string, string>[]>]> = [
      [`skew-x-0`, { transform: [{ skewX: `0deg` }] }],
      [`skew-y-0`, { transform: [{ skewY: `0deg` }] }],
      [`skew-x-12`, { transform: [{ skewX: `12deg` }] }],
      [`skew-y-12`, { transform: [{ skewY: `12deg` }] }],

      // arbitrary
      [`skew-x-[90deg]`, { transform: [{ skewX: `90deg` }] }],
      [`skew-y-[90deg]`, { transform: [{ skewY: `90deg` }] }],
      [`skew-x-[3.142rad]`, { transform: [{ skewX: `3.142rad` }] }],
      [`skew-y-[3.142rad]`, { transform: [{ skewY: `3.142rad` }] }],

      // not configged
      [`skew-x-99`, { transform: [{ skewX: `99deg` }] }],
      [`skew-y-99`, { transform: [{ skewY: `99deg` }] }],
    ];

    test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
      expect(tw.style(utility)).toMatchObject(expected);
    });

    test(`skew w/extended theme`, () => {
      tw = create({
        theme: {
          extend: {
            skew: {
              custom: `1.99rad`,
            },
          },
        },
      });

      expect(tw.style(`skew-x-custom`)).toMatchObject({
        transform: [{ skewX: `1.99rad` }],
      });
      expect(tw.style(`skew-y-custom`)).toMatchObject({
        transform: [{ skewY: `1.99rad` }],
      });
    });

    test(`combine repeated skew utilities into one`, () => {
      expect(tw.style(`skew-x-50 skew-x-100`)).toMatchObject({
        transform: [{ skewX: `100deg` }],
      });
      expect(tw.style(`skew-y-50 skew-y-100`)).toMatchObject({
        transform: [{ skewY: `100deg` }],
      });
    });
  });

  describe(`translate`, () => {
    const cases: Array<[string, Record<'transform', Record<string, number>[]> | object]> =
      [
        [`translate-x-0`, { transform: [{ translateX: 0 }] }],
        [`translate-y-0`, { transform: [{ translateY: 0 }] }],
        [`translate-x-px`, { transform: [{ translateX: 1 }] }],
        [`translate-y-px`, { transform: [{ translateY: 1 }] }],
        [`translate-x-0.5`, { transform: [{ translateX: 2 }] }],
        [`translate-y-0.5`, { transform: [{ translateY: 2 }] }],
        [`-translate-x-px`, { transform: [{ translateX: -1 }] }],
        [`-translate-y-px`, { transform: [{ translateY: -1 }] }],
        [`-translate-x-0.5`, { transform: [{ translateX: -2 }] }],
        [`-translate-y-0.5`, { transform: [{ translateY: -2 }] }],

        // arbitrary
        [`translate-x-[17rem]`, { transform: [{ translateX: 272 }] }],
        [`translate-y-[17rem]`, { transform: [{ translateY: 272 }] }],

        // not configged
        [`translate-x-81`, { transform: [{ translateX: (81 / 4) * 16 }] }],
        [`translate-y-81`, { transform: [{ translateY: (81 / 4) * 16 }] }],
      ];

    test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
      expect(tw.style(utility)).toMatchObject(expected);
    });

    test(`translate w/extended theme`, () => {
      tw = create({
        theme: {
          extend: {
            translate: {
              '4.25': `17rem`,
            },
          },
        },
      });

      expect(tw.style(`translate-x-4.25`)).toMatchObject({
        transform: [{ translateX: 272 }],
      });
      expect(tw.style(`translate-y-4.25`)).toMatchObject({
        transform: [{ translateY: 272 }],
      });
    });

    test(`combine repeated translate utilities into one`, () => {
      expect(tw.style(`translate-x-2 translate-x-4`)).toMatchObject({
        transform: [{ translateX: 16 }],
      });
      expect(tw.style(`translate-y-2 translate-y-4`)).toMatchObject({
        transform: [{ translateY: 16 }],
      });
    });

    test(`translate w/percentage values`, () => {
      Platform.OS = `web`;
      jest.spyOn(Platform, `constants`, `get`).mockReturnValue(undefined as any);
      tw = create();

      expect(tw.style(`translate-x-full`)).toMatchObject({
        transform: [{ translateX: `100%` }],
      });
      expect(tw.style(`translate-y-full`)).toMatchObject({
        transform: [{ translateY: `100%` }],
      });
      expect(tw.style(`translate-x-1/2`)).toMatchObject({
        transform: [{ translateX: `50%` }],
      });
      expect(tw.style(`translate-y-1/2`)).toMatchObject({
        transform: [{ translateY: `50%` }],
      });
      expect(tw.style(`translate-x-[10%]`)).toMatchObject({
        transform: [{ translateX: `10%` }],
      });
      expect(tw.style(`translate-y-[10%]`)).toMatchObject({
        transform: [{ translateY: `10%` }],
      });
      expect(tw.style(`translate-x-1/5`)).toMatchObject({
        transform: [{ translateX: `20%` }],
      });
      expect(tw.style(`translate-y-1/5`)).toMatchObject({
        transform: [{ translateY: `20%` }],
      });

      Platform.OS = `ios`;
      jest.spyOn(Platform, `constants`, `get`).mockReturnValue({
        ...Platform.constants,
        reactNativeVersion: {
          major: 0,
          minor: 75,
          patch: 0,
        },
      });
      tw = create();

      expect(tw.style(`translate-x-full`)).toMatchObject({
        transform: [{ translateX: `100%` }],
      });
      expect(tw.style(`translate-y-full`)).toMatchObject({
        transform: [{ translateY: `100%` }],
      });
      expect(tw.style(`translate-x-1/2`)).toMatchObject({
        transform: [{ translateX: `50%` }],
      });
      expect(tw.style(`translate-y-1/2`)).toMatchObject({
        transform: [{ translateY: `50%` }],
      });
      expect(tw.style(`translate-x-[10%]`)).toMatchObject({
        transform: [{ translateX: `10%` }],
      });
      expect(tw.style(`translate-y-[10%]`)).toMatchObject({
        transform: [{ translateY: `10%` }],
      });
      expect(tw.style(`translate-x-1/5`)).toMatchObject({
        transform: [{ translateX: `20%` }],
      });
      expect(tw.style(`translate-y-1/5`)).toMatchObject({
        transform: [{ translateY: `20%` }],
      });

      jest.spyOn(Platform, `constants`, `get`).mockReturnValue({
        ...Platform.constants,
        reactNativeVersion: {
          major: 0,
          minor: 74,
          patch: 0,
        },
      });
      tw = create();

      expect(tw.style(`translate-x-full`)).toMatchObject({});
      expect(tw.style(`translate-y-full`)).toMatchObject({});
      expect(tw.style(`translate-x-1/2`)).toMatchObject({});
      expect(tw.style(`translate-y-1/2`)).toMatchObject({});
      expect(tw.style(`translate-x-[10%]`)).toMatchObject({});
      expect(tw.style(`translate-y-[10%]`)).toMatchObject({});
      expect(tw.style(`translate-x-1/5`)).toMatchObject({});
      expect(tw.style(`translate-y-1/5`)).toMatchObject({});
    });
  });

  test(`combine multiple transform utilities `, () => {
    expect(
      tw.style(
        `scale-50 scale-x-100 scale-y-150 rotate-0 rotate-x-90 rotate-y-45 skew-x-99 skew-y-99 translate-x-px translate-y-px`,
      ),
    ).toMatchObject({
      transform: [
        { scale: 0.5 },
        { scaleX: 1 },
        { scaleY: 1.5 },
        { rotate: `0deg` },
        { rotateX: `90deg` },
        { rotateY: `45deg` },
        { skewX: `99deg` },
        { skewY: `99deg` },
        { translateX: 1 },
        { translateY: 1 },
      ],
    });
  });

  test(`transform-none`, () => {
    expect(
      tw.style(
        `scale-50 scale-x-100 scale-y-150 rotate-0 rotate-x-90 rotate-y-45 skew-x-99 skew-y-99 translate-x-px translate-y-px transform-none`,
      ),
    ).toMatchObject({ transform: [] });
  });

  describe(`origin`, () => {
    const cases: Array<
      [string, Record<'transformOrigin', string> | Record<string, never>]
    > = [
      [`origin-center`, { transformOrigin: `center` }],
      [`origin-top`, { transformOrigin: `top` }],
      [`origin-top-right`, { transformOrigin: `top right` }],
      [`origin-right`, { transformOrigin: `right` }],
      [`origin-bottom-right`, { transformOrigin: `bottom right` }],
      [`origin-bottom`, { transformOrigin: `bottom` }],
      [`origin-bottom-left`, { transformOrigin: `bottom left` }],
      [`origin-left`, { transformOrigin: `left` }],
      [`origin-top-left`, { transformOrigin: `top left` }],

      // arbitrary
      [`origin-[top]`, { transformOrigin: `top` }],
      [`origin-[10%]`, { transformOrigin: `10%` }],
      [`origin-[10px]`, { transformOrigin: `10px` }],
      [`origin-[left_top]`, { transformOrigin: `left top` }],
      [`origin-[bottom_right]`, { transformOrigin: `bottom right` }],
      [`origin-[center_center]`, { transformOrigin: `center center` }],
      [`origin-[center_10%]`, { transformOrigin: `center 10%` }],
      [`origin-[10px_center]`, { transformOrigin: `10px center` }],
      [`origin-[10px_10%]`, { transformOrigin: `10px 10%` }],
      [`origin-[-10%_20%_10px]`, { transformOrigin: `-10% 20% 10px` }],
      [`origin-[-10px_-10px_-10px]`, { transformOrigin: `-10px -10px -10px` }],
      [`origin-[left_top_10px]`, { transformOrigin: `left top 10px` }],

      // invalid
      [`origin-[left_left]`, {}],
      [`origin-[top_top]`, {}],
      [`origin-[top_left_10%]`, {}],
    ];

    test.each(cases)(`tw\`%s\` -> %s`, (utility, expected) => {
      expect(tw.style(utility)).toMatchObject(expected);
    });

    test(`origin w/extended theme`, () => {
      tw = create({
        theme: {
          extend: {
            transformOrigin: {
              custom: `33% 75% 10px`,
            },
          },
        },
      });

      expect(tw.style(`origin-custom`)).toMatchObject({
        transformOrigin: `33% 75% 10px`,
      });
    });
  });
});
