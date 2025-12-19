import type { StyleIR } from '../types';
import type { TwTheme } from '../tw-config';
import { complete, parseStyleVal, parseUnconfigged } from '../helpers';

const ALLOWED_STYLE_VALUES = [`dotted`, `dashed`];
export function outlineStyle(value: string): StyleIR | null {
  if (!ALLOWED_STYLE_VALUES.includes(value)) return null;

  return complete({
    outlineStyle: value,
  });
}

export function outlineWidth(
  value: string,
  config?: TwTheme['outlineWidth'],
): StyleIR | null {
  const configValue = config?.[value];

  if (configValue) {
    const parsedConfigValue = parseStyleVal(configValue);
    if (parsedConfigValue !== null) {
      return complete({
        outlineWidth: parsedConfigValue,
      });
    }
  }

  const parsedValue = parseUnconfigged(value);
  if (parsedValue !== null) {
    return complete({
      outlineWidth: parsedValue,
    });
  }

  return null;
}

export function outlineOffset(
  value: string,
  isNegative: boolean,
  config?: TwTheme['outlineOffset'],
): StyleIR | null {
  const configValue = config?.[value];

  if (configValue) {
    const parsedConfigValue = parseStyleVal(configValue);
    if (parsedConfigValue !== null) {
      return complete({
        outlineOffset: isNegative ? -parsedConfigValue : parsedConfigValue,
      });
    }
  }

  const parsedValue = parseUnconfigged(value);
  if (parsedValue !== null) {
    return complete({
      outlineOffset: isNegative ? -parsedValue : parsedValue,
    });
  }

  return null;
}
