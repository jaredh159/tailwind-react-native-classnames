import { Platform } from 'react-native';
import { ClassInput, RnStyle } from './types';

export function parseInputs(
  inputs: ClassInput[],
): [classNames: string[], rnStyles: RnStyle] {
  let classNames: string[] = [];
  const styles: RnStyle = {};

  inputs.forEach((input) => {
    if (typeof input === `string`) {
      classNames = [...classNames, ...split(input)];
    } else if (Array.isArray(input)) {
      classNames = [...classNames, ...input.flatMap(split)];
    } else if (typeof input === `object` && input !== null) {
      for (const [key, value] of Object.entries(input)) {
        if (typeof value === `boolean`) {
          classNames = [...classNames, ...(value ? split(key) : [])];
        } else {
          styles[key] = value;
        }
      }
    }
  });

  return [classNames.map(accountForPlatform).filter(Boolean).filter(unique), styles];
}

function split(str: string): string[] {
  return str.trim().split(/\s+/);
}

function unique(className: string, index: number, classes: string[]): boolean {
  return classes.indexOf(className) === index;
}

function accountForPlatform(className: string): string {
  return className.replace(/^(ios|android|windows|macos|web):(.*)/, (_, os, className) =>
    Platform.OS === os ? className : ``,
  );
}
