import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export interface TailwindFn {
  (strings: TemplateStringsArray, ...values: (string | number)[]): Style;
  style: (...inputs: ClassInput[]) => Style;
  color: (color: string) => string | undefined;
  prefixMatch: (...prefixes: string[]) => boolean;
  memoBuster: string;

  // NB: @see https://www.typescriptlang.org/tsconfig#stripInternal

  /**
   * @internal
   */
  setWindowDimensions: (dimensions: { width: number; height: number }) => unknown;
  /**
   * @internal
   */
  setFontScale: (fontScale: number) => unknown;
  /**
   * @internal
   */
  setPixelDensity: (pixelDensity: 1 | 2) => unknown;
  /**
   * @internal
   */
  setColorScheme: (colorScheme: RnColorScheme) => unknown;
  /**
   * @internal
   */
  getColorScheme: () => RnColorScheme;
  /**
   * @internal
   */
  updateDeviceContext: (
    dimensions: { width: number; height: number },
    fontScale: number,
    pixelDensity: 1 | 2,
    colorScheme: RnColorScheme | 'skip',
  ) => unknown;
}

export type ClassInput =
  | string
  | string[]
  | boolean
  | null
  | undefined
  | { [k: string]: boolean | string | number }
  | ViewStyle
  | TextStyle
  | ImageStyle;

export const PLATFORMS = [`ios`, `android`, `windows`, `macos`, `web`] as const;
export type Platform = (typeof PLATFORMS)[number];

export function isPlatform(x: string): x is Platform {
  return PLATFORMS.includes(x as Platform);
}

export const ORIENTATIONS = [`portrait`, `landscape`];
export type Orientation = 'portrait' | 'landscape';

export function isOrientation(x: string): x is Orientation {
  return ORIENTATIONS.includes(x as Orientation);
}

export type RnColorScheme = 'light' | 'dark' | null | undefined;

export interface DeviceContext {
  windowDimensions?: {
    width: number;
    height: number;
  };
  colorScheme?: 'light' | 'dark' | null;
  fontScale?: number;
  pixelDensity?: 1 | 2;
  platform?: Platform;
}

export interface ParseContext {
  isNegative?: boolean;
  fractions?: boolean;
  device?: DeviceContext;
  reactNativeVersion?: Version;
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
  | 'tint'
  | 'decoration'
  | 'outline';

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
  [key: string]: string[] | string | number | boolean | Style | Style[];
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
  deg = `deg`,
  rad = `rad`,
  none = `<no-css-unit>`,
}

type NotImplemented = (...args: any) => unknown;

export type AddedUtilities = Record<string, Style | string>;

export type PluginFunction = (obj: {
  addUtilities(utilities: AddedUtilities): unknown;

  /**
   * @deprecated not supported in @jaredh159/twrnc
   */
  addComponents: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrnc
   */
  addBase: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrnc
   */
  addVariant: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrnc
   */
  e: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrnc
   */
  prefix: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrnc
   */
  theme: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrnc
   */
  variants: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrnc
   */
  config: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrnc
   */
  corePlugins: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrnc
   */
  matchUtilities: NotImplemented;

  /**
   * @deprecated not supported in @jaredh159/twrnc
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

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === `object`;
}

export type Version =
  | {
      major: number;
      minor: number;
      patch: number;
    }
  | undefined;
