import type { TwTheme } from '../tw-config';
import type { StyleIR } from '../types';
import { Unit } from '../types';
import { parseNumericValue, complete, toStyleVal } from '../helpers';

export default function lineHeight(
  value: string,
  config?: TwTheme['lineHeight'],
): StyleIR | null {
  const parseValue =
    config?.[value] ?? (value.startsWith(`[`) ? value.slice(1, -1) : value);

  const parsed = parseNumericValue(parseValue);
  if (!parsed) {
    return null;
  }

  const [number, unit] = parsed;
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
