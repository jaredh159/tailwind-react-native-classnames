import type { ColorStyleType, Style, StyleIR } from '../types';
import type { TwColors } from '../tw-config';
import { isObject, isString } from '../types';
import { warn } from '../helpers';

export function color(
  type: ColorStyleType,
  value: string,
  config?: TwColors,
): StyleIR | null {
  if (!config) {
    return null;
  }
  // support opacity shorthand: `bg-red-200/50`
  let shorthandOpacity: string | undefined = undefined;
  if (value.includes(`/`)) {
    [value = ``, shorthandOpacity] = value.split(`/`, 2);
  }

  let color = ``;

  // for arbitrary support: `bg-[#eaeaea]`, `text-[rgba(1, 1, 1, 0.5)]`
  if (value.startsWith(`[#`) || value.startsWith(`[rgb`)) {
    color = value.slice(1, -1);

    // search for color in config
  } else {
    color = configColor(value, config) ?? ``;
  }

  if (!color) {
    return null;
  }

  if (shorthandOpacity) {
    const opacity = Number(shorthandOpacity);
    if (!Number.isNaN(opacity)) {
      color = addOpacity(color, opacity / 100);
      return {
        // even though we know the bg opacity, return `dependent` to work around
        // subtle dark-mode ordering issue when combining shorthand & non-shorthand
        // @see https://github.com/jaredh159/tailwind-react-native-classnames/pull/269
        kind: `dependent`,
        complete(style) {
          style[STYLE_PROPS[type].color] = color;
        },
      };
    }
  }

  // return a dependent style to support merging of classes
  // like `bg-red-800 bg-opacity-75`
  return {
    kind: `dependent`,
    complete(style) {
      const opacityProp = STYLE_PROPS[type].opacity;
      const opacity = style[opacityProp];
      if (typeof opacity === `number`) {
        color = addOpacity(color, opacity);
      }
      style[STYLE_PROPS[type].color] = color;
    },
  };
}

export function colorOpacity(type: ColorStyleType, value: string): StyleIR | null {
  const percentage = parseInt(value, 10);
  if (Number.isNaN(percentage)) {
    return null;
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

export function removeOpacityHelpers(style: Style): void {
  for (const key in style) {
    if (key.startsWith(`__opacity_`)) {
      delete style[key];
    }
  }
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
  tint: { opacity: `__opacity_tint`, color: `tintColor` },
};

function hexToRgba(hex: string): string {
  const orig = hex;
  hex = hex.replace(MATCH_SHORT_HEX, (_, r, g, b) => r + r + g + g + b + b);
  const result = MATCH_FULL_HEX.exec(hex);
  if (!result) {
    warn(`invalid config hex color value: ${orig}`);
    return `rgba(0, 0, 0, 1)`;
  }

  const r = parseInt(result[1] ?? ``, 16);
  const g = parseInt(result[2] ?? ``, 16);
  const b = parseInt(result[3] ?? ``, 16);
  return `rgba(${r}, ${g}, ${b}, 1)`;
}

export function configColor(colorName: string, config: TwColors): string | null {
  const color = config[colorName];

  // the color is found at the current config level
  if (isString(color)) {
    return color;
  } else if (isObject(color) && isString(color.DEFAULT)) {
    return color.DEFAULT;
  }

  // search for a matching sub-string at the current config level
  let [colorNameStart = ``, ...colorNameRest] = colorName.split(`-`);
  while (colorNameStart !== colorName) {
    const subConfig = config[colorNameStart];
    if (isObject(subConfig)) {
      return configColor(colorNameRest.join(`-`), subConfig);
    } else if (colorNameRest.length === 0) {
      return null;
    }
    colorNameStart = `${colorNameStart}-${colorNameRest.shift()}`;
  }

  return null;
}

const MATCH_SHORT_HEX = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
const MATCH_FULL_HEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
