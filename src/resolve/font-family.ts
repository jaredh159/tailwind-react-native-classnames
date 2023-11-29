import type { TwTheme } from '../tw-config';
import type { StyleIR } from '../types';
import { complete } from '../helpers';

export default function fontFamily(
  value: string,
  config?: TwTheme['fontFamily'],
): StyleIR | null {
  const configValue = config?.[value];
  if (!configValue) {
    return null;
  }

  if (typeof configValue === `string`) {
    return complete({ fontFamily: configValue });
  }

  const firstFamily = configValue[0];
  if (!firstFamily) {
    return null;
  }

  return complete({ fontFamily: firstFamily });
}
