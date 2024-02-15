import renderer from 'react-test-renderer';
import rn from 'react-native';
import { describe, it, expect } from '@jest/globals';
import React from 'react';
import type { TailwindFn } from '../';
import { create, useDeviceContext, useAppColorScheme } from '../';

jest.mock(`react-native`, () => ({
  Platform: { OS: `ios` },
  useColorScheme: () => `light`,
  useWindowDimensions: () => ({ width: 320, height: 640, fontScale: 1, scale: 2 }),
}));

const Test: React.FC<{ tw: TailwindFn; initial: 'light' | 'dark' | 'device' }> = ({
  tw,
  initial,
}) => {
  useDeviceContext(tw, {
    observeDeviceColorSchemeChanges: false,
    initialColorScheme: initial,
  });
  const [colorScheme] = useAppColorScheme(tw);
  return (
    <>
      {String(colorScheme)}
      {tw.prefixMatch(`dark`) ? `match:dark` : `no-match:dark`}
    </>
  );
};

describe(`useAppColorScheme()`, () => {
  it(`should initialize to ambient color scheme, if no initializer`, () => {
    rn.useColorScheme = () => `dark`;

    let component = renderer.create(<Test tw={create()} initial="device" />);
    expect(component.toJSON()).toEqual([`dark`, `match:dark`]);

    rn.useColorScheme = () => `light`;
    component = renderer.create(<Test tw={create()} initial="device" />);
    expect(component.toJSON()).toEqual([`light`, `no-match:dark`]);

    rn.useColorScheme = () => null;
    component = renderer.create(<Test tw={create()} initial="device" />);
    expect(component.toJSON()).toEqual([`null`, `no-match:dark`]);

    rn.useColorScheme = () => undefined;
    component = renderer.create(<Test tw={create()} initial="device" />);
    expect(component.toJSON()).toEqual([`undefined`, `no-match:dark`]);
  });

  it(`should initialize to explicitly passed color scheme when initializer provided`, () => {
    rn.useColorScheme = () => `dark`;

    let component = renderer.create(<Test tw={create()} initial="light" />);
    expect(component.toJSON()).toEqual([`light`, `no-match:dark`]);

    rn.useColorScheme = () => `light`;
    component = renderer.create(<Test tw={create()} initial="dark" />);
    expect(component.toJSON()).toEqual([`dark`, `match:dark`]);
  });
});
