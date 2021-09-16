import { TwTheme } from '../tw-config';
import { complete, StyleIR } from '../types';

export default function flexGrowShrink(
  type: 'Grow' | 'Shrink',
  value: string,
  config?: TwTheme['flexGrow'] | TwTheme['flexShrink'],
): StyleIR {
  value = value.replace(/^-/, ``);
  const configKey = value === `` ? `DEFAULT` : value;
  const numericValue = Number(config?.[configKey] ?? value);
  if (!Number.isNaN(numericValue)) {
    return complete({ [`flex${type}`]: numericValue });
  }
  return { kind: `null` };
}
