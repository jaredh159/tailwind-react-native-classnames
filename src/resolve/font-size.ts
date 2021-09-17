import { TwTheme } from '../tw-config';
import { Style, StyleIR } from '../types';
import { getCompleteStyle, complete, getStyle, mergeStyle } from '../helpers';

export default function fontSize(
  value: string,
  config?: TwTheme['fontSize'],
): StyleIR | null {
  const configValue = config?.[value];
  if (!configValue) {
    return null;
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
    return complete(mergeStyle(`lineHeight`, rest, style));
  }

  const { lineHeight, letterSpacing } = rest;
  if (lineHeight) {
    mergeStyle(`lineHeight`, lineHeight, style);
  }

  if (letterSpacing) {
    mergeStyle(`letterSpacing`, letterSpacing, style);
  }

  return complete(style);
}
