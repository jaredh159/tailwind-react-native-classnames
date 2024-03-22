import type { TwTheme } from '../tw-config';
import type { ParseContext, StyleIR } from '../types';
import { getCompleteStyle, complete, parseStyleVal, unconfiggedStyle } from '../helpers';

export function flexGrowShrink(
  type: 'Grow' | 'Shrink',
  value: string,
  config?: TwTheme['flexGrow'] | TwTheme['flexShrink'],
): StyleIR | null {
  value = value.replace(/^-/, ``);
  if (value[0] === `[` && value.endsWith(`]`)) {
    value = value.slice(1, -1);
  }
  const configKey = value === `` ? `DEFAULT` : value;
  const numericValue = Number(config?.[configKey] ?? value);
  if (!Number.isNaN(numericValue)) {
    return complete({ [`flex${type}`]: numericValue });
  }
  return null;
}

export function flex(value: string, config?: TwTheme['flex']): StyleIR | null {
  value = config?.[value] || value;
  if ([`min-content`, `revert`, `unset`].includes(value)) {
    // unsupported
    return null;
  }

  // @see https://developer.mozilla.org/en-US/docs/Web/CSS/flex
  // MDN: One value, unitless number: flex-grow flex-basis is then equal to 0.
  if (value.match(/^\d+(\.\d+)?$/)) {
    return complete({
      flexGrow: Number(value),
      flexBasis: `0%`,
    });
  }

  // MDN: Two values (both integers): flex-grow | flex-basis
  let match = value.match(/^(\d+)\s+(\d+)$/);
  if (match) {
    return complete({
      flexGrow: Number(match[1]),
      flexShrink: Number(match[2]),
    });
  }

  // MDN: Two values: flex-grow | flex-basis
  match = value.match(/^(\d+)\s+([^ ]+)$/);
  if (match) {
    const flexBasis = parseStyleVal(match[2] ?? ``);
    if (!flexBasis) {
      return null;
    }
    return complete({
      flexGrow: Number(match[1]),
      flexBasis,
    });
  }

  // MDN: Three values: flex-grow | flex-shrink | flex-basis
  match = value.match(/^(\d+)\s+(\d+)\s+(.+)$/);
  if (match) {
    const flexBasis = parseStyleVal(match[3] ?? ``);
    if (!flexBasis) {
      return null;
    }
    return complete({
      flexGrow: Number(match[1]),
      flexShrink: Number(match[2]),
      flexBasis,
    });
  }

  return null;
}

export function flexBasis(
  value: string,
  context: ParseContext = {},
  config?: TwTheme['flexBasis'],
): StyleIR | null {
  value = value.replace(/^-/, ``);
  const configValue = config?.[value];

  if (configValue !== undefined) {
    return getCompleteStyle(`flexBasis`, configValue, context);
  }

  return unconfiggedStyle(`flexBasis`, value, context);
}

export function gap(
  value: string,
  context: ParseContext = {},
  config?: TwTheme['gap'],
): StyleIR | null {
  let gapStyle = `gap`;

  value = value.replace(/^-(x|y)-/, (_, dir) => {
    if (dir === `x`) {
      gapStyle = `columnGap`;
    }
    if (dir === `y`) {
      gapStyle = `rowGap`;
    }
    return ``;
  });

  value = value.replace(/^-/, ``);

  const configValue = config === null || config === void 0 ? void 0 : config[value];
  if (configValue !== undefined) {
    return getCompleteStyle(gapStyle, configValue, context);
  }
  return unconfiggedStyle(gapStyle, value, context);
}
