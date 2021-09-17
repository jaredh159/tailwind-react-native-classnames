import { error, StyleIR } from '../types';
import { parseNumericValue } from '../helpers';

export function aspectRatio(numericValue: string): StyleIR {
  const parseResult = parseNumericValue(numericValue, true);
  if (!parseResult.success) {
    return error(parseResult.error);
  }
  return {
    kind: `complete`,
    style: {
      aspectRatio: parseResult.value[0],
    },
  };
}
