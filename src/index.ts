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

  const cache = new Cache();
  let cacheGroup = deriveCacheGroup();

  function style(...inputs: ClassInput[]): Style {
    let style: Style = {};
    const dependents: DependentStyle[] = [];
    const ordered: OrderedStyle[] = [];
    const [utilities, userStyle] = parseInputs(inputs);

    const joined = utilities.join(` `);
    const cached = cache.getStyle(cacheGroup, joined);
    if (cached) {
      return cached;
    }

    for (const utility of utilities) {
      let styleIr = cache.getIr(cacheGroup, utility);
      if (!styleIr) {
        const parser = new ClassParser(utility, config, window, colorScheme);
        styleIr = parser.parse();
      }

      switch (styleIr.kind) {
        case `complete`:
          style = { ...style, ...styleIr.style };
          cache.setIr(cacheGroup, utility, styleIr);
          break;
        case `dependent`:
          dependents.push(styleIr);
          break;
        case `ordered`:
          ordered.push(styleIr);
          break;
        case `null`:
          cache.setIr(cacheGroup, utility, styleIr);
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

    cache.setStyle(cacheGroup, joined, style);
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
