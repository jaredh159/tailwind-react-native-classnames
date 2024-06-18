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
import resolveLineHeight from './line-height';

export default function fontSize(
  value: string,
  config?: TwTheme,
  context: ParseContext = {},
): StyleIR | null {
  if (value.includes(`/`)) {
    const [fontSizeValue = ``, lineHeightValue = ``] = value.split(`/`, 2);
    const lh = resolveLineHeight(lineHeightValue, config?.lineHeight);
    const fs = fontSize(fontSizeValue, config, context);
    if (fs?.kind === `complete` && lh?.kind === `complete`) {
      return {
        kind: `complete`,
        style: { ...fs.style, ...lh.style },
      };
    }
  }

  const configValue = config?.fontSize?.[value];
  if (!configValue) {
    return unconfiggedStyle(`fontSize`, value, context);
  }

  if (typeof configValue === `string`) {
    return getCompleteStyle(`fontSize`, configValue);
  }

  let style: Style = {};
  const [sizePart, otherProps] = configValue;
  const fontSizeStyle = getStyle(`fontSize`, sizePart);
  if (fontSizeStyle) {
    style = fontSizeStyle;
  }

  if (typeof otherProps === `string`) {
    return complete(
      mergeStyle(`lineHeight`, calculateLineHeight(otherProps, style), style),
    );
  }

  const { lineHeight, letterSpacing } = otherProps;
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
