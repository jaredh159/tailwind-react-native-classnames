import { useColorScheme, useWindowDimensions } from 'react-native';
import { TailwindFn } from './types';

export function useDeviceContext(tw: TailwindFn): void {
  const window = useWindowDimensions();
  tw.setWindowDimensions(window);
  tw.setFontScale(window.fontScale);
  tw.setPixelDensity(window.scale === 1 ? 1 : 2);
  tw.setColorScheme(useColorScheme());
}
