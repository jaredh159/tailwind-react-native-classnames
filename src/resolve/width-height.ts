import { TwTheme } from '../tw-config';
import { StyleIR } from '../types';
import { getCompleteStyle, complete, parseStyleVal, unconfiggedStyle } from '../helpers';

export function widthHeight(
  type: 'width' | 'height',
  value: string,
  isNegative: boolean,
  config?: TwTheme['width'] | TwTheme['height'],
): StyleIR | null {
  const configValue = config?.[value];
  if (configValue !== undefined) {
    return getCompleteStyle(type, configValue, isNegative);
  }

  return unconfiggedStyle(type, value, isNegative);
}

export function minMaxWidthHeight(
  type: 'minWidth' | 'minHeight' | 'maxWidth' | 'maxHeight',
  value: string,
  config?: Record<string, string>,
): StyleIR | null {
  const styleVal = parseStyleVal(config?.[value]);
  if (styleVal) {
    return complete({ [type]: styleVal });
  }
  return unconfiggedStyle(type, value);
}
