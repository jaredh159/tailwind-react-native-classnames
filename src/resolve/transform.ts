import type { TwTheme } from '../tw-config';
import type { DependentStyle, ParseContext, Style, StyleIR } from '../types';
import { isString, Unit } from '../types';
import {
  parseNumericValue,
  parseStyleVal,
  parseUnconfigged,
  toStyleVal,
} from '../helpers';

type Axis = `x` | `y` | `z` | ``;
type Property = `scale` | `rotate` | `skew` | `translate`;

export function scale(
  value: string,
  context: ParseContext = {},
  config?: TwTheme['scale'],
): StyleIR | null {
  let scaleAxis: Axis = ``;

  value = value.replace(/^(x|y)-/, (_, axis) => {
    scaleAxis = axis.toUpperCase();
    return ``;
  });

  let styleVal: string | number | null = null;

  if (config?.[value]) {
    styleVal = parseStyleVal(config[value], context);
  } else if (isArbitraryValue(value)) {
    // arbitrary value should use the value as is
    // e.g `scale-[1.5]` should be 1.5
    const parsed = parseNumericValue(value.slice(1, -1));
    styleVal = parsed ? parsed[0] : null;
  } else {
    // unconfigged value should divide value by 100
    // e.g `scale-99` should be 0.99
    const parsed = parseNumericValue(value);
    styleVal = parsed ? parsed[0] / 100 : null;
  }

  return styleVal === null ? null : createStyle(styleVal, `scale`, scaleAxis);
}

export function rotate(
  value: string,
  context: ParseContext = {},
  config?: TwTheme['rotate'],
): StyleIR | null {
  let rotateAxis: Axis = ``;

  value = value.replace(/^(x|y|z)-/, (_, axis) => {
    rotateAxis = axis.toUpperCase();
    return ``;
  });

  let styleVal: string | number | null = null;

  if (config?.[value]) {
    styleVal = parseStyleVal(config[value], context);
  } else if (isArbitraryValue(value)) {
    styleVal = parseUnconfigged(value, context);
  } else {
    // unconfigged value should should be converted to degrees
    // e.g `rotate-99` should be `99deg`
    const parsed = parseNumericValue(value);
    styleVal = parsed ? toStyleVal(parsed[0], Unit.deg, context) : null;
  }

  return styleVal === null ? null : createStyle(styleVal, `rotate`, rotateAxis);
}

export function skew(
  value: string,
  context: ParseContext = {},
  config?: TwTheme['skew'],
): StyleIR | null {
  let skewAxis: Axis = ``;

  value = value.replace(/^(x|y)-/, (_, axis) => {
    skewAxis = axis.toUpperCase();
    return ``;
  });

  if (skewAxis === ``) {
    return null;
  }

  let styleVal: string | number | null = null;

  if (config?.[value]) {
    styleVal = parseStyleVal(config[value], context);
  } else if (isArbitraryValue(value)) {
    styleVal = parseUnconfigged(value, context);
  } else {
    // unconfigged value should should be converted to degrees
    // e.g `skew-x-99` should be `99deg`
    const parsed = parseNumericValue(value);
    styleVal = parsed ? toStyleVal(parsed[0], Unit.deg, context) : null;
  }

  return styleVal === null ? null : createStyle(styleVal, `skew`, skewAxis);
}

export function translate(
  value: string,
  context: ParseContext = {},
  config?: TwTheme['translate'],
): StyleIR | null {
  let translateAxis: Axis = ``;

  value = value.replace(/^(x|y)-/, (_, axis) => {
    translateAxis = axis.toUpperCase();
    return ``;
  });

  if (translateAxis === ``) {
    return null;
  }

  const configValue = config?.[value];

  const styleVal = configValue
    ? parseStyleVal(configValue, context)
    : parseUnconfigged(value, context);

  // support for percentage values in translate was only added in RN 0.75
  // source: https://reactnative.dev/blog/2024/08/12/release-0.75#percentage-values-in-translation
  // since the support of this package starts at RN 0.62.2
  // we need to filter out percentages which are non-numeric values
  return styleVal === null || isString(styleVal)
    ? null
    : createStyle(styleVal, `translate`, translateAxis);
}

export function transformNone(): StyleIR {
  return {
    kind: `dependent`,
    complete(style) {
      style.transform = [];
    },
  };
}

function createStyle(
  styleVal: string | number,
  property: Property,
  axis: Axis,
): DependentStyle {
  return {
    kind: `dependent`,
    complete(style) {
      let transform = (style.transform as Style[]) ?? [];
      const key = `${property}${axis}`;

      if (transform.length > 0) {
        transform = transform.filter((transformItem) => transformItem[key] === undefined);
      }

      transform.push({
        [key]: styleVal,
      });

      style.transform = transform;
    },
  };
}

function isArbitraryValue(value: string): boolean {
  return value.startsWith(`[`) && value.endsWith(`]`);
}
