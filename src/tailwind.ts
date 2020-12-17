import { parseInputs } from './helpers';
import { TailwindFn, Styles, ClassInput } from './types';

function create(styles: Styles): TailwindFn {
  const getStyle = (...inputs: ClassInput[]) => {
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

  const tailwind = (strings: TemplateStringsArray, ...values: (string | number)[]) => {
    let str = ``;
    strings.forEach((string, i) => {
      str += string + (values[i] || ``);
    });
    return getStyle(str);
  };

  tailwind.style = getStyle;
  tailwind.color = (color: string) => {
    const style = getStyle(`bg-${color}`);
    return typeof style.backgroundColor === `string` ? style.backgroundColor : undefined;
  };

  return tailwind;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tailwind = create(require(`../tw-rn-styles.json`));
export default tailwind;

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
