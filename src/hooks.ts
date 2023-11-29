import { useState } from 'react';
import { useColorScheme, useWindowDimensions, Appearance } from 'react-native';
import type { TailwindFn, RnColorScheme } from './types';

type Options = {
  withDeviceColorScheme: boolean;
};

export function useDeviceContext(
  tw: TailwindFn,
  opts: Options = { withDeviceColorScheme: true },
): void {
  const window = useWindowDimensions();
  tw.setWindowDimensions(window);
  tw.setFontScale(window.fontScale);
  tw.setPixelDensity(window.scale === 1 ? 1 : 2);
  const colorScheme = useColorScheme();
  if (opts.withDeviceColorScheme) {
    tw.setColorScheme(colorScheme);
  }
}

export function useAppColorScheme(
  tw: TailwindFn,
  initialValue?: RnColorScheme,
): [
  colorScheme: RnColorScheme,
  toggleColorScheme: () => void,
  setColorScheme: (colorScheme: RnColorScheme) => void,
] {
  const [colorScheme, setColorScheme] = useState<RnColorScheme>(
    initialValue ?? Appearance.getColorScheme(),
  );
  return [
    colorScheme,
    () => {
      const toggled = colorScheme === `dark` ? `light` : `dark`;
      tw.setColorScheme(toggled);
      setColorScheme(toggled);
    },
    (newColorScheme) => {
      tw.setColorScheme(newColorScheme);
      setColorScheme(newColorScheme);
    },
  ];
}
