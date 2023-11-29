import type { PluginFunction } from './types';

type TwFontSize =
  | string
  | [string, string]
  | [string, { lineHeight?: string; letterSpacing?: string }];

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
  colors?: TwColors;
  backgroundColor?: TwColors;
  borderColor?: TwColors;
  textColor?: TwColors;
  extend?: Omit<TwTheme, 'extend'>;
}

export interface TwConfig {
  theme?: TwTheme;
  plugins?: Array<{ handler: PluginFunction }>;
}
