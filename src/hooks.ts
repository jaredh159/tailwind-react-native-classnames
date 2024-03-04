import { useState } from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';
import type { TailwindFn, RnColorScheme } from './types';

type AppOptions = {
  observeDeviceColorSchemeChanges: false;
  initialColorScheme: 'device' | 'light' | 'dark';
};

export function useDeviceContext(tw: TailwindFn, appOptions?: AppOptions): void {
  const deviceColorScheme = useColorScheme();
  useState(() => {
    // (mis?)use `useState` initializer fn to initialize appColorScheme only ONCE
    if (appOptions) {
      const initial = appOptions.initialColorScheme;
      tw.setColorScheme(initial === `device` ? deviceColorScheme : initial);
      if (`withDeviceColorScheme` in appOptions) {
        console.error(MIGRATION_ERR); // eslint-disable-line no-console
      }
    }
  });
  const window = useWindowDimensions();
  tw.updateDeviceContext(
    window,
    window.fontScale,
    window.scale === 1 ? 1 : 2,
    appOptions ? `skip` : deviceColorScheme,
  );
}

export function useAppColorScheme(
  tw: TailwindFn,
): [
  colorScheme: RnColorScheme,
  toggleColorScheme: () => void,
  setColorScheme: (colorScheme: RnColorScheme) => void,
] {
  const [helper, setHelper] = useState(0);
  return [
    tw.getColorScheme(),
    () => {
      tw.setColorScheme(tw.getColorScheme() === `dark` ? `light` : `dark`);
      setHelper(helper + 1);
    },
    (newColorScheme) => {
      tw.setColorScheme(newColorScheme);
      setHelper(helper + 1);
    },
  ];
}

const MIGRATION_ERR = `\`withDeviceColorScheme\` has been changed to \`observeDeviceColorSchemeChanges\` in twrnc@4.0.0 -- see migration-guide.md for more details`;
