import { TwTheme } from '../tw-config';
import { Direction, Unit, StyleIR } from '../types';
import { parseNumericValue, parseUnconfigged, toStyleVal } from '../helpers';

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
      const unconfigged = parseUnconfigged(value);
      if (unconfigged && typeof unconfigged === `number`) {
        return spacingStyle(unconfigged, Unit.px, direction, type);
      }
      return null;
    } else {
      numericValue = configValue;
    }
  }

  if (numericValue === `auto`) {
    return expand(direction, type, `auto`);
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
  if (pixels === null) {
    return null;
  }
  return expand(direction, type, pixels);
}

function expand(
  direction: Direction,
  type: 'margin' | 'padding',
  value: number | string,
): StyleIR | null {
  switch (direction) {
    case `All`:
      return {
        kind: `complete`,
        style: {
          [`${type}Top`]: value,
          [`${type}Right`]: value,
          [`${type}Bottom`]: value,
          [`${type}Left`]: value,
        },
      };
    case `Bottom`:
    case `Top`:
    case `Left`:
    case `Right`:
      return {
        kind: `complete`,
        style: {
          [`${type}${direction}`]: value,
        },
      };
    case `Vertical`:
      return {
        kind: `complete`,
        style: {
          [`${type}Top`]: value,
          [`${type}Bottom`]: value,
        },
      };
    case `Horizontal`:
      return {
        kind: `complete`,
        style: {
          [`${type}Left`]: value,
          [`${type}Right`]: value,
        },
      };
    default:
      return null;
  }
}
