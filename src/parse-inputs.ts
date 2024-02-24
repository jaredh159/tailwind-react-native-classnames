import type { ClassInput, Style } from './types';

export function parseInputs(
  inputs: ClassInput[],
): [classNames: string[], rnStyles: Style | null] {
  let classNames: string[] = [];
  let styles: Style | null = null;

  inputs.forEach((input) => {
    if (typeof input === `string`) {
      classNames = [...classNames, ...split(input)];
    } else if (Array.isArray(input)) {
      classNames = [...classNames, ...input.flatMap(split)];
    } else if (typeof input === `object` && input !== null) {
      for (const [key, value] of Object.entries(input)) {
        if (typeof value === `boolean`) {
          classNames = [...classNames, ...(value ? split(key) : [])];
        } else if (styles) {
          styles[key] = value;
        } else {
          styles = { [key]: value };
        }
      }
    }
  });

  return [classNames.filter(Boolean).filter(unique), styles];
}

function split(str: string): string[] {
  return str.trim().split(/\s+/);
}

function unique(className: string, index: number, classes: string[]): boolean {
  return classes.lastIndexOf(className) === index;
}
