import type { ViewStyle } from 'react-native';

export interface TailwindFn {
  (strings: TemplateStringsArray, ...values: (string | number)[]): Style;
  style: (...inputs: ClassInput[]) => Style;
  color: (color: string) => string | undefined;
  prefixMatch: (...prefixes: string[]) => boolean;
  setWindowDimensions: (dimensions: { width: number; height: number }) => unknown;
  setFontScale: (fontScale: number) => unknown;
  setPixelDensity: (pixelDensity: 1 | 2) => unknown;
  setColorScheme: (colorScheme: RnColorScheme) => unknown;
}

export type ClassInput =
  | string
  | string[]
  | boolean
  | null
  | undefined
  | { [k: string]: boolean | string | number }
  | ViewStyle;

export const PLATFORMS = [`ios`, `android`, `windows`, `macos`, `web`] as const;
export type Platform = typeof PLATFORMS[number];

export function isPlatform(x: string): x is Platform {
  return PLATFORMS.includes(x as Platform);
}

export const ORIENTATIONS = [`portrait`, `landscape`];
export type Orientation = 'portrait' | 'landscape';

export function isOrientation(x: string): x is Orientation {
  return ORIENTATIONS.includes(x as Orientation);
}

export type RnColorScheme = 'light' | 'dark' | null | undefined;

export interface RnWindow {
  fontScale: number;
  height: number;
  width: number;
  scale: number; // always 1 or 2
}

export interface DeviceContext {
  windowDimensions?: {
    width: number;
    height: number;
  };
  colorScheme?: 'light' | 'dark' | null;
  fontScale?: number;
  pixelDensity?: 1 | 2;
}

export interface ParseContext {
  isNegative?: boolean;
  fractions?: boolean;
  device?: DeviceContext;
}

export type ColorStyleType =
  | 'bg'
  | 'text'
  | 'border'
  | 'borderTop'
  | 'borderLeft'
  | 'borderRight'
  | 'borderBottom'
  | 'shadow'
  | 'tint';

export type Direction =
  | 'All'
  | 'Horizontal'
  | 'Vertical'
  | 'Left'
  | 'Right'
  | 'Top'
  | 'TopLeft'
  | 'TopRight'
  | 'Bottom'
  | 'BottomLeft'
  | 'BottomRight';

export type Style = {
  [key: string]: string[] | string | number | boolean | Style;
};

export enum ConfigType {
  fontSize = `fontSize`,
  lineHeight = `lineHeight`,
}

export type NullStyle = {
  kind: 'null';
};

export type CompleteStyle = {
  kind: 'complete';
  style: Style;
};

export type OrderedStyle = {
  kind: `ordered`;
  order: number;
  styleIr: StyleIR;
};

export type DependentStyle = {
  kind: 'dependent';
  complete: (style: Style) => string | void;
};

/**
 * An "Intermediate Representation" of a style object,
 * that may, or may not require some post-processing,
 * merging with other styles, etc.
 */
export type StyleIR = NullStyle | OrderedStyle | DependentStyle | CompleteStyle;

export enum Unit {
  rem = `rem`,
  em = `em`,
  px = `px`,
  percent = `%`,
  vw = `vw`,
  vh = `vh`,
  none = `<no-css-unit>`,
}

type NotImplemented = (...args: any) => unknown;

export type AddedUtilities = Record<string, Style | string>;

export type PluginFunction = (obj: {
  addUtilities(utilities: AddedUtilities): unknown;

  /**
   * @deprecated not supported in @jaredh159/twrn
   */
  addComponents: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrn
   */
  addBase: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrn
   */
  addVariant: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrn
   */
  e: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrn
   */
  prefix: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrn
   */
  theme: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrn
   */
  variants: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrn
   */
  config: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrn
   */
  corePlugins: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrn
   */
  matchUtilities: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrn
   */
  postcss: unknown;
}) => unknown;

export type CreatePlugin = (pluginFunction: PluginFunction) => {
  handler: PluginFunction;
  config: undefined;
};

export function isString(value: unknown): value is string {
  return typeof value === `string`;
}

export function isObject(value: unknown): value is object {
  return typeof value === `object`;
}
