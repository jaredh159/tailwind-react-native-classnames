import type { TwTheme } from '../tw-config';
import type { StyleIR } from '../types';
import { complete, parseStyleVal, parseUnconfigged } from '../helpers';

type Inset = 'bottom' | 'top' | 'left' | 'right' | 'inset';
type InsetDir = null | 'x' | 'y';

export function inset(
  type: Inset,
  value: string,
  isNegative: boolean,
  config?: TwTheme['inset'],
): StyleIR | null {
  let insetDir: InsetDir = null;
  if (type === `inset`) {
    value = value.replace(/^(x|y)-/, (_, dir) => {
      insetDir = dir === `x` ? `x` : `y`;
      return ``;
    });
  }

  if (value === `auto`) {
    return insetStyle(type, insetDir, value);
  }

  const configValue = config?.[value];
  if (configValue) {
    const styleVal = parseStyleVal(configValue, { isNegative });
    if (styleVal !== null) {
      return insetStyle(type, insetDir, styleVal);
    }
  }

  const unconfigged = parseUnconfigged(value, { isNegative });
  if (unconfigged !== null) {
    return insetStyle(type, insetDir, unconfigged);
  }

  return null;
}

function insetStyle(type: Inset, dir: InsetDir, styleVal: string | number): StyleIR {
  if (type !== `inset`) {
    return complete({ [type]: styleVal });
  }

  switch (dir) {
    case null:
      return complete({
        top: styleVal,
        left: styleVal,
        right: styleVal,
        bottom: styleVal,
      });
    case `y`:
      return complete({
        top: styleVal,
        bottom: styleVal,
      });
    case `x`:
      return complete({
        left: styleVal,
        right: styleVal,
      });
  }
}
