import { expect, it, describe } from '@jest/globals';
import ClassParser from '../parse-class';

describe(`ClassParser`, () => {
  it(`uses window.width as cache group for breakpoint prefix`, () => {
    const config = { theme: { screens: { md: `768px` } } };
    const window = { width: 500, height: 0, scale: 0, fontScale: 0 };
    const parser = new ClassParser(`md:m-2`, config, window);
    expect(parser.cacheGroup).toBe(`w500`);
  });

  it(`uses default as cache group for breakpoint prefix when missing window`, () => {
    const config = { theme: { screens: { md: `768px` } } };
    const parser = new ClassParser(`md:m-2`, config);
    expect(parser.cacheGroup).toBe(`default`);
  });

  it(`uses default as cache group for breakpoint prefix when missing screens`, () => {
    const window = { width: 500, height: 0, scale: 0, fontScale: 0 };
    const parser = new ClassParser(`md:m-2`, {}, window);
    expect(parser.cacheGroup).toBe(`default`);
  });
});
