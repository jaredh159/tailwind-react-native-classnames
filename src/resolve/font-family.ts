import { TwTheme } from '../tw-config';
import { complete, StyleIR } from '../types';

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

  const firstFamily = configValue.shift();
  if (!firstFamily) {
    return null;
  }

  return complete({ fontFamily: firstFamily });
}
