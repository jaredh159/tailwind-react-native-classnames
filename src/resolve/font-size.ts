import type { TwTheme } from '../tw-config';
import type { ParseContext, Style, StyleIR } from '../types';
import { Unit } from '../types';
import {
  getCompleteStyle,
  complete,
  getStyle,
  mergeStyle,
  parseNumericValue,
  unconfiggedStyle,
} from '../helpers';

export default function fontSize(
  value: string,
  config?: TwTheme['fontSize'],
  context: ParseContext = {},
): StyleIR | null {
  const configValue = config?.[value];
  if (!configValue) {
    return unconfiggedStyle(`fontSize`, value, context);
  }

  if (typeof configValue === `string`) {
    return getCompleteStyle(`fontSize`, configValue);
  }

  let style: Style = {};
  const [fontSize, rest] = configValue;
  const fontSizeStyle = getStyle(`fontSize`, fontSize);
  if (fontSizeStyle) {
    style = fontSizeStyle;
  }

  if (typeof rest === `string`) {
    return complete(mergeStyle(`lineHeight`, calculateLineHeight(rest, style), style));
  }

  const { lineHeight, letterSpacing } = rest;
  if (lineHeight) {
    mergeStyle(`lineHeight`, calculateLineHeight(lineHeight, style), style);
  }

  if (letterSpacing) {
    mergeStyle(`letterSpacing`, letterSpacing, style);
  }

  return complete(style);
}

// calculates line-height for relative units
function calculateLineHeight(lineHeight: string, style: Style): number | string {
  const parsed = parseNumericValue(lineHeight);
  if (parsed) {
    const [number, unit] = parsed;
    if ((unit === Unit.none || unit === Unit.em) && typeof style.fontSize === `number`) {
      return style.fontSize * number;
    }
  }
  return lineHeight;
}
