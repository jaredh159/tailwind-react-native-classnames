import { TwTheme } from '../tw-config';
import { Unit, StyleIR, complete } from '../types';
import { parseNumericValue, toStyleVal } from '../helpers';

export default function lineHeight(
  value: string,
  config?: TwTheme['lineHeight'],
): StyleIR | null {
  const configValue = config?.[value];
  if (!configValue) {
    return null;
  }

  const parseValueResult = parseNumericValue(configValue);
  if (!parseValueResult.success) {
    return null;
  }

  const [number, unit] = parseValueResult.value;
  if (unit === Unit.none) {
    // we have a relative line-height like `2` for `leading-loose`
    return {
      kind: `dependent`,
      complete(style) {
        if (typeof style.fontSize !== `number`) {
          return `relative line-height utilities require that font-size be set`;
        }
        style.lineHeight = style.fontSize * number;
      },
    };
  }

  const styleVal = toStyleVal(number, unit);
  return styleVal !== null ? complete({ lineHeight: styleVal }) : null;
}
