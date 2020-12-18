import { describe, it, test } from '@jest/globals';
import tw from '../';

jest.mock(`react-native`, () => ({
  Platform: { OS: `ios` },
}));

// TODO: rest of tests passing from rn-tailwind
// documentation
// release
// reddit

describe(`template literal syntax`, () => {
  it(`handles single class name`, () => {
    expect(tw`pt-12`).toEqual({ paddingTop: 48 });
  });

  it(`handles double class name`, () => {
    expect(tw`pt-12 pb-12`).toEqual({ paddingTop: 48, paddingBottom: 48 });
  });

  it(`supports template literal substitution`, () => {
    const num = 12;
    expect(tw`pt-${num}`).toEqual({ paddingTop: 48 });
  });
});

describe(`tw.style()`, () => {
  it(`respects platform psuedo-class prefix`, () => {
    const style = tw.style(`ios:pt-12 android:pt-0`);
    expect(style).toEqual({ paddingTop: 48 });
  });

  it(`handles single class name`, () => {
    expect(tw.style(`text-blue-500`)).toEqual({ color: `rgba(59, 130, 246, 1)` });
  });

  it(`get styles for multiple classes`, () => {
    expect(tw.style(`text-blue-500 bg-blue-100`)).toEqual({
      color: `rgba(59, 130, 246, 1)`,
      backgroundColor: `rgba(219, 234, 254, 1)`,
    });
  });

  it(`ignores unknown classes`, () => {
    expect(tw.style(`unknown`)).toEqual({});
  });

  it(`supports color opacity`, () => {
    const styles = tw.style(
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
    expect(tw.style(`bg-blue-500 p-12`)).toEqual({
      backgroundColor: `rgba(59, 130, 246, 1)`,
      paddingBottom: 48,
      paddingLeft: 48,
      paddingRight: 48,
      paddingTop: 48,
    });
  });

  describe(`font-variant-numeric support`, () => {
    test(`oldstyle-nums`, () => {
      expect(tw`oldstyle-nums`).toEqual({ fontVariant: [`oldstyle-nums`] });
    });

    test(`lining-nums`, () => {
      expect(tw`lining-nums`).toEqual({ fontVariant: [`lining-nums`] });
    });

    test(`tabular-nums`, () => {
      expect(tw`tabular-nums`).toEqual({ fontVariant: [`tabular-nums`] });
    });

    test(`proportional-nums`, () => {
      expect(tw`proportional-nums`).toEqual({ fontVariant: [`proportional-nums`] });
    });

    test(`multiple font variants`, () => {
      expect(tw`oldstyle-nums lining-nums tabular-nums proportional-nums`).toEqual({
        fontVariant: [
          `oldstyle-nums`,
          `lining-nums`,
          `tabular-nums`,
          `proportional-nums`,
        ],
      });
    });
  });

  it(`handles relative letter-spacing`, () => {
    expect(tw`text-xs tracking-tighter`).toMatchObject({ letterSpacing: -0.6 });
    expect(tw`text-base tracking-tighter`).toMatchObject({ letterSpacing: -0.8 });
    expect(tw`text-base tracking-tight`).toMatchObject({ letterSpacing: -0.4 });
    expect(tw`text-base tracking-normal`).toMatchObject({ letterSpacing: 0 });
    expect(tw`text-base tracking-wide`).toMatchObject({ letterSpacing: 0.4 });
    expect(tw`text-base tracking-wider`).toMatchObject({ letterSpacing: 0.8 });
    expect(tw`text-base tracking-widest`).toMatchObject({ letterSpacing: 1.6 });
  });

  test(`letter-spacing with no font-size has no effect`, () => {
    expect(tw`tracking-wide`).toEqual({});
  });

  test(`letter-spacing not dependent on className order`, () => {
    expect(tw`tracking-wide text-base`).toMatchObject({ letterSpacing: 0.4 });
  });
});

describe(`tw.color()`, () => {
  test(`returns rgba formatted color for known color`, () => {
    const color = tw.color(`blue-100`);
    expect(color).toBe(`rgba(219, 234, 254, 1)`);
  });

  test(`returns undefined for unknown color`, () => {
    expect(tw.color(`center`)).toBeUndefined();
  });
});
