import { Platform } from 'react-native';
import type { TailwindFn, RnColorScheme, ClassInput, Style } from './types';
import type { TwConfig } from './tw-config';
import plugin from './plugin';
import rawCreate from './create';

// Apply default config and inject RN Platform and RN version
const create = (twConfig: TwConfig = {}): TailwindFn => {
  return rawCreate(
    twConfig,
    Platform.OS,
    // react-native-web does not expose a constants object
    // @see https://github.com/necolas/react-native-web/blob/master/packages/react-native-web/src/exports/Platform/index.js
    Platform.constants?.reactNativeVersion,
  );
};

export type { TailwindFn, TwConfig, RnColorScheme, ClassInput, Style };
export { useDeviceContext, useAppColorScheme } from './hooks';

const tailwind = create();
const style = tailwind.style;

export default tailwind;

export { create, plugin, style };
