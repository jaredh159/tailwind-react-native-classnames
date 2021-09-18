import resolveConfig from 'tailwindcss/resolveConfig';
import {
  ClassInput,
  DependentStyle,
  Style,
  TailwindFn,
  RnWindow,
  RnColorScheme,
  OrderedStyle,
  StyleIR,
} from './types';
import { TwConfig } from './tw-config';
import Cache from './cache';
import ClassParser from './ClassParser';
import { parseInputs } from './parse-inputs';
import { complete, warn } from './helpers';
import plugin, { getAddedUtilities } from './plugin';

export { plugin };

export function create(customConfig: TwConfig = {}): TailwindFn {
  const config = resolveConfig(customConfig as any) as TwConfig;
  let window: RnWindow | undefined = undefined;
  let colorScheme: RnColorScheme;

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

  function deriveCacheGroup(): string {
    return (
      [
        window ? `w${window.width}` : false,
        window ? `h${window.height}` : false,
        window ? `fs${window.fontScale}` : false,
        colorScheme === `dark` ? `dark` : false,
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
      if (!styleIr) {
        if (utility in customStringUtils) {
          const customStyle = style(customStringUtils[utility]);
          cache.setIr(utility, complete(customStyle));
          return customStyle;
        }
        const parser = new ClassParser(utility, config, cache, window, colorScheme);
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
    }

    if (userStyle) {
      resolved = { ...resolved, ...userStyle };
    }

    // cache the full set of classes for future re-renders
    if (joined !== ``) {
      cache.setStyle(joined, resolved);
    }
    return resolved;
  }

  function color(utils: string): string | undefined {
    const styleObj = style(
      utils
        .split(/\s+/g)
        .map((util) => util.replace(/^(bg|text)-/, ``))
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
      str += string + (values[i] || ``);
    });
    return style(str);
  };

  tailwindFn.style = style;
  tailwindFn.color = color;

  tailwindFn.setWindow = (newWindow: RnWindow) => {
    window = newWindow;
    cacheGroup = deriveCacheGroup();
  };

  tailwindFn.setColorScheme = (newColorScheme: RnColorScheme) => {
    if (newColorScheme !== colorScheme) {
      colorScheme = newColorScheme;
      cacheGroup = deriveCacheGroup();
    }
  };

  return tailwindFn;
}

const tailwind = create();

export default tailwind;
