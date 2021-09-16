import { TwTheme } from '../tw-config';
import { error, Unit, StyleIR } from '../types';
import { parseNumericValue, numericStyle } from './helpers';

export default function lineHeight(
  config?: TwTheme['lineHeight'],
  value?: string,
): StyleIR {
  if (!config) {
    return error(`Unexpected missing line height theme config`);
  }
  if (!value) {
    return error(`Unexpected missing value for line height`);
  }

  const configValue = config[value];
  if (!configValue) {
    return error(`Missing line height info for size: \`${value}\``);
  }

  const parseValueResult = parseNumericValue(configValue);
  if (!parseValueResult.success) {
    return error(parseValueResult.error);
  }

  const [number, unit] = parseValueResult.value;
  if (unit === Unit.none) {
    // we have a relative line-height like `2` for `leading-loose`
    return {
      kind: `dependent`,
      complete(style) {
        if (typeof style.fontSize === `number`) {
          style.lineHeight = style.fontSize * number;
          return;
        }
        return `relative line-height utilities require that font-size be set`;
      },
    };
  }

  const completeResult = numericStyle(`lineHeight`, number, unit);
  return completeResult.success ? completeResult.value : error(completeResult.error);
}
