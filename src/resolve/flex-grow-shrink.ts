import { TwTheme } from '../tw-config';
import { StyleIR } from '../types';
import { complete } from '../helpers';

export default function flexGrowShrink(
  type: 'Grow' | 'Shrink',
  value: string,
  config?: TwTheme['flexGrow'] | TwTheme['flexShrink'],
): StyleIR | null {
  value = value.replace(/^-/, ``);
  const configKey = value === `` ? `DEFAULT` : value;
  const numericValue = Number(config?.[configKey] ?? value);
  if (!Number.isNaN(numericValue)) {
    return complete({ [`flex${type}`]: numericValue });
  }
  return null;
}
