import { Platform } from 'react-native';
import type { TailwindFn, RnColorScheme } from './types';
import type { TwConfig } from './tw-config';
import plugin from './plugin';
import rawCreate from './create';

// Apply default config and inject RN Platform
const create = (twConfig: TwConfig = {}): TailwindFn => rawCreate(twConfig, Platform.OS);

export type { TailwindFn, TwConfig, RnColorScheme };
export { useDeviceContext, useAppColorScheme } from './hooks';

const tailwind = create();
const style = tailwind.style;

export default tailwind;

export { create, plugin, style };
