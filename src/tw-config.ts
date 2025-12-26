import type { PluginFunction } from './types';

type TwFontSize =
  | string
  | [string, string]
  | [string, { lineHeight?: string; letterSpacing?: string; fontWeight?: string }];

type TwScreen = string | { max?: string; min?: string };

// eg: { black: #000, gray: { 100: #eaeaea } }
export type TwColors<K extends keyof any = string, V = string> = {
  [key: string]: V | TwColors<K, V>;
};

export interface TwTheme {
  fontSize?: Record<string, TwFontSize>;
  lineHeight?: Record<string, string>;
  spacing?: Record<string, string>;
  padding?: Record<string, string>;
  margin?: Record<string, string>;
  inset?: Record<string, string>;
  height?: Record<string, string>;
  width?: Record<string, string>;
  maxWidth?: Record<string, string>;
  maxHeight?: Record<string, string>;
  minWidth?: Record<string, string>;
  minHeight?: Record<string, string>;
  letterSpacing?: Record<string, string>;
  borderWidth?: Record<string, string>;
  borderRadius?: Record<string, string>;
  screens?: Record<string, TwScreen>;
  opacity?: Record<string, number | string>;
  flex?: Record<string, string>;
  flexBasis?: Record<string, string>;
  flexGrow?: Record<string, number | string>;
  flexShrink?: Record<string, number | string>;
  gap?: Record<string, string>;
  fontWeight?: Record<string, number | string>;
  fontFamily?: Record<string, string | string[]>;
  zIndex?: Record<string, number | string>;
  scale?: Record<string, string>;
  rotate?: Record<string, string>;
  skew?: Record<string, string>;
  translate?: Record<string, string>;
  transformOrigin?: Record<string, string>;
  outlineOffset?: Record<string, string>;
  outlineWidth?: Record<string, string>;

  brightness?: Record<string, string>;
  contrast?: Record<string, string>;
  grayscale?: Record<string, string>;
  saturate?: Record<string, string>;
  invert?: Record<string, string>;
  sepia?: Record<string, string>;
  hueRotate?: Record<string, string>;

  colors?: TwColors;
  backgroundColor?: TwColors; // bg-
  borderColor?: TwColors; // border-
  textColor?: TwColors; // text-
  textDecorationColor?: TwColors; // decoration-
  outlineColor?: TwColors; // outline-

  extend?: Omit<TwTheme, 'extend'>;
}

export const PREFIX_COLOR_PROP_MAP = {
  'bg-': `backgroundColor`,
  'border-': `borderColor`,
  'text-': `textColor`,
  'decoration-': `textDecorationColor`,
  'outline-': `outlineColor`,
} as const;

export interface TwConfig {
  theme?: TwTheme;
  plugins?: Array<{ handler: PluginFunction }>;
}
