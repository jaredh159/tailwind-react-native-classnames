import TestRenderer from 'react-test-renderer';
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

    let component = TestRenderer.create(<Test tw={create()} initial="device" />);
    expect(component.toJSON()).toEqual([`dark`, `match:dark`]);

    rn.useColorScheme = () => `light`;
    component = TestRenderer.create(<Test tw={create()} initial="device" />);
    expect(component.toJSON()).toEqual([`light`, `no-match:dark`]);

    rn.useColorScheme = () => null;
    component = TestRenderer.create(<Test tw={create()} initial="device" />);
    expect(component.toJSON()).toEqual([`null`, `no-match:dark`]);

    rn.useColorScheme = () => undefined;
    component = TestRenderer.create(<Test tw={create()} initial="device" />);
    expect(component.toJSON()).toEqual([`undefined`, `no-match:dark`]);
  });

  it(`should initialize to explicitly passed color scheme when initializer provided`, () => {
    rn.useColorScheme = () => `dark`;

    let component = TestRenderer.create(<Test tw={create()} initial="light" />);
    expect(component.toJSON()).toEqual([`light`, `no-match:dark`]);

    rn.useColorScheme = () => `light`;
    component = TestRenderer.create(<Test tw={create()} initial="dark" />);
    expect(component.toJSON()).toEqual([`dark`, `match:dark`]);
  });

  test(`nested components should read same app color scheme`, () => {
    const tw = create();

    const NestedComponent: React.FC = () => {
      const [colorScheme] = useAppColorScheme(tw);
      return (
        <>
          {tw.prefixMatch(`dark`) ? `nested:match:dark` : `nested:no-match:dark`}
          {`nested:${colorScheme}`}
        </>
      );
    };

    const Toggler: React.FC<{ onPress: () => unknown }> = () => null;

    const Component: React.FC<{ initial: 'light' | 'dark' | 'device' }> = ({
      initial,
    }) => {
      useDeviceContext(tw, {
        observeDeviceColorSchemeChanges: false,
        initialColorScheme: initial,
      });
      const [colorScheme, toggleColorScheme] = useAppColorScheme(tw);
      return (
        <>
          <Toggler onPress={() => toggleColorScheme()} />
          {tw.prefixMatch(`dark`) ? `outer:match:dark` : `outer:no-match:dark`}
          {`outer:${colorScheme}`}
          <NestedComponent />
        </>
      );
    };

    const renderer = TestRenderer.create(<Component initial="light" />);
    expect(assertArray(renderer.toJSON())).toEqual([
      `outer:no-match:dark`,
      `outer:light`,
      `nested:no-match:dark`,
      `nested:light`,
    ]);
    TestRenderer.act(() => {
      renderer.root.findByType(Toggler).props.onPress();
    });
    expect(assertArray(renderer.toJSON())).toEqual([
      `outer:match:dark`,
      `outer:dark`,
      `nested:match:dark`,
      `nested:dark`,
    ]);
  });
});

function assertArray<T>(value: T | T[]): T[] {
  if (!Array.isArray(value)) throw new Error(`expected array, got ${value}`);
  return value;
}
