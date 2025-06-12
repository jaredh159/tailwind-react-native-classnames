import type { StyleIR } from '../types';
import { complete } from '../helpers';

const ALLOWED_VALUES = [`auto`, `none`, `box-only`, `box-none`];
export default function pointerEvents(value: string): StyleIR | null {
  if (!ALLOWED_VALUES.includes(value)) return null;

  return complete({
    pointerEvents: value,
  });
}
