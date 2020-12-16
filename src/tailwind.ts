import { ViewStyle, TextStyle, Platform } from 'react-native';

type Input =
  | string
  | string[]
  | false
  | null
  | undefined
  | { [k: string]: boolean }
  | ViewStyle
  | TextStyle;

function makeTw(styles: ConfigStyles): TailwindFn {
  return (...inputs: Input[]) => {
    const style: any = {};
    const input = inputs[0] as string;
    Object.assign(style, styles[input]);
    return useVariables(style);
  };
}

type ConfigStyles = Record<string, Record<string, string | number>>;

interface TailwindFn {
  (...inputs: Input[]): any;
}

function create(
  configStyles: ConfigStyles,
): [tailwind: TailwindFn, getColor: (colorSlug: string) => string] {
  return [makeTw(configStyles), (slug) => slug];
}

const [baseTailwind, getColor] = create(require(`../styles.json`));

export default baseTailwind;
export { getColor, create };

const useVariables = (object: any) => {
  const newObject: Record<string, any> = {};

  for (const [key, value] of Object.entries(object)) {
    if (!key.startsWith('--')) {
      if (typeof value === 'string') {
        newObject[key] = value.replace(/var\(([a-zA-Z-]+)\)/, (_, name) => {
          return object[name];
        });
      } else {
        newObject[key] = value;
      }
    }
  }

  return newObject;
};
