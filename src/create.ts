import resolveConfig from 'tailwindcss/resolveConfig';
import {
  ClassInput,
  DependentStyle,
  Style,
  TailwindFn,
  RnColorScheme,
  OrderedStyle,
  StyleIR,
  DeviceContext,
  Platform,
} from './types';
import { TwConfig } from './tw-config';
import Cache from './cache';
import ClassParser from './ClassParser';
import { parseInputs } from './parse-inputs';
import { complete, warn } from './helpers';
import { getAddedUtilities } from './plugin';
import { removeOpacityHelpers } from './resolve/color';

export function create(customConfig: TwConfig, platform: Platform): TailwindFn {
  const config = resolveConfig(withContent(customConfig) as any) as TwConfig;
  const device: DeviceContext = {};

  const pluginUtils = getAddedUtilities(config.plugins);
  const customStringUtils: Record<string, string> = {};
  const customStyleUtils = Object.entries(pluginUtils)
    .map(([util, style]): [string, StyleIR] => {
      if (typeof style === `string`) {
        // mutating while mapping, i know - bad form, but for performance sake... ¯\_(ツ)_/¯
        customStringUtils[util] = style;
        return [util, { kind: `null` }];
      }
      return [util, complete(style)];
    })
    .filter(([, ir]) => ir.kind !== `null`);

  // Allow override default font-<name> style
  if ( 'object' === typeof config.theme?.fontWeight) {
    Object.entries(config.theme.fontWeight).forEach(([name, value]) => {
      customStyleUtils.push([
        'font-'+name,
        complete({ fontWeight: value.toString() } as Style)
      ]);
    });
  }

  // Allow override default font-<name> style
  if ( 'object' === typeof config.theme?.fontFamily) {
    Object.entries(config.theme.fontFamily).forEach(([name, value]) => {
      const fontFamily = Array.isArray(value) ? value[0] : value;
      customStyleUtils.push([
        'font-'+name,
        complete({ fontFamily } as Style)
      ]);
    });
  }

  function deriveCacheGroup(): string {
    return (
      [
        device.windowDimensions ? `w${device.windowDimensions.width}` : false,
        device.windowDimensions ? `h${device.windowDimensions.height}` : false,
        device.fontScale ? `fs${device.fontScale}` : false,
        device.colorScheme === `dark` ? `dark` : false,
        device.pixelDensity === 2 ? `retina` : false,
      ]
        .filter(Boolean)
        .join(`--`) || `default`
    );
  }

  let cacheGroup = deriveCacheGroup();
  const contextCaches: Record<string, Cache> = {};

  function getCache(): Cache {
    const existing = contextCaches[cacheGroup];
    if (existing) {
      return existing;
    }
    const cache = new Cache(customStyleUtils);
    contextCaches[cacheGroup] = cache;
    return cache;
  }

  function style(...inputs: ClassInput[]): Style {
    const cache = getCache();
    let resolved: Style = {};
    const dependents: DependentStyle[] = [];
    const ordered: OrderedStyle[] = [];
    const [utilities, userStyle] = parseInputs(inputs);

    // check if we've seen this full set of classes before
    // if we have a cached copy, we can skip examining each utility
    const joined = utilities.join(` `);
    const cached = cache.getStyle(joined);
    if (cached) {
      return { ...cached, ...(userStyle ? userStyle : {}) };
    }

    for (const utility of utilities) {
      let styleIr = cache.getIr(utility);

      if (!styleIr && utility in customStringUtils) {
        const customStyle = style(customStringUtils[utility]);
        cache.setIr(utility, complete(customStyle));
        resolved = { ...resolved, ...customStyle };
        continue;
      }

      const parser = new ClassParser(utility, config, cache, device, platform);
      styleIr = parser.parse();

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
    const styleObj = style(
      utils
        .split(/\s+/g)
        .map((util) => util.replace(/^(bg|text|border)-/, ``))
        .map((util) => `bg-${util}`)
        .join(` `),
    );
    return typeof styleObj.backgroundColor === `string`
      ? styleObj.backgroundColor
      : undefined;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const tailwindFn = (strings: TemplateStringsArray, ...values: (string | number)[]) => {
    let str = ``;
    strings.forEach((string, i) => {
      str += string + (values[i] ?? ``);
    });
    return style(str);
  };

  tailwindFn.style = style;
  tailwindFn.color = color;

  tailwindFn.prefixMatch = (...prefixes: string[]) => {
    const joined = prefixes.sort().join(`:`);
    const cache = getCache();
    const cached = cache.getPrefixMatch(joined);
    if (cached !== undefined) {
      return cached;
    }
    const parser = new ClassParser(`${joined}:flex`, config, cache, device, platform);
    const ir = parser.parse();
    const prefixMatches = ir.kind !== `null`;
    cache.setPrefixMatch(joined, prefixMatches);
    return prefixMatches;
  };

  tailwindFn.setWindowDimensions = (newDimensions: { width: number; height: number }) => {
    device.windowDimensions = newDimensions;
    cacheGroup = deriveCacheGroup();
  };

  tailwindFn.setFontScale = (newFontScale: number) => {
    device.fontScale = newFontScale;
    cacheGroup = deriveCacheGroup();
  };

  tailwindFn.setPixelDensity = (newPixelDensity: 1 | 2) => {
    device.pixelDensity = newPixelDensity;
    cacheGroup = deriveCacheGroup();
  };

  tailwindFn.setColorScheme = (newColorScheme: RnColorScheme) => {
    device.colorScheme = newColorScheme;
    cacheGroup = deriveCacheGroup();
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
