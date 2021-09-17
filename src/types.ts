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

export type StyleIR = NullStyle | OrderedStyle | DependentStyle | CompleteStyle;

export enum Unit {
  rem = `rem`,
  em = `em`,
  px = `px`,
  percent = `%`,
  none = `<no-css-unit>`,
}
