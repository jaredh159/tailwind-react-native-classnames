import { TwTheme } from '../tw-config';
import { Direction, Unit, StyleIR } from '../types';
import { parseNumericValue, toStyleVal } from '../helpers';

export default function spacing(
  type: 'margin' | 'padding',
  direction: Direction,
  isNegative: boolean,
  value: string,
  config?: TwTheme['margin'] | TwTheme['padding'],
): StyleIR | null {
  let numericValue = ``;
  if (value[0] === `[`) {
    numericValue = value.slice(1, -1);
  } else {
    const configValue = config?.[value];
    if (!configValue) {
      return null;
    }
    numericValue = configValue;
  }

  const parsed = parseNumericValue(numericValue);
  if (!parsed) {
    return null;
  }

  let [number, unit] = parsed;
  if (isNegative) {
    number = -number;
  }

  return spacingStyle(number, unit, direction, type);
}

function spacingStyle(
  number: number,
  unit: Unit,
  direction: Direction,
  type: 'margin' | 'padding',
): StyleIR | null {
  const pixels = toStyleVal(number, unit);
  switch (direction) {
    case `All`:
      return {
        kind: `complete`,
        style: {
          [`${type}Top`]: pixels,
          [`${type}Right`]: pixels,
          [`${type}Bottom`]: pixels,
          [`${type}Left`]: pixels,
        },
      };
    case `Bottom`:
    case `Top`:
    case `Left`:
    case `Right`:
      return {
        kind: `complete`,
        style: {
          [`${type}${direction}`]: pixels,
        },
      };
    case `Vertical`:
      return {
        kind: `complete`,
        style: {
          [`${type}Top`]: pixels,
          [`${type}Bottom`]: pixels,
        },
      };
    case `Horizontal`:
      return {
        kind: `complete`,
        style: {
          [`${type}Left`]: pixels,
          [`${type}Right`]: pixels,
        },
      };
    default:
      return null;
  }
}
