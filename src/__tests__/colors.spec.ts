import { describe, test, expect } from '@jest/globals';
import { create } from '../';

describe(`colors`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  test(`background color without opacity`, () => {
    expect(tw`bg-black`).toMatchObject({ backgroundColor: `#000` });
    expect(tw`bg-white`).toMatchObject({ backgroundColor: `#fff` });
    expect(tw`bg-blue-400`).toMatchObject({ backgroundColor: `#60a5fa` });
  });

  test(`color with opacity`, () => {
    expect(tw`bg-black bg-opacity-50`).toMatchObject({
      backgroundColor: `rgba(0, 0, 0, 0.5)`,
    });
    expect(tw`text-black text-opacity-50`).toMatchObject({ color: `rgba(0, 0, 0, 0.5)` });
    expect(tw`text-black text-opacity-100`).toMatchObject({ color: `rgba(0, 0, 0, 1)` });
  });

  test(`color with opacity shorthand`, () => {
    expect(tw`bg-black/50`).toMatchObject({ backgroundColor: `rgba(0, 0, 0, 0.5)` });
    expect(tw`text-red-300/75`).toMatchObject({ color: `rgba(252, 165, 165, 0.75)` });
  });

  test(`bg colors with customized configs`, () => {
    // customize `theme.backgroundColors`
    tw = create({ theme: { backgroundColor: { foo: `#ff0000`, bar: `#00f` } } });
    expect(tw`bg-foo`).toMatchObject({ backgroundColor: `#ff0000` });
    expect(tw`bg-bar`).toMatchObject({ backgroundColor: `#00f` });

    // should work the same if using `theme.colors` to customize
    tw = create({ theme: { colors: { foo: `#ff0000`, bar: `#00f` } } });
    expect(tw`bg-foo`).toMatchObject({ backgroundColor: `#ff0000` });
    expect(tw`bg-bar`).toMatchObject({ backgroundColor: `#00f` });
  });

  test(`text colors`, () => {
    expect(tw`text-black`).toMatchObject({ color: `#000` });
  });

  test(`rgb/a configged colors`, () => {
    tw = create({
      theme: { colors: { foo: `rgb(1, 2, 3)`, bar: `rgba(4, 5, 6, 0.5)` } },
    });
    expect(tw`text-foo bg-bar`).toMatchObject({
      color: `rgb(1, 2, 3)`,
      backgroundColor: `rgba(4, 5, 6, 0.5)`,
    });

    expect(tw`text-foo text-opacity-75`).toMatchObject({
      color: `rgba(1, 2, 3, 0.75)`,
    });
  });

  test(`DEFAULT special modifier`, () => {
    tw = create({ theme: { colors: { foo: { '100': `#ff0`, DEFAULT: `#EEF` } } } });
    expect(tw`text-foo-100 bg-foo`).toMatchObject({
      color: `#ff0`,
      backgroundColor: `#EEF`,
    });
  });

  test(`arbitrary color values`, () => {
    expect(tw`bg-[#012]`).toMatchObject({ backgroundColor: `#012` });
    expect(tw`bg-[rgba(3,4,5,0.1)]`).toMatchObject({
      backgroundColor: `rgba(3,4,5,0.1)`,
    });
    expect(tw`bg-[#012] bg-opacity-50`).toMatchObject({
      backgroundColor: `rgba(0, 17, 34, 0.5)`,
    });
  });

  test(`non-group dashed custom colors`, () => {
    tw = create({
      theme: { colors: { 'indigo-lighter': `#b3bcf5`, indigo: `#5c6ac4` } },
    });
    expect(tw`text-indigo bg-indigo-lighter`).toMatchObject({
      color: `#5c6ac4`,
      backgroundColor: `#b3bcf5`,
    });
  });

  test(`transparent`, () => {
    expect(tw`text-transparent`).toMatchObject({ color: `transparent` });
  });
});
