import { TwTheme } from '../tw-config';
import { DependentStyle, error, StyleIR, Unit } from '../types';
import { parseNumericValue, unconfiggedStyle } from './helpers';

export function letterSpacing(
  value: string,
  isNegative: boolean,
  config?: TwTheme['letterSpacing'],
): StyleIR {
  const configValue = config?.[value];
  if (configValue) {
    const parseConfig = parseNumericValue(configValue);
    if (!parseConfig.success) {
      return error(parseConfig.error);
    }
    const [number, unit] = parseConfig.value;
    if (unit === Unit.em) {
      return relativeLetterSpacing(number);
    }
  }
  return unconfiggedStyle(`letterSpacing`, value, isNegative);
}

function relativeLetterSpacing(ems: number): DependentStyle {
  return {
    kind: `dependent`,
    complete(style) {
      const fontSize = style.fontSize;
      if (typeof fontSize !== `number` || Number.isNaN(fontSize)) {
        // @TODO: warn, relative letter spacing needs font size set
        return;
      }
      style.letterSpacing = Math.round((ems * fontSize + Number.EPSILON) * 100) / 100;
    },
  };
}
