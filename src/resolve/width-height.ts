import type { TwTheme } from '../tw-config';
import type { ParseContext, StyleIR } from '../types';
import { getCompleteStyle, complete, parseStyleVal, unconfiggedStyle } from '../helpers';

export function widthHeight(
  type: 'width' | 'height',
  value: string,
  context: ParseContext = {},
  config?: TwTheme['width'] | TwTheme['height'],
): StyleIR | null {
  const configValue = config?.[value];
  if (configValue !== undefined) {
    return getCompleteStyle(type, configValue, context);
  }

  return unconfiggedStyle(type, value, context);
}

export function minMaxWidthHeight(
  type: 'minWidth' | 'minHeight' | 'maxWidth' | 'maxHeight',
  value: string,
  context: ParseContext = {},
  config?: Record<string, string>,
): StyleIR | null {
  const styleVal = parseStyleVal(config?.[value], context);
  if (styleVal) {
    return complete({ [type]: styleVal });
  }

  if (value === `screen`) {
    value = type.includes(`Width`) ? `100vw` : `100vh`;
  }

  return unconfiggedStyle(type, value, context);
}
