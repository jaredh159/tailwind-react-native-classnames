import resolveConfig from 'tailwindcss/resolveConfig';
import {
  ClassInput,
  DependentStyle,
  Style,
  TailwindFn,
  RnWindow,
  RnColorScheme,
  OrderedStyle,
} from './types';
import { TwConfig } from './tw-config';
import Cache from './cache';
import ClassParser from './ClassParser';
import { parseInputs } from './parse-inputs';
import { warn } from './helpers';

export function create(customConfig: TwConfig = {}): TailwindFn {
  const config = resolveConfig(customConfig as any) as TwConfig;
  let window: RnWindow | undefined = undefined;
  let colorScheme: RnColorScheme;

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
    const cache = new Cache();
    contextCaches[cacheGroup] = cache;
    return cache;
  }

  function style(...inputs: ClassInput[]): Style {
    const cache = getCache();
    let style: Style = {};
    const dependents: DependentStyle[] = [];
    const ordered: OrderedStyle[] = [];
    const [utilities, userStyle] = parseInputs(inputs);

    // check if we've seen this full set of classes before
    // if we have a cached copy, we can skip examining each utility
    const joined = utilities.join(` `);
    const cached = cache.getStyle(joined);
    if (cached) {
      return cached;
    }

    for (const utility of utilities) {
      let styleIr = cache.getIr(utility);
      if (!styleIr) {
        const parser = new ClassParser(utility, config, cache, window, colorScheme);
        styleIr = parser.parse();
      }

      switch (styleIr.kind) {
        case `complete`:
          style = { ...style, ...styleIr.style };
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
            style = { ...style, ...orderedStyle.styleIr.style };
            break;
          case `dependent`:
            dependents.push(orderedStyle.styleIr);
            break;
        }
      }
    }

    if (dependents.length > 0) {
      for (const dependent of dependents) {
        const error = dependent.complete(style);
        if (error) {
          warn(error);
        }
      }
    }

    if (userStyle) {
      style = { ...style, ...userStyle };
    }

    // cache the full set of classes for future re-renders
    cache.setStyle(joined, style);
    return style;
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
