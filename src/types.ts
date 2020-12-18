export type ClassInput =
  | string
  | string[]
  | boolean
  | null
  | undefined
  | { [k: string]: boolean | string | number };

export type TwStyles = Record<string, Record<string, string | number>>;
export type RnStyle = { [key: string]: string[] | string | number };

export interface TailwindFn {
  (strings: TemplateStringsArray, ...values: (string | number)[]): RnStyle;
  style: (...inputs: ClassInput[]) => RnStyle;
  color: (color: string) => string | undefined;
}
