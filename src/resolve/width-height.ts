import { TwTheme } from '../tw-config';
import { complete, StyleIR } from '../types';
import { parseStyleVal, unconfiggedStyle } from '../helpers';

export function widthHeight(
  type: 'width' | 'height',
  value: string,
  isNegative: boolean,
  config?: TwTheme['width'] | TwTheme['height'],
): StyleIR {
  const styleVal = parseStyleVal(config?.[value], isNegative);
  if (styleVal) {
    return complete({ [type]: styleVal });
  }

  const err = `failed to parse ${type === `height` ? `h-` : `w-`}${value}`;
  return unconfiggedStyle(type, value, isNegative, err);
}

export function minMaxWidthHeight(
  type: 'minWidth' | 'minHeight' | 'maxWidth' | 'maxHeight',
  value: string,
  config?: Record<string, string>,
): StyleIR {
  const styleVal = parseStyleVal(config?.[value]);
  if (styleVal) {
    return complete({ [type]: styleVal });
  }
  return unconfiggedStyle(type, value);
}
