import rn from 'react-native';
import { describe, test, expect } from '@jest/globals';
import { create } from '../';

jest.mock(`react-native`, () => ({
  Platform: { OS: `ios` },
}));

describe(`tw.prefixMatch()`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  test(`unknown prefixes return false`, () => {
    expect(tw.prefixMatch(`foo`)).toBe(false);
    expect(tw.prefixMatch(`bar`)).toBe(false);
    expect(tw.prefixMatch(`baz`)).toBe(false);
  });

  test(`platform prefixes`, () => {
    rn.Platform.OS = `ios`;
    expect(tw.prefixMatch(`ios`)).toBe(true);
    expect(tw.prefixMatch(`android`)).toBe(false);
    tw = create();
    rn.Platform.OS = `android`;
    expect(tw.prefixMatch(`ios`)).toBe(false);
    expect(tw.prefixMatch(`android`)).toBe(true);
  });

  test(`breakpoint prefixes`, () => {
    tw = create({ theme: { screens: { md: `600px`, lg: `800px`, xl: `1000px` } } });
    tw.setWindowDimensions({ width: 801, height: 600 });
    expect(tw.prefixMatch(`md`)).toBe(true);
    expect(tw.prefixMatch(`lg`)).toBe(true);
    expect(tw.prefixMatch(`xl`)).toBe(false);
    expect(tw.prefixMatch(`landscape`)).toBe(true);
    expect(tw.prefixMatch(`portrait`)).toBe(false);
  });

  test(`arbitrary breakpoint prefixes`, () => {
    tw.setWindowDimensions({ width: 800, height: 600 });
    expect(tw.prefixMatch(`min-h-[500px]`)).toBe(true);
    expect(tw.prefixMatch(`max-h-[500px]`)).toBe(false);
    expect(tw.prefixMatch(`min-w-[500px]`)).toBe(true);
    expect(tw.prefixMatch(`max-w-[500px]`)).toBe(false);
  });

  test(`multiple prefixes`, () => {
    rn.Platform.OS = `ios`;
    tw.setWindowDimensions({ width: 800, height: 600 });
    expect(tw.prefixMatch(`min-w-[500px]`, `max-w-[600px]`)).toBe(false);
    expect(tw.prefixMatch(`min-w-[500px]`, `max-w-[900px]`)).toBe(true);
    expect(tw.prefixMatch(`min-w-[500px]`, `ios`)).toBe(true);
    expect(tw.prefixMatch(`min-w-[500px]`, `android`)).toBe(false);
  });
});
