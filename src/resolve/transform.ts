import type { TwTheme } from '../tw-config';
import type { DependentStyle, ParseContext, Style, StyleIR } from '../types';
import { isString, Unit } from '../types';
import {
  complete,
  parseNumericValue,
  parseStyleVal,
  parseUnconfigged,
  toStyleVal,
} from '../helpers';

const originPositions = [`left`, `center`, `right`, `top`, `bottom`];

type Axis = `x` | `y` | `z` | ``;
type Property = `scale` | `rotate` | `skew` | `translate`;
type OriginPosition = (typeof originPositions)[number];

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

  // using percentage values (non-numeric values) causes an error
  // if used in versions earlier than RN 0.75
  if (
    styleVal === null ||
    (isString(styleVal) &&
      context.reactNativeVersion &&
      context.reactNativeVersion.major === 0 &&
      context.reactNativeVersion.minor < 75)
  ) {
    return null;
  }

  return createStyle(styleVal, `translate`, translateAxis);
}

export function transformNone(): StyleIR {
  return {
    kind: `dependent`,
    complete(style) {
      style.transform = [];
    },
  };
}

export function origin(
  value: string,
  context: ParseContext = {},
  config?: TwTheme['transformOrigin'],
): StyleIR | null {
  const configValue = config?.[value];

  if (configValue) {
    return complete({ transformOrigin: configValue });
  }

  if (!isArbitraryValue(value)) {
    return null;
  }

  const values = value.slice(1, -1).split(`_`);

  if (values.length === 0 || values.length > 3) {
    return null;
  }

  // the first value must be one of the positions, a percentage or a pixel value
  const firstOriginValue = parseOriginValue(
    values[0],
    originPositions,
    [Unit.px, Unit.percent],
    context,
  );

  if (firstOriginValue === null) {
    return null;
  }

  const origin = [firstOriginValue];

  if (values.length >= 2) {
    // the second value must a position different from the first or `center`, a percentage or a pixel value
    const secondOriginValue = parseOriginValue(
      values[1],
      originPositions.filter(
        (position) => position === `center` || position !== firstOriginValue,
      ),
      [Unit.px, Unit.percent],
      context,
    );

    if (secondOriginValue === null) {
      return null;
    }

    origin.push(secondOriginValue);
  }

  if (values.length === 3) {
    // the third value must be a pixel value
    const thirdOriginValue = parseOriginValue(values[2], [], [Unit.px], context);

    if (thirdOriginValue === null) {
      return null;
    }

    origin.push(thirdOriginValue);
  }

  return complete({
    transformOrigin: origin.join(` `),
  });
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

function parseOriginValue(
  value: string | undefined,
  allowedPositions: OriginPosition[],
  allowedUnits: Unit[],
  context: ParseContext = {},
): string | null {
  if (!value) {
    return null;
  }

  if (allowedPositions.includes(value)) {
    return value;
  }

  const parsedValue = parseNumericValue(value, context);

  return parsedValue === null || !allowedUnits.includes(parsedValue[1])
    ? null
    : `${parsedValue[0] * (context.isNegative ? -1 : 1)}${parsedValue[1]}`;
}
