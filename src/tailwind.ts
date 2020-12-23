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

function isBoxShadowClass(className: string): className is keyof typeof boxShadowMap {
  return className in boxShadowMap;
}

function addBoxShadow(className: string, style: RnStyle): void {
  if (isBoxShadowClass(className)) {
    const shadow = boxShadowMap[className];
    style.shadowOffset = {
      width: 0,
      height: shadow.offsetHeight,
    };
    style.shadowRadius = shadow.radius;
    style.shadowColor = `rgba(0, 0, 0, ${shadow.colorOpacity})`;
    style.shadowOpacity = 1;
    style.elevation = shadow.elevation;
  }
}

const boxShadowMap = {
  'shadow-sm': {
    offsetHeight: 1,
    radius: 2,
    colorOpacity: 0.05,
    elevation: 1,
  },
  shadow: {
    offsetHeight: 1,
    radius: 3,
    colorOpacity: 0.1,
    elevation: 2,
  },
  'shadow-md': {
    offsetHeight: 4,
    radius: 6,
    colorOpacity: 0.1,
    elevation: 3,
  },
  'shadow-lg': {
    offsetHeight: 10,
    radius: 15,
    colorOpacity: 0.1,
    elevation: 4,
  },
  'shadow-xl': {
    offsetHeight: 20,
    radius: 25,
    colorOpacity: 0.1,
    elevation: 5,
  },
  'shadow-2xl': {
    offsetHeight: 25,
    radius: 50,
    colorOpacity: 0.25,
    elevation: 6,
  },
  'shadow-none': {
    offsetHeight: 0,
    radius: 0,
    colorOpacity: 0.0,
    elevation: 0,
  },
};
