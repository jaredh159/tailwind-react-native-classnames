import { TwTheme } from '../tw-config';
import { ColorStyleType, Direction, StyleIR } from '../types';
import { parseAndConsumeDirection, complete, getCompleteStyle } from '../helpers';
import { color } from './color';

export function border(value: string, theme?: TwTheme): StyleIR | null {
  let [rest, direction] = parseAndConsumeDirection(value);
  const widthUtilityMatch = rest.match(/^(-?(\d)+)?$/);
  if (widthUtilityMatch) {
    return borderWidth(rest, direction, theme?.borderWidth);
  }

  rest = rest.replace(/^-/, ``);
  if ([`dashed`, `solid`, `dotted`].includes(rest)) {
    return complete({ borderStyle: rest });
  }

  let colorType: ColorStyleType = `border`;
  switch (direction) {
    case `Bottom`:
      colorType = `borderBottom`;
      break;
    case `Top`:
      colorType = `borderTop`;
      break;
    case `Left`:
      colorType = `borderLeft`;
      break;
    case `Right`:
      colorType = `borderRight`;
      break;
  }

  return color(colorType, rest, theme?.borderColor);
}

function borderWidth(
  value: string,
  direction: Direction,
  config?: TwTheme['borderWidth'],
): StyleIR | null {
  if (!config) {
    return null;
  }

  value = value.replace(/^-/, ``);
  const key = value === `` ? `DEFAULT` : value;
  const configValue = config[key];
  if (configValue === undefined) {
    return null;
  }

  const prop = `border${direction === `All` ? `` : direction}Width`;
  return getCompleteStyle(prop, configValue);
}

export function borderRadius(
  value: string,
  config?: TwTheme['borderRadius'],
): StyleIR | null {
  if (!config) {
    return null;
  }

  let [rest, direction] = parseAndConsumeDirection(value);
  rest = rest.replace(/^-/, ``);
  if (rest === ``) {
    rest = `DEFAULT`;
  }

  const prop = `border${direction === `All` ? `` : direction}Radius`;
  const configValue = config[rest];
  if (!configValue) {
    return null;
  }

  return getCompleteStyle(prop, configValue);
}
