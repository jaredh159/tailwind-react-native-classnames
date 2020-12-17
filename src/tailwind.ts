import { ViewStyle, TextStyle, Platform } from 'react-native';
import { parseInputs } from './helpers';
import { TailwindFn, ConfigStyles, ClassInput, TailwindColorFn } from './types';

function makeTw(styles: ConfigStyles): TailwindFn {
  const fn = (...inputs: ClassInput[]) => {
    let rnStyleObj: { [key: string]: string | number } = {};
    const [classNames, rnStyles] = parseInputs(inputs);
    classNames.forEach((className) => {
      if (styles[className]) {
        rnStyleObj = { ...rnStyleObj, ...styles[className] };
      } else if (process?.env?.JEST_WORKER_ID === undefined) {
        console.warn(`\`${className}\` is not a valid Tailwind class name`);
      }
    });
    return { ...replaceVariables(rnStyleObj), ...rnStyles };
  };

  fn.t = (strings: TemplateStringsArray, ...values: (string | number)[]) => {
    let str = ``;
    strings.forEach((string, i) => {
      str += string + (values[i] || ``);
    });
    return fn(str);
  };

  return fn;
}

function create(
  configStyles: ConfigStyles,
): [tailwind: TailwindFn, getColor: TailwindColorFn] {
  const tw = makeTw(configStyles);
  return [
    tw,
    (colorSlug) => {
      const style = tw(`bg-${colorSlug}`);
      return typeof style.backgroundColor === `string`
        ? style.backgroundColor
        : undefined;
    },
  ];
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const [baseTailwind, baseGetColor] = create(require(`../tw-rn-styles.json`));

export default baseTailwind;
const t = baseTailwind.t;
export { baseGetColor as getColor, create, t };

function replaceVariables(styles: Record<string, any>): Record<string, any> {
  const merged: Record<string, any> = {};
  for (const [key, value] of Object.entries(styles)) {
    if (typeof value === `string` && value.includes(`var(--`)) {
      merged[key] = value.replace(/var\(([a-z-]+)\)/, (_, varName) => styles[varName]);
    } else if (!key.startsWith(`--`)) {
      merged[key] = value;
    }
  }
  return merged;
}
