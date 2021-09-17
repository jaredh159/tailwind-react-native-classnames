import { TwTheme } from '../tw-config';
import { error, Unit, StyleIR } from '../types';
import { parseNumericValue, toStyleVal } from '../helpers';

export default function lineHeight(
  value: string,
  config?: TwTheme['lineHeight'],
): StyleIR {
  if (!config) {
    return error(`Unexpected missing line height theme config`);
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

  return {
    kind: `complete`,
    style: { lineHeight: toStyleVal(number, unit) },
  };
}
