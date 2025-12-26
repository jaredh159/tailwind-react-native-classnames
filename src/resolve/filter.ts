import type { ParseContext, Style, StyleIR } from '../types';
import type { TwTheme } from '../tw-config';
import { isArbitraryValue, parseNumericValue, parseStyleVal } from '../helpers';

export function filterBrightness(
  value: string,
  context: ParseContext = {},
  config?: TwTheme['brightness'],
): StyleIR | null {
  const styleVal = getBaseFilterStyleValue(value, context, config?.[value]);

  return createStyle(`brightness`, styleVal);
}

export function filterContrast(
  value: string,
  context: ParseContext = {},
  config?: TwTheme['contrast'],
): StyleIR | null {
  const styleVal = getBaseFilterStyleValue(value, context, config?.[value]);

  return createStyle(`contrast`, styleVal);
}

export function filterSaturate(
  value: string,
  context: ParseContext = {},
  config?: TwTheme['saturate'],
): StyleIR | null {
  const styleVal = getBaseFilterStyleValue(value, context, config?.[value]);

  return createStyle(`saturate`, styleVal);
}

export function filterGrayscale(
  value: string,
  context: ParseContext = {},
  config?: TwTheme['grayscale'],
): StyleIR | null {
  const parsed = value.startsWith(`-`) ? value.slice(1) : `100`;
  const styleVal = getPercentageFilterStyleValue(parsed, context, config?.[value]);

  return createStyle(`grayscale`, styleVal);
}

export function filterInvert(
  value: string,
  context: ParseContext = {},
  config?: TwTheme['invert'],
): StyleIR | null {
  const parsed = value.startsWith(`-`) ? value.slice(1) : `100`;
  const styleVal = getPercentageFilterStyleValue(parsed, context, config?.[value]);

  return createStyle(`invert`, styleVal);
}

export function filterSepia(
  value: string,
  context: ParseContext = {},
  config?: TwTheme['sepia'],
): StyleIR | null {
  const parsed = value.startsWith(`-`) ? value.slice(1) : `100`;
  const styleVal = getPercentageFilterStyleValue(parsed, context, config?.[value]);

  return createStyle(`sepia`, styleVal);
}

export function filterHueRotate(
  value: string,
  context: ParseContext = {},
  config?: TwTheme['hueRotate'],
): StyleIR | null {
  const configValue = config?.[value];
  let styleVal: string | number | null;
  if (configValue) {
    styleVal = parseStyleVal(configValue, context);
  } else if (isArbitraryValue(value)) {
    const parsed = parseNumericValue(value.slice(1, -1));
    styleVal = parsed ? `${parsed[0]}${parsed[1]}` : null;
  } else {
    const parsed = parseNumericValue(value);
    styleVal = parsed ? `${parsed[0]}${parsed[1]}` : null;
  }

  return createStyle(`hueRotate`, styleVal);
}

function getBaseFilterStyleValue(
  value: string,
  context: ParseContext = {},
  configValue?: string,
): string | number | null {
  if (configValue) {
    return parseStyleVal(configValue, context);
  } else if (isArbitraryValue(value)) {
    const parsed = parseNumericValue(value.slice(1, -1));
    return parsed ? parsed[0] : null;
  } else {
    const parsed = parseNumericValue(value);
    return parsed ? parsed[0] / 100 : null;
  }
}

function getPercentageFilterStyleValue(
  value: string,
  context: ParseContext = {},
  configValue?: string,
): string | number | null {
  if (configValue) {
    const parsed = parseStyleVal(configValue, context)?.toString().slice(0, -1);
    return parsed ? parseInt(parsed) / 100 : null;
  } else if (isArbitraryValue(value)) {
    const parsed = parseNumericValue(value.slice(1, -1));
    if (parsed === null) {
      return null;
    }
    if (Number.isInteger(parsed[0])) {
      return parsed[0] / 100;
    }
    return parsed[0];
  } else {
    const parsed = parseNumericValue(value);
    if (parsed === null) {
      return null;
    }
    if (Number.isInteger(parsed[0])) {
      return parsed[0] / 100;
    }
    return parsed[0];
  }
}

function createStyle(
  filterType: string,
  styleVal: string | number | null,
): StyleIR | null {
  return {
    kind: `dependent`,
    complete(style) {
      updateFilterStyle(style, filterType, styleVal);
    },
  };
}

function updateFilterStyle(
  style: Style,
  key: string,
  styleVal: string | number | null,
): void {
  if (styleVal === null) {
    return;
  }

  const existingFilter = (style.filter || []) as Style[];
  if (Array.isArray(existingFilter) && existingFilter) {
    style.filter = [...existingFilter, { [key]: styleVal }];
  } else {
    style.filter = existingFilter;
  }
}
