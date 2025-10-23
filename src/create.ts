import resolveConfig from 'tailwindcss/resolveConfig';
import type {
  ClassInput,
  DependentStyle,
  Style,
  TailwindFn,
  RnColorScheme,
  OrderedStyle,
  StyleIR,
  DeviceContext,
  Platform,
  Version,
} from './types';
import { PREFIX_COLOR_PROP_MAP, type TwConfig } from './tw-config';
import Cache from './cache';
import UtilityParser from './UtilityParser';
import { configColor, removeOpacityHelpers } from './resolve/color';
import { parseInputs } from './parse-inputs';
import { complete, warn } from './helpers';
import { getAddedUtilities } from './plugin';

export function create(
  customConfig: TwConfig,
  platform: Platform,
  reactNativeVersion: Version,
): TailwindFn {
  const config = resolveConfig(withContent(customConfig) as any) as TwConfig;
  const device: DeviceContext = {
    platform,
  };

  const pluginUtils = getAddedUtilities(config.plugins);
  const customStringUtils: Record<string, string> = {};
  const customStyleUtils = Object.entries(pluginUtils)
    .map(([rawUtil, style]): [string, StyleIR] => {
      const util = rawUtil.replace(/^\./, ``);
      if (typeof style === `string`) {
        // sacrifice functional purity to only iterate once
        customStringUtils[util] = style;
        return [util, { kind: `null` }];
      }
      return [util, complete(style)];
    })
    .filter(([, ir]) => ir.kind !== `null`);

  patchCustomFontUtils(customConfig, customStyleUtils, config);

  function deriveCacheGroup(): string {
    return (
      [
        device.colorScheme === `dark` ? `dark` : false,
        device.windowDimensions ? `w${device.windowDimensions.width}` : false,
        device.windowDimensions ? `h${device.windowDimensions.height}` : false,
        device.fontScale ? `fs${device.fontScale}` : false,
        device.pixelDensity === 2 ? `retina` : false,
      ]
        .filter(Boolean)
        .join(`--`) || `default`
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const tailwindFn = (strings: TemplateStringsArray, ...values: (string | number)[]) => {
    let str = ``;
    strings.forEach((string, i) => {
      str += string + (values[i] ?? ``);
    });
    return style(str);
  };

  const contextCaches: Record<string, Cache> = {};
  let cache = new Cache();
  tailwindFn.memoBuster = ``;
  configureCache();

  function configureCache(): void {
    const cacheGroup = deriveCacheGroup();
    tailwindFn.memoBuster = `twrnc-memobuster-key--${cacheGroup}`;
    const existing = contextCaches[cacheGroup];
    if (existing) {
      cache = existing;
      return;
    }
    const newCache = new Cache(customStyleUtils);
    contextCaches[cacheGroup] = newCache;
    // set custom string utils into cache, so they are resolvable at all breakpoints
    for (const [key, value] of Object.entries(customStringUtils)) {
      newCache.setIr(key, complete(style(value)));
    }
    cache = newCache;
  }

  function style(...inputs: ClassInput[]): Style {
    let resolved: Style = {};
    const dependents: DependentStyle[] = [];
    const ordered: OrderedStyle[] = [];
    const [utilities, userStyle] = parseInputs(inputs);

    // check if we've seen this full set of classes before
    // if we have a cached copy, we can skip examining each utility
    const joined = utilities.join(` `);
    const cached = cache.getStyle(joined);
    if (cached) {
      return userStyle ? { ...cached, ...userStyle } : cached;
    }

    for (const utility of utilities) {
      let styleIr = cache.getIr(utility);
      if (!styleIr) {
        const parser = new UtilityParser(
          utility,
          config,
          cache,
          device,
          reactNativeVersion,
        );
        styleIr = parser.parse();
      }

      switch (styleIr.kind) {
        case `complete`:
          resolved = { ...resolved, ...styleIr.style };
          cache.setIr(utility, styleIr);
          break;
        case `dependent`:
          dependents.push(styleIr);
          break;
        case `ordered`:
          ordered.push(styleIr);
          break;
        case `null`:
          cache.setIr(utility, styleIr);
          break;
      }
    }

    if (ordered.length > 0) {
      ordered.sort((a, b) => a.order - b.order);
      for (const orderedStyle of ordered) {
        switch (orderedStyle.styleIr.kind) {
          case `complete`:
            resolved = { ...resolved, ...orderedStyle.styleIr.style };
            break;
          case `dependent`:
            dependents.push(orderedStyle.styleIr);
            break;
        }
      }
    }

    if (dependents.length > 0) {
      for (const dependent of dependents) {
        const error = dependent.complete(resolved);
        if (error) {
          warn(error);
        }
      }
      removeOpacityHelpers(resolved);
    }

    // cache the full set of classes for future re-renders
    // it's important we cache BEFORE merging in userStyle below
    if (joined !== ``) {
      cache.setStyle(joined, resolved);
    }

    if (userStyle) {
      resolved = { ...resolved, ...userStyle };
    }

    return resolved;
  }

  function color(utils: string): string | undefined {
    if (!config.theme) {
      return undefined;
    }

    // Prefer prefix-specific colors within the theme config.
    // Only support theme objects which do not require a plugin. See:
    // https://v2.tailwindcss.com/docs/theme#configuration-reference
    // https://v3.tailwindcss.com/docs/theme#configuration-reference

    let color: string | null;

    // Iterate supported theme objects and try to find a match
    for (const key of Object.keys(PREFIX_COLOR_PROP_MAP)) {
      const prefix = key as keyof typeof PREFIX_COLOR_PROP_MAP;
      const suffix = utils.slice(prefix.length);
      const themePropertyName = PREFIX_COLOR_PROP_MAP[prefix];
      const themeColors = config.theme[themePropertyName];

      if (suffix && utils.startsWith(prefix) && themeColors) {
        color = configColor(suffix, themeColors);

        if (color) {
          return color;
        }
      }
    }

    // Check `colors` if `utils` is not a computed value (e.g. `secondary opacity-50` or `white/25`)
    if (!/\s+/.test(utils) && !utils.includes(`/`) && config.theme.colors) {
      color = configColor(utils, config.theme.colors);

      if (color) {
        return color;
      }
    }

    // Fall back to attempting style parsing
    let toStyle = utils;

    if (!/^(bg-|text-|border-)/.test(utils)) {
      toStyle = utils
        .split(/\s+/g)
        .map((util) => util.replace(/^(bg|text|border)-/, ``))
        .map((util) => `bg-${util}`)
        .join(` `);
    }

    const styleObj = style(toStyle);

    const foundColorKey = [
      `backgroundColor`,
      `borderColor`,
      `borderLeftColor`,
      `borderRightColor`,
      `borderTopColor`,
      `borderBottomColor`,
      `color`,
    ].find((key) => typeof styleObj?.[key] === `string`);

    if (foundColorKey) {
      return styleObj?.[foundColorKey] as string;
    }

    return undefined;
  }

  tailwindFn.style = style;
  tailwindFn.color = color;

  tailwindFn.prefixMatch = (...prefixes: string[]) => {
    const joined = prefixes.sort().join(`:`);
    const cached = cache.getPrefixMatch(joined);
    if (cached !== undefined) {
      return cached;
    }
    const parser = new UtilityParser(
      `${joined}:flex`,
      config,
      cache,
      device,
      reactNativeVersion,
    );
    const ir = parser.parse();
    const prefixMatches = ir.kind !== `null`;
    cache.setPrefixMatch(joined, prefixMatches);
    return prefixMatches;
  };

  tailwindFn.setWindowDimensions = (newDimensions: { width: number; height: number }) => {
    device.windowDimensions = newDimensions;
    configureCache();
  };

  tailwindFn.setFontScale = (newFontScale: number) => {
    device.fontScale = newFontScale;
    configureCache();
  };

  tailwindFn.setPixelDensity = (newPixelDensity: 1 | 2) => {
    device.pixelDensity = newPixelDensity;
    configureCache();
  };

  tailwindFn.setColorScheme = (newColorScheme: RnColorScheme) => {
    device.colorScheme = newColorScheme;
    configureCache();
  };

  tailwindFn.getColorScheme = () => device.colorScheme;

  tailwindFn.updateDeviceContext = (
    window: { width: number; height: number },
    fontScale: number,
    pixelDensity: 1 | 2,
    colorScheme: RnColorScheme | 'skip',
  ) => {
    device.windowDimensions = window;
    device.fontScale = fontScale;
    device.pixelDensity = pixelDensity;
    if (colorScheme !== `skip`) {
      device.colorScheme = colorScheme;
    }
    configureCache();
  };

  return tailwindFn;
}

export default create;

function withContent(config: TwConfig): TwConfig & { content: string[] } {
  return {
    ...config,
    // prevent warnings from tailwind about not having a `content` prop
    // we don't need one because we have our own jit parser which
    // does not rely on knowing content paths to search
    content: [`_no_warnings_please`],
  };
}

// Allow override default font-<name> style
// @TODO: long-term, i'd like to think of a more generic way to allow
// custom configurations not to get masked by default utilities...
function patchCustomFontUtils(
  customConfig: TwConfig,
  customStyleUtils: Array<[string, StyleIR]>,
  config: TwConfig,
): void {
  if (customConfig.theme?.fontWeight || customConfig.theme?.extend?.fontWeight) {
    [
      ...Object.entries(customConfig.theme?.fontWeight ?? {}),
      ...Object.entries(customConfig.theme?.extend?.fontWeight ?? {}),
    ].forEach(([name, value]) => {
      customStyleUtils.push([`font-${name}`, complete({ fontWeight: String(value) })]);
    });
  }
  if (`object` === typeof config.theme?.fontFamily) {
    [
      ...Object.entries(customConfig.theme?.fontFamily ?? {}),
      ...Object.entries(customConfig.theme?.extend?.fontFamily ?? {}),
    ].forEach(([name, value]) => {
      const fontFamily = Array.isArray(value) ? value[0] : value;
      if (fontFamily) {
        customStyleUtils.push([`font-${name}`, complete({ fontFamily })]);
      }
    });
  }
}
