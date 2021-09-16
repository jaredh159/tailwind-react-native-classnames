import { TwTheme } from '../tw-config';
import { error, complete, StyleIR } from '../types';

export default function fontFamily(
  config?: TwTheme['fontFamily'],
  value?: string,
): StyleIR {
  if (!config) {
    return error(`Unexpected missing font family theme config`);
  }

  if (!value) {
    return error(`Unexpected missing value for font family`);
  }

  const configValue = config[value];
  if (!configValue) {
    return error(`Missing font family info for family: \`${value}\``);
  }

  if (typeof configValue === `string`) {
    return complete({ fontaFamily: configValue });
  }

  const firstFamily = configValue.shift();
  if (!firstFamily) {
    return error(`Unexpected empty font stack for ${value}`);
  }

  return complete({ fontFamily: firstFamily });
}
