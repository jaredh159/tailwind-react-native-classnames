import TestRenderer from 'react-test-renderer';
import { describe, it, expect } from '@jest/globals';
import React from 'react';
import { create, useDeviceContext, useAppColorScheme } from '../';

describe(`memo busting`, () => {
  let tw = create();
  beforeEach(() => (tw = create()));

  const MemoComponent: React.FC = React.memo(() => (
    <>{tw.prefixMatch(`dark`) ? `memo:match:dark` : `memo:no-match:dark`}</>
  ));

  const Toggler: React.FC<{ onPress: () => unknown }> = () => null;

  const Component: React.FC<{ initial: 'light' | 'dark' | 'device' }> = ({ initial }) => {
    useDeviceContext(tw, {
      observeDeviceColorSchemeChanges: false,
      initialColorScheme: initial,
    });
    const [, toggleColorScheme] = useAppColorScheme(tw);
    return (
      <>
        <Toggler onPress={() => toggleColorScheme()} />
        {tw.prefixMatch(`dark`) ? `match:dark` : `no-match:dark`}
        <MemoComponent key="stable" />
        <MemoComponent key={tw.memoBuster} />
      </>
    );
  };

  it(`breaks memoization properly, starting "light"`, () => {
    const renderer = TestRenderer.create(<Component initial="light" />);
    expect(assertArray(renderer.toJSON())).toEqual([
      `no-match:dark`,
      `memo:no-match:dark`,
      `memo:no-match:dark`,
    ]);
    TestRenderer.act(() => {
      renderer.root.findByType(Toggler).props.onPress();
    });
    expect(assertArray(renderer.toJSON())).toEqual([
      `match:dark`,
      `memo:no-match:dark`, // <-- memo not busted
      `memo:match:dark`, // <-- memo busted
    ]);
  });

  it(`breaks memoization properly, starting "dark"`, () => {
    const renderer = TestRenderer.create(<Component initial="dark" />);
    expect(assertArray(renderer.toJSON())).toEqual([
      `match:dark`,
      `memo:match:dark`,
      `memo:match:dark`,
    ]);
    TestRenderer.act(() => {
      renderer.root.findByType(Toggler).props.onPress();
    });
    expect(assertArray(renderer.toJSON())).toEqual([
      `no-match:dark`,
      `memo:match:dark`, // <-- memo not busted
      `memo:no-match:dark`, // <-- memo busted
    ]);
  });
});

function assertArray<T>(value: T | T[]): T[] {
  if (!Array.isArray(value)) throw new Error(`expected array, got ${value}`);
  return value;
}
