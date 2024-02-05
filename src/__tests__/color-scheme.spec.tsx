import renderer from 'react-test-renderer';
import rn from 'react-native';
import { describe, it, expect } from '@jest/globals';
import React from 'react';
import type { RnColorScheme, TailwindFn } from '../';
import { create, useDeviceContext, useAppColorScheme } from '../';

jest.mock(`react-native`, () => ({
  Platform: { OS: `ios` },
  Appearance: { getColorScheme: () => `light` },
  useColorScheme: () => `light`,
  useWindowDimensions: () => ({ width: 320, height: 640, fontScale: 1, scale: 2 }),
}));

const Test: React.FC<{ tw: TailwindFn; initial?: RnColorScheme }> = ({ tw, initial }) => {
  useDeviceContext(tw, { withDeviceColorScheme: true });
  const [colorScheme] = useAppColorScheme(tw, initial);
  return (
    <>
      {String(colorScheme)}
      {tw.prefixMatch(`dark`) ? `match:dark` : `no-match:dark`}
    </>
  );
};

describe(`useAppColorScheme()`, () => {
  it(`should initialize to ambient color scheme, if no initializer`, () => {
    rn.Appearance.getColorScheme = () => `dark`;

    let component = renderer.create(<Test tw={create()} />);
    expect(component.toJSON()).toEqual([`dark`, `match:dark`]);

    rn.Appearance.getColorScheme = () => `light`;
    component = renderer.create(<Test tw={create()} />);
    expect(component.toJSON()).toEqual([`light`, `no-match:dark`]);

    rn.Appearance.getColorScheme = () => null;
    component = renderer.create(<Test tw={create()} />);
    expect(component.toJSON()).toEqual([`null`, `no-match:dark`]);

    rn.Appearance.getColorScheme = () => undefined;
    component = renderer.create(<Test tw={create()} />);
    expect(component.toJSON()).toEqual([`undefined`, `no-match:dark`]);
  });

  it(`should initialize to explicitly passed color scheme when initializer provided`, () => {
    rn.Appearance.getColorScheme = () => `dark`;

    let component = renderer.create(<Test tw={create()} initial="light" />);
    expect(component.toJSON()).toEqual([`light`, `no-match:dark`]);

    rn.Appearance.getColorScheme = () => `light`;
    component = renderer.create(<Test tw={create()} initial="dark" />);
    expect(component.toJSON()).toEqual([`dark`, `match:dark`]);
  });
});
