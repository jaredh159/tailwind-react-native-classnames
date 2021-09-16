import { StyleIR } from './types';
import defaultStyles from './styles';

export default class Cache {
  private data: Record<string, Map<string, StyleIR>> = {};

  public constructor() {
    this.data.default = new Map(defaultStyles);
  }

  public get(group: string, key: string): StyleIR | undefined {
    return this.data[group]?.get(key);
  }

  public set(group: string, key: string, value: StyleIR): void {
    if (!this.data[group]) {
      this.data[group] = new Map();
    }
    this.data[group]!.set(key, value);
  }
}
