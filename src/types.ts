export type ClassInput =
  | string
  | string[]
  | boolean
  | null
  | undefined
  | { [k: string]: boolean | string | number };

export type ConfigStyles = Record<string, Record<string, string | number>>;

export type Style = {
  [key: string]: string[] | string | number | Style;
};

export interface TailwindFn {
  (strings: TemplateStringsArray, ...values: (string | number)[]): Style;
  style: (...inputs: ClassInput[]) => Style;
  color: (color: string) => string | undefined;
}
