import { TwTheme } from '../tw-config';
import { Direction, error, Unit, StyleIR } from '../types';
import { parseNumericValue, toStyleVal } from '../helpers';

export default function spacing(
  type: 'margin' | 'padding',
  direction: Direction,
  isNegative: boolean,
  value: string,
  config?: TwTheme['margin'] | TwTheme['padding'],
): StyleIR {
  if (!config) {
    return error(`Unexpected missing theme.${type} config`);
  }

  let numericValue = ``;
  if (value[0] === `[`) {
    numericValue = value.slice(1, -1);
  } else {
    const configValue = config[value];
    if (!configValue) {
      return error(`Missing ${type} size info for \`${value}\``);
    }
    numericValue = configValue;
  }

  const parsed = parseNumericValue(numericValue);
  if (!parsed.success) {
    return error(parsed.error);
  }

  let [number, unit] = parsed.value;
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
): StyleIR {
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
      return error(`unsupported drection for ${type}`);
  }
}
