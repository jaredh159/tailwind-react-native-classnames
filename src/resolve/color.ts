import { ColorStyleType, complete, error, StyleIR } from '../types';
import { TwColors } from '../tw-config';
import { warn } from './helpers';

export function color(type: ColorStyleType, value: string, config?: TwColors): StyleIR {
  if (!config) {
    return error(`Unexpected missing background color theme config`);
  }
  if (!value) {
    return error(`Unexpected missing value for background color`);
  }

  let shorthandOpacity: string | undefined = undefined;
  if (value.includes(`/`)) {
    [value = ``, shorthandOpacity] = value.split(`/`, 2);
  }

  let color = ``;
  const [groupKey = ``, modifier = ``] = value.split(`-`, 2);
  const group = config[groupKey];
  if (typeof group === `object` && group[modifier] !== undefined) {
    color = group[modifier] ?? ``;
  } else if (
    typeof group === `object` &&
    modifier === `` &&
    group.DEFAULT !== undefined
  ) {
    color = group.DEFAULT;
  } else if (value.startsWith(`[`)) {
    color = value.slice(1, -1);
  } else {
    const configColor = config[value];
    if (typeof configColor !== `string`) {
      return error(`Missing background color info for size: \`${value}\``);
    }
    color = configColor;
  }

  if (shorthandOpacity) {
    const opacity = Number(shorthandOpacity);
    if (!Number.isNaN(opacity)) {
      color = addOpacity(color, opacity / 100);
      return complete({ [STYLE_PROPS[type].color]: color });
    }
  }

  return {
    kind: `dependent`,
    complete(style) {
      const opacityProp = STYLE_PROPS[type].opacity;
      const opacity = style[opacityProp];
      if (typeof opacity === `number`) {
        color = addOpacity(color, opacity);
        delete style[opacityProp];
      }
      style[STYLE_PROPS[type].color] = color;
    },
  };
}

export function colorOpacity(type: ColorStyleType, value: string): StyleIR {
  const percentage = parseInt(value, 10);
  if (Number.isNaN(percentage)) {
    return { kind: `null` };
  }

  const opacity = percentage / 100;
  const style = { [STYLE_PROPS[type].opacity]: opacity };
  return { kind: `complete`, style };
}

function addOpacity(color: string, opacity: number): string {
  if (color.startsWith(`#`)) {
    color = hexToRgba(color);
  } else if (color.startsWith(`rgb(`)) {
    color = color.replace(/^rgb\(/, `rgba(`).replace(/\)$/, `, 1)`);
  }
  // @TODO: support hls/hlsa if anyone opens an issue...
  return color.replace(/, ?\d*\.?(\d+)\)$/, `, ${opacity})`);
}

const STYLE_PROPS = {
  bg: { opacity: `__opacity_bg`, color: `backgroundColor` },
  text: { opacity: `__opacity_text`, color: `color` },
  border: { opacity: `__opacity_border`, color: `borderColor` },
  borderTop: { opacity: `__opacity_border`, color: `borderTopColor` },
  borderBottom: { opacity: `__opacity_border`, color: `borderBottomColor` },
  borderLeft: { opacity: `__opacity_border`, color: `borderLeftColor` },
  borderRight: { opacity: `__opacity_border`, color: `borderRightColor` },
  shadow: { opacity: `__opacity_shadow`, color: `shadowColor` },
};

function hexToRgba(hex: string): string {
  const orig = hex;
  hex = hex.replace(MATCH_SHORT_HEX, (_, r, g, b) => r + r + g + g + b + b);
  const result = MATCH_FULL_HEX.exec(hex);
  if (!result) {
    warn(`invalid config hex color value: ${orig}`);
    return `rgba(0, 0, 0, 1)`;
  }

  const r = parseInt(result[1]!, 16);
  const g = parseInt(result[2]!, 16);
  const b = parseInt(result[3]!, 16);
  return `rgba(${r}, ${g}, ${b}, 1)`;
}

const MATCH_SHORT_HEX = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
const MATCH_FULL_HEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
