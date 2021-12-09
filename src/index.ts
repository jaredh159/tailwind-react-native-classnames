import { Platform } from 'react-native';
import { TailwindFn, RnColorScheme } from './types';
import { TwConfig } from './tw-config';
import plugin from './plugin';
import rawCreate from './create';

// Apply default config and inject RN Platform
const create = (twConfig: TwConfig = {}): TailwindFn => rawCreate(twConfig, Platform.OS);

export { create, plugin };
export type { TailwindFn, TwConfig, RnColorScheme };
export { useDeviceContext, useAppColorScheme } from './hooks';

const tailwind = create();

export default tailwind;
