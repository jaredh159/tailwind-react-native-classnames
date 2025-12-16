import type { StyleIR } from '../types';
import { complete } from '../helpers';

const ALLOWED_VALUES = [`solid`, `double`, `dotted`, `dashed`];
export default function textDecorationStyle(value: string): StyleIR | null {
  if (!ALLOWED_VALUES.includes(value)) return null;

  return complete({
    textDecorationStyle: value,
  });
}
