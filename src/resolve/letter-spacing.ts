import type { TwTheme } from '../tw-config';
import type { DependentStyle, StyleIR } from '../types';
import { Unit } from '../types';
import {
  parseNumericValue,
  complete,
  toStyleVal,
  unconfiggedStyle,
  warn,
} from '../helpers';

export function letterSpacing(
  value: string,
  isNegative: boolean,
  config?: TwTheme['letterSpacing'],
): StyleIR | null {
  const configValue = config?.[value];
  if (configValue) {
    const parsed = parseNumericValue(configValue, { isNegative });
    if (!parsed) {
      return null;
    }

    const [number, unit] = parsed;
    if (unit === Unit.em) {
      return relativeLetterSpacing(number);
    }

    // @TODO, if we get a percentage based config value, theoretically we could
    // make a font-size dependent style as well, wait for someone to raise an issue
    if (unit === Unit.percent) {
      warn(
        `percentage-based letter-spacing configuration currently unsupported, switch to \`em\`s, or open an issue if you'd like to see support added.`,
      );
      return null;
    }

    const styleVal = toStyleVal(number, unit, { isNegative });
    if (styleVal !== null) {
      return complete({ letterSpacing: styleVal });
    }

    return null;
  }
  return unconfiggedStyle(`letterSpacing`, value, { isNegative });
}

function relativeLetterSpacing(ems: number): DependentStyle {
  return {
    kind: `dependent`,
    complete(style) {
      const fontSize = style.fontSize;
      if (typeof fontSize !== `number` || Number.isNaN(fontSize)) {
        return `tracking-X relative letter spacing classes require font-size to be set`;
      }
      style.letterSpacing = Math.round((ems * fontSize + Number.EPSILON) * 100) / 100;
    },
  };
}
