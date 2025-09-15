import { Platform } from 'react-native';
import type { TailwindFn, RnColorScheme, ClassInput, Style } from './types';
import type { TwConfig } from './tw-config';
import plugin from './plugin';
import rawCreate from './create';

// Apply default config and inject RN Platform and RN version
const create = (twConfig: TwConfig = {}): TailwindFn =>
  rawCreate(twConfig, Platform.OS, Platform.constants.reactNativeVersion);

export type { TailwindFn, TwConfig, RnColorScheme, ClassInput, Style };
export { useDeviceContext, useAppColorScheme } from './hooks';

const tailwind = create();
const style = tailwind.style;

export default tailwind;

export { create, plugin, style };
