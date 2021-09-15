import { parseInputs } from './helpers';
import { TailwindFn, ConfigStyles, Style, ClassInput } from './types';

export default function create(styles: ConfigStyles): TailwindFn {
  const getStyle = (...inputs: ClassInput[]): Style => {
    let style: Style = {};
    const [classNames, userRnStyle] = parseInputs(inputs);
    let letterSpacingClass: string | null = null;
    classNames.forEach((className) => {
      if (isSupportedFontVariant(className)) {
        addFontVariant(className, style);
      } else if (isBoxShadowClass(className)) {
        addBoxShadow(className, style);
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
    const prefixed = color
      .split(/\s+/)
      .map((util) => `bg-${util}`)
      .join(` `);
    const style = getStyle(prefixed);
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
  style: Style,
  styles: ConfigStyles,
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

function addFontVariant(variant: string, style: Style): void {
  if (Array.isArray(style.fontVariant)) {
    style.fontVariant.push(variant);
  } else {
    style.fontVariant = [variant];
  }
}

function isBoxShadowClass(className: string): className is keyof typeof boxShadowMap {
  return className in boxShadowMap;
}

function addBoxShadow(className: string, style: Style): void {
  if (isBoxShadowClass(className)) {
    const shadow = boxShadowMap[className];
    style.shadowOffset = { width: 1, height: 1 };
    style.shadowColor = `#000`;
    style.shadowOpacity = shadow.opacity;
    style.shadowRadius = shadow.radius;
    style.elevation = shadow.elevation;
    if (className === `shadow-none`) {
      style.shadowOffset = { width: 0, height: 0 };
    }
  }
}

const boxShadowMap = {
  'shadow-sm': {
    radius: 1,
    opacity: 0.025,
    elevation: 1,
  },
  shadow: {
    radius: 1,
    opacity: 0.075,
    elevation: 2,
  },
  'shadow-md': {
    radius: 3,
    opacity: 0.125,
    elevation: 3,
  },
  'shadow-lg': {
    radius: 8,
    opacity: 0.15,
    elevation: 8,
  },
  'shadow-xl': {
    radius: 20,
    opacity: 0.19,
    elevation: 12,
  },
  'shadow-2xl': {
    radius: 30,
    opacity: 0.25,
    elevation: 16,
  },
  'shadow-none': {
    radius: 0,
    opacity: 0.0,
    elevation: 0,
  },
};
