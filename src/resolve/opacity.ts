import type { TwTheme } from '../tw-config';
import type { StyleIR } from '../types';
import { parseNumericValue, complete } from '../helpers';

export function opacity(value: string, config?: TwTheme['opacity']): StyleIR | null {
  const configValue = config?.[value];
  if (configValue) {
    const parsedConfig = parseNumericValue(String(configValue));
    if (parsedConfig) {
      return complete({ opacity: parsedConfig[0] });
    }
  }
  const parsedArbitrary = parseNumericValue(value);
  if (parsedArbitrary) {
    return complete({ opacity: parsedArbitrary[0] / 100 });
  }

  return null;
}
