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

export default function tailwind(...inputs: Input[]) {
  return { color: 'rgba(66, 153, 225, 1)' };
}
