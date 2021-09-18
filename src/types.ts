export type ClassInput =
  | string
  | string[]
  | boolean
  | null
  | undefined
  | { [k: string]: boolean | string | number };

export const PLATFORMS = [`ios`, `android`, `windows`, `macos`, `web`] as const;
export type Platform = typeof PLATFORMS[number];

export interface RnWindow {
  fontScale: number;
  height: number;
  width: number;
  scale: number; // always 1 or 2
}
export type ColorStyleType =
  | 'bg'
  | 'text'
  | 'border'
  | 'borderTop'
  | 'borderLeft'
  | 'borderRight'
  | 'borderBottom'
  | 'shadow';

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

export type RnColorScheme = 'light' | 'dark' | null | undefined;

export type Style = {
  [key: string]: string[] | string | number | boolean | Style;
};

export interface TailwindFn {
  (strings: TemplateStringsArray, ...values: (string | number)[]): Style;
  style: (...inputs: ClassInput[]) => Style;
  color: (color: string) => string | undefined;
  setWindow: (window: RnWindow) => void;
  setColorScheme: (colorScheme: RnColorScheme) => void;
}

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
