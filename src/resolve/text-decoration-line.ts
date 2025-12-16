import type { StyleIR } from '../types';
import { complete } from '../helpers';

const ALLOWED_VALUES = [`none`, `underline`, `line-through`];
const VALUES_REMAP: Record<string, string> = {
  'no-underline': `none`,
};

export default function textDecorationLine(value: string): StyleIR | null {
  if (!ALLOWED_VALUES.includes(VALUES_REMAP[value] ?? value)) return null;

  return complete({
    textDecorationLine: value,
  });
}
