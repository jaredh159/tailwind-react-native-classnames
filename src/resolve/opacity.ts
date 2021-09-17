import { TwTheme } from '../tw-config';
import { complete, error, StyleIR } from '../types';
import { parseNumericValue } from '../helpers';

export function opacity(value: string, config?: TwTheme['opacity']): StyleIR {
  const configValue = config?.[value];
  if (configValue) {
    const configResult = parseNumericValue(String(configValue));
    if (configResult.success) {
      return complete({ opacity: configResult.value[0] });
    }
  }
  const arbitraryResult = parseNumericValue(value);
  if (arbitraryResult.success) {
    return complete({ opacity: arbitraryResult.value[0] / 100 });
  }
  return error(`failed to parse opacity-${value}`);
}
