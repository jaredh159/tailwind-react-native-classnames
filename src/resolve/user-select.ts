import type { StyleIR } from '../types';
import { complete } from '../helpers';

const ALLOWED_VALUES = [`auto`, `text`, `none`, `contain`, `all`];
export default function userSelect(value: string): StyleIR | null {
  if (!ALLOWED_VALUES.includes(value)) return null;

  return complete({
    userSelect: value,
  });
}
