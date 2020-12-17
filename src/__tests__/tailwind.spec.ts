import { describe, it, test } from '@jest/globals';
import tw, { getColor, t } from '../tailwind';

jest.mock(`react-native`, () => ({
  Platform: { OS: `ios` },
}));

// TODO: rest of tests passing from rn-tailwind
// tw`` template literal syntax API
// documentation
// release
// reddit

describe(`t template literal helper`, () => {
  it('handles single class name', () => {
    expect(t`pt-12`).toEqual({ paddingTop: 48 });
  });

  it('handles double class name', () => {
    expect(t`pt-12 pb-12`).toEqual({ paddingTop: 48, paddingBottom: 48 });
  });

  it('supports template literal substitution', () => {
    let num = 12;
    expect(t`pt-${num}`).toEqual({ paddingTop: 48 });
  });
});

describe(`tw()`, () => {
  it(`respects platform psuedo-class prefix`, () => {
    const style = tw(`ios:pt-12 android:pt-0`);
    expect(style).toEqual({ paddingTop: 48 });
  });

  it(`handles single class name`, () => {
    expect(tw(`text-blue-500`)).toEqual({ color: `rgba(59, 130, 246, 1)` });
  });

  it(`get styles for multiple classes`, () => {
    expect(tw(`text-blue-500 bg-blue-100`)).toEqual({
      color: `rgba(59, 130, 246, 1)`,
      backgroundColor: `rgba(219, 234, 254, 1)`,
    });
  });

  it(`ignores unknown classes`, () => {
    expect(tw(`text-blue-500 unknown`)).toEqual({ color: `rgba(59, 130, 246, 1)` });
  });

  it(`supports color opacity`, () => {
    const styles = tw(
      `text-blue-500 text-opacity-50 bg-blue-100`,
      `bg-opacity-50 border-blue-100 border-opacity-50`,
    );
    expect(styles).toEqual({
      backgroundColor: `rgba(219, 234, 254, 0.5)`,
      borderBottomColor: `rgba(219, 234, 254, 0.5)`,
      borderLeftColor: `rgba(219, 234, 254, 0.5)`,
      borderRightColor: `rgba(219, 234, 254, 0.5)`,
      borderTopColor: `rgba(219, 234, 254, 0.5)`,
      color: `rgba(59, 130, 246, 0.5)`,
    });
  });

  it(`ignores non-string values when transforming CSS variables`, () => {
    expect(tw(`bg-blue-500 p-12`)).toEqual({
      backgroundColor: `rgba(59, 130, 246, 1)`,
      paddingBottom: 48,
      paddingLeft: 48,
      paddingRight: 48,
      paddingTop: 48,
    });
  });
});

describe(`getColor()`, () => {
  test(`returns rgba formatted color for known color`, () => {
    // getColor()
    const color = getColor(`blue-100`);
    expect(color).toBe(`rgba(219, 234, 254, 1)`);
  });

  test(`returns undefined for unknown color`, () => {
    expect(getColor(`center`)).toBeUndefined();
  });
});
