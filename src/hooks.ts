import { useState } from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';
import { TailwindFn } from './types';

export function useDeviceContext(tw: TailwindFn): void {
  const [test, setTest] = useState(1);
  const window = useWindowDimensions();
  tw.stateUpdater = () => setTest(test + 1);
  tw.setWindowDimensions(window);
  tw.setFontScale(window.fontScale);
  tw.setPixelDensity(window.scale === 1 ? 1 : 2);
  tw.setColorScheme(useColorScheme());
}
