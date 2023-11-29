import type { TwConfig } from './tw-config';
import type { AddedUtilities, CreatePlugin, PluginFunction } from './types';

const plugin: CreatePlugin = (handler) => {
  return { handler, config: undefined };
};

export default plugin;

export function getAddedUtilities(plugins: TwConfig['plugins']): AddedUtilities {
  return (
    plugins?.reduce<AddedUtilities>(
      (utils, plugin) => ({ ...utils, ...callPluginFunction(plugin.handler) }),
      {},
    ) ?? {}
  );
}

function callPluginFunction(pluginFn: PluginFunction): AddedUtilities {
  let added: AddedUtilities = {};
  pluginFn({
    addUtilities: (utilities) => {
      added = utilities;
    },
    ...core,
  });
  return added;
}

function notImplemented(fn: string): never {
  throw new Error(
    `tailwindcss plugin function argument object prop "${fn}" not implemented`,
  );
}

const core = {
  addComponents: notImplemented,
  addBase: notImplemented,
  addVariant: notImplemented,
  e: notImplemented,
  prefix: notImplemented,
  theme: notImplemented,
  variants: notImplemented,
  config: notImplemented,
  corePlugins: notImplemented,
  matchUtilities: notImplemented,
  postcss: null,
};
