import { describe, test, expect } from '@jest/globals';
import { create } from '../';
import { color } from '../resolve/color';

describe(`colors`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  test(`background color without opacity`, () => {
    expect(tw`bg-black`).toEqual({ backgroundColor: `#000` });
    expect(tw`bg-white`).toEqual({ backgroundColor: `#fff` });
    expect(tw`bg-blue-400`).toEqual({ backgroundColor: `#60a5fa` });
  });

  test(`color with opacity`, () => {
    expect(tw`bg-black bg-opacity-50`).toEqual({
      backgroundColor: `rgba(0, 0, 0, 0.5)`,
    });
    expect(tw`text-black text-opacity-50`).toEqual({
      color: `rgba(0, 0, 0, 0.5)`,
    });
    expect(tw`text-black text-opacity-100`).toEqual({
      color: `rgba(0, 0, 0, 1)`,
    });
  });

  test(`color with opacity doesn't affect other utilities`, () => {
    expect(tw`bg-white bg-opacity-50`).toEqual({
      backgroundColor: `rgba(255, 255, 255, 0.5)`,
    });
    expect(tw`bg-white`).toEqual({ backgroundColor: `#fff` });
  });

  test(`color with opacity shorthand`, () => {
    expect(tw`bg-black/50`).toEqual({ backgroundColor: `rgba(0, 0, 0, 0.5)` });
    expect(tw`text-red-300/75`).toEqual({ color: `rgba(252, 165, 165, 0.75)` });
    // shorthand preferred
    expect(tw`bg-black/50 bg-opacity-75`).toEqual({
      backgroundColor: `rgba(0, 0, 0, 0.5)`,
    });
  });

  test(`bg colors with customized configs`, () => {
    // customize `theme.backgroundColors`
    tw = create({
      theme: { backgroundColor: { foo: `#ff0000`, bar: `#00f` } },
    });
    expect(tw`bg-foo`).toEqual({ backgroundColor: `#ff0000` });
    expect(tw`bg-bar`).toEqual({ backgroundColor: `#00f` });

    // should work the same if using `theme.colors` to customize
    tw = create({ theme: { colors: { foo: `#ff0000`, bar: `#00f` } } });
    expect(tw`bg-foo`).toEqual({ backgroundColor: `#ff0000` });
    expect(tw`bg-bar`).toEqual({ backgroundColor: `#00f` });
  });

  test(`text colors`, () => {
    expect(tw`text-black`).toEqual({ color: `#000` });
  });

  test(`tint colors`, () => {
    expect(tw`tint-black`).toEqual({ tintColor: `#000` });
    expect(tw`tint-[#eaeaea]`).toEqual({ tintColor: `#eaeaea` });
    expect(tw`tint-black/50`).toEqual({ tintColor: `rgba(0, 0, 0, 0.5)` });
    tw = create({ theme: { colors: { foo: `#ff0000`, bar: `#00f` } } });
    expect(tw`tint-foo`).toEqual({ tintColor: `#ff0000` });
    expect(tw`tint-bar`).toEqual({ tintColor: `#00f` });
  });

  test(`rgb/a configged colors`, () => {
    tw = create({
      theme: { colors: { foo: `rgb(1, 2, 3)`, bar: `rgba(4, 5, 6, 0.5)` } },
    });
    expect(tw`text-foo bg-bar`).toEqual({
      color: `rgb(1, 2, 3)`,
      backgroundColor: `rgba(4, 5, 6, 0.5)`,
    });

    expect(tw`text-foo text-opacity-75`).toEqual({
      color: `rgba(1, 2, 3, 0.75)`,
    });
  });

  test(`DEFAULT special modifier`, () => {
    tw = create({
      theme: { colors: { foo: { '100': `#ff0`, DEFAULT: `#EEF` } } },
    });
    expect(tw`text-foo-100 bg-foo`).toEqual({
      color: `#ff0`,
      backgroundColor: `#EEF`,
    });
  });

  test(`arbitrary color values`, () => {
    expect(tw`bg-[#012]`).toEqual({ backgroundColor: `#012` });
    expect(tw`bg-[rgba(3,4,5,0.1)]`).toEqual({
      backgroundColor: `rgba(3,4,5,0.1)`,
    });
    expect(tw`bg-[#012] bg-opacity-50`).toEqual({
      backgroundColor: `rgba(0, 17, 34, 0.5)`,
    });
  });

  test(`non-group dashed custom colors`, () => {
    tw = create({
      theme: { colors: { 'indigo-lighter': `#b3bcf5`, indigo: `#5c6ac4` } },
    });
    expect(tw`text-indigo bg-indigo-lighter`).toEqual({
      color: `#5c6ac4`,
      backgroundColor: `#b3bcf5`,
    });
  });

  test(`transparent`, () => {
    expect(tw`text-transparent`).toEqual({ color: `transparent` });
  });

  test(`non-color arbitrary value not returned`, () => {
    expect(color(`text`, `[50vh]`, {})).toBeNull();
  });

  test(`object syntax with deeply nested colors`, () => {
    tw = create({
      theme: {
        colors: {
          foo: {
            DEFAULT: `#ff0000`,
            bar: { DEFAULT: `#00f`, baz: `#EEF` },
          },
        },
      },
    });
    expect(tw`bg-foo text-foo-bar`).toEqual({
      backgroundColor: `#ff0000`,
      color: `#00f`,
    });
    expect(tw`bg-foo-bar-baz`).toEqual({ backgroundColor: `#EEF` });
    expect(tw`bg-foo-baz`).toEqual({});
  });

  test(`object syntax with color names containing dashes`, () => {
    tw = create({
      theme: {
        colors: {
          foo: {
            DEFAULT: `#ff0000`,
            bar: `#00f`,
            'bar-baz': `#EEF`,
          },
        },
      },
    });
    expect(tw`bg-foo text-foo-bar`).toEqual({
      backgroundColor: `#ff0000`,
      color: `#00f`,
    });
    expect(tw`bg-foo-bar-baz`).toEqual({ backgroundColor: `#EEF` });
    expect(tw`bg-foo-baz`).toEqual({});

    tw = create({
      theme: {
        colors: {
          'jim-jam': {
            DEFAULT: `#00ff00`,
            slam: `#eea`,
          },
        },
      },
    });
    expect(tw`text-jim`).toEqual({});
    expect(tw`text-jim-jam`).toEqual({ color: `#00ff00` });
    expect(tw`text-jim-jam-slam`).toEqual({ color: `#eea` });
    expect(tw`text-jim-jam-slam-nope`).toEqual({});
  });
});
