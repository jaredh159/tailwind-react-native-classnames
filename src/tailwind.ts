import { parseInputs } from './helpers';
import { TailwindFn, TwStyles, RnStyle, ClassInput } from './types';

export default function create(styles: TwStyles): TailwindFn {
  const getStyle = (...inputs: ClassInput[]): RnStyle => {
    let style: RnStyle = {};
    const [classNames, userRnStyle] = parseInputs(inputs);
    let letterSpacingClass: string | null = null;
    classNames.forEach((className) => {
      if (isSupportedFontVariant(className)) {
        addFontVariant(className, style);
      } else if (isLetterSpacingClass(className)) {
        letterSpacingClass = className;
      } else if (styles[className]) {
        style = { ...style, ...styles[className] };
      } else if (shouldWarn()) {
        console.warn(`\`${className}\` is not a valid Tailwind class name`);
      }
    });
    if (letterSpacingClass) {
      addLetterSpacing(letterSpacingClass, style, styles);
    }
    return { ...replaceVariables(style), ...userRnStyle };
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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

function isLetterSpacingClass(className: string): boolean {
  return !!className.match(/^tracking-(tighter|tight|normal|wide|wider|widest)$/);
}

function isSupportedFontVariant(className: string): boolean {
  return !!className.match(/^(oldstyle|lining|tabular|proportional)-nums$/);
}

function addLetterSpacing(
  letterSpacingClass: string,
  style: RnStyle,
  styles: TwStyles,
): void {
  if (`fontSize` in style === false) {
    warn(`\`tracking-<x>\` classes require font-size to be set`);
    return;
  }

  const fontSize = style.fontSize;
  if (typeof fontSize !== `number` || Number.isNaN(fontSize)) {
    // should never happen
    return;
  }

  const letterSpacingValue = styles[letterSpacingClass]?.letterSpacing;
  if (typeof letterSpacingValue !== `string`) {
    // should never happen
    return;
  }

  const emVal = Number.parseFloat(letterSpacingValue);
  const pxVal = emVal * fontSize;
  style.letterSpacing = Math.round((pxVal + Number.EPSILON) * 100) / 100;
}

function warn(msg: string): void {
  if (!shouldWarn()) {
    return;
  }
  console.warn(msg);
}

function shouldWarn(): boolean {
  return process?.env?.JEST_WORKER_ID === undefined;
}

function addFontVariant(variant: string, style: RnStyle): void {
  if (Array.isArray(style.fontVariant)) {
    style.fontVariant.push(variant);
  } else {
    style.fontVariant = [variant];
  }
}
