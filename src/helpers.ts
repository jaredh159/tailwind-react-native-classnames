import { Result } from 'x-ts-utils';
import { Unit, fail, Style, Direction, CompleteStyle, complete } from './types';

export function parseNumericValue(
  value: string,
  fractions = false,
): Result<[number, Unit]> {
  if (fractions && value.includes(`/`)) {
    const [numerator = ``, denominator = ``] = value.split(`/`, 2);
    const parsedNumerator = parseNumericValue(numerator);
    const parsedDenominator = parseNumericValue(denominator);
    if (!parsedNumerator.success || !parsedDenominator.success) {
      return fail(`Invalid value: ${value}`);
    }
    return {
      success: true,
      value: [
        parsedNumerator.value[0] / parsedDenominator.value[0],
        parsedDenominator.value[1],
      ],
    };
  }

  const number = parseFloat(value);
  if (Number.isNaN(number)) {
    return fail(`Invalid value: ${value}`);
  }

  const match = value.match(/(([a-z]{2,}|%))$/);
  if (!match) {
    return { success: true, value: [number, Unit.none] };
  }

  switch (match?.[1]) {
    case `rem`:
      return { success: true, value: [number, Unit.rem] };
    case `px`:
      return { success: true, value: [number, Unit.px] };
    case `em`:
      return { success: true, value: [number, Unit.em] };
    case `%`:
      return { success: true, value: [number, Unit.percent] };
    default:
      return fail(`Unknown/missing css unit: ${value}`);
  }
}

export function getCompleteStyle(
  prop: string,
  value: string | number | undefined,
  isNegative = false,
  fractions = false,
): CompleteStyle | null {
  const styleVal = parseStyleVal(value, isNegative, fractions);
  return styleVal === null ? null : complete({ [prop]: styleVal });
}

export function mergeStyle(
  prop: string,
  value: string | number | undefined,
  style: Style,
): Style {
  const styleVal = parseStyleVal(value);
  if (styleVal !== null) {
    style[prop] = styleVal;
  }
  return style;
}

export function getStyle(prop: string, value: string | number | undefined): Style | null {
  const styleVal = parseStyleVal(value);
  return styleVal === null ? null : { [prop]: styleVal };
}

export function parseStyleVal(
  value: string | number | undefined,
  isNegative = false,
  fractions = false,
): null | string | number {
  if (value === undefined) {
    return null;
  }
  const parsed = parseNumericValue(String(value), fractions);
  if (parsed.success) {
    return toStyleVal(...parsed.value, isNegative);
  } else {
    return null;
  }
}

export function toStyleVal(
  number: number,
  unit: Unit,
  isNegative = false,
): string | number {
  switch (unit) {
    case Unit.rem:
      return number * 16 * (isNegative ? -1 : 1);
    case Unit.px:
      return number * (isNegative ? -1 : 1);
    case Unit.percent:
      return `${isNegative ? `-` : ``}${number}%`;
    case Unit.none:
      return number * (isNegative ? -1 : 1);
    default:
      // @TODO return null instead of throw...
      throw new Error(`Unimplemented toStyleVal() unit: ${unit}`);
  }
}

export function toPx(value: string): number | undefined {
  const parseResult = parseNumericValue(value);
  if (!parseResult.success) {
    return undefined;
  }
  const [number, unit] = parseResult.value;
  switch (unit) {
    case Unit.rem:
      return number * 16;
    case Unit.px:
      return number;
    default:
      return undefined;
  }
}

const DIR_MAP: Record<string, Direction> = {
  t: `Top`,
  tr: `TopRight`,
  tl: `TopLeft`,
  b: `Bottom`,
  br: `BottomRight`,
  bl: `BottomLeft`,
  l: `Left`,
  r: `Right`,
  x: `Horizontal`,
  y: `Vertical`,
};

export function getDirection(string?: string): Direction {
  return DIR_MAP[string ?? ``] || `All`;
}

export function parseAndConsumeDirection(utilityFragment: string): [string, Direction] {
  let direction: Direction = `All`;
  const consumed = utilityFragment.replace(/^-(t|b|r|l|tr|tl|br|bl)(-|$)/, (_, dir) => {
    direction = getDirection(dir);
    return ``;
  });
  return [consumed, direction];
}

export function parseUnconfigged(
  value: string,
  isNegative = false,
): string | number | null {
  if (value.includes(`/`)) {
    const style = unconfiggedStyleVal(value, isNegative, true);
    if (style) return style;
  }
  if (value[0] === `[`) {
    value = value.slice(1, -1);
  }
  return unconfiggedStyleVal(value, isNegative);
}

export function unconfiggedStyle(
  prop: string,
  value: string,
  isNegative = false,
): CompleteStyle | null {
  const styleVal = parseUnconfigged(value, isNegative);
  if (styleVal === null) {
    return null;
  }
  return complete({ [prop]: styleVal });
}

function unconfiggedStyleVal(
  value: string,
  isNegative: boolean,
  parseFraction = false,
): string | number | null {
  if (value === `px`) {
    return 1;
  }

  const parsed = parseNumericValue(value, parseFraction);
  if (!parsed.success) {
    return null;
  }

  let [number, unit] = parsed.value;
  if (parseFraction) {
    unit = Unit.percent;
    number *= 100;
  }

  // not sure if this is the right approach, but this allows arbitrary
  // non-bracket numbers, like top-73 and it INFERS the meaning to be
  // tailwind's default scale for inset, which is 1 = 0.25rem
  if (unit === Unit.none) {
    number = number / 4;
    unit = Unit.rem;
  }

  return toStyleVal(number, unit, isNegative);
}

function consoleWarn(...args: any[]): void {
  console.warn(...args);
}

function noopWarn(..._: any[]): void {
  // ¯\_(ツ)_/¯
}

export const warn: (...args: any[]) => void =
  process?.env?.JEST_WORKER_ID === undefined ? consoleWarn : noopWarn;
