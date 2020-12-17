export type ClassInput =
  | string
  | string[]
  | boolean
  | null
  | undefined
  | { [k: string]: boolean | string | number };

export type ConfigStyles = Record<string, Record<string, string | number>>;

export interface TailwindFn {
  (...inputs: ClassInput[]): { [key: string]: string | number };
  t: (
    strings: TemplateStringsArray,
    ...values: (string | number)[]
  ) => { [key: string]: string | number };
}

export interface TailwindColorFn {
  (color: string): string | undefined;
}
