import { TwTheme } from '../tw-config';
import { Style, error, complete, StyleIR } from '../types';
import { mergeNumericValue } from './helpers';

export default function fontSize(config?: TwTheme['fontSize'], value?: string): StyleIR {
  if (!config) {
    return error(`Unexpected missing font size theme config`);
  }
  if (!value) {
    return error(`Unexpected missing value for font size`);
  }

  const configValue = config[value];
  if (!configValue) {
    return error(`Missing font size info for size: \`${value}\``);
  }

  let errorMsg: string | undefined;
  const style: Style = {};
  if (typeof configValue === `string`) {
    errorMsg = mergeNumericValue(`fontSize`, configValue, style);
    return errorMsg ? error(errorMsg) : complete(style);
  }

  const [fontSize, rest] = configValue;
  if (typeof fontSize !== `string`) {
    return error(`Unexpected fontSize config format`);
  }

  errorMsg = mergeNumericValue(`fontSize`, fontSize, style);
  if (errorMsg) return error(errorMsg);

  if (typeof rest === `string`) {
    errorMsg = mergeNumericValue(`lineHeight`, rest, style);
    return errorMsg ? error(errorMsg) : complete(style);
  }

  const { lineHeight, letterSpacing } = rest;
  if (lineHeight) {
    errorMsg = mergeNumericValue(`lineHeight`, lineHeight, style);
    if (errorMsg) return error(errorMsg);
  }

  if (letterSpacing) {
    errorMsg = mergeNumericValue(`letterSpacing`, letterSpacing, style);
    if (errorMsg) return error(errorMsg);
  }

  return complete(style);
}
