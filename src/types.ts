export type ClassInput =
  | string
  | string[]
  | boolean
  | null
  | undefined
  | { [k: string]: boolean | string | number };

export type Styles = Record<string, Record<string, string | number>>;

export interface TailwindFn {
  (strings: TemplateStringsArray, ...values: (string | number)[]): {
    [key: string]: string | number;
  };
  style: (...inputs: ClassInput[]) => { [key: string]: string | number };
  color: (color: string) => string | undefined;
}
