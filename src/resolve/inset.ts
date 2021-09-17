import { TwTheme } from '../tw-config';
import { complete, error, StyleIR } from '../types';
import { parseNumericValue, parseUnconfigged, toStyleVal } from '../helpers';

type Inset = 'bottom' | 'top' | 'left' | 'right' | 'inset';
type InsetDir = null | 'x' | 'y';

export function inset(
  type: Inset,
  value: string,
  isNegative: boolean,
  config?: TwTheme['inset'],
): StyleIR {
  let insetDir: InsetDir = null;
  if (type === `inset`) {
    value = value.replace(/^(x|y)-/, (_, dir) => {
      insetDir = dir === `x` ? `x` : `y`;
      return ``;
    });
  }

  const configValue = config?.[value];
  if (configValue) {
    const parsed = parseNumericValue(configValue);
    if (parsed.success) {
      const styleVal = toStyleVal(...parsed.value, isNegative);
      const style = insetStyle(type, insetDir, styleVal);
      return style;
    }
  }

  const unconfigged = parseUnconfigged(value, isNegative);
  if (unconfigged !== null) {
    return insetStyle(type, insetDir, unconfigged);
  }

  return error(`unable to parse inset utility`);
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
