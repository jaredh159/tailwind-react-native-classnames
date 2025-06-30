import { Platform } from 'react-native';
import type { TailwindFn, RnColorScheme, ClassInput, Style } from './types';
import type { TwConfig } from './tw-config';
import plugin from './plugin';
import rawCreate from './create';
import { getInitialTwConfig } from './configure';

const initialTwConfig = getInitialTwConfig();

/**
 * Apply default config and inject RN Platform
 * If no config is provided, use the initial config
 */
const create = (twConfig: TwConfig = initialTwConfig || {}): TailwindFn => {
  return rawCreate(twConfig, Platform.OS);
};

export type { TailwindFn, TwConfig, RnColorScheme, ClassInput, Style };
export { useDeviceContext, useAppColorScheme } from './hooks';

const tailwind = create();
const style = tailwind.style;

export default tailwind;

export { create, plugin, style };
