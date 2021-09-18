import { StyleIR, Style } from './types';
import defaultStyles from './styles';

export default class Cache {
  private ir: Record<string, Map<string, StyleIR>> = {};
  private styles: Record<string, Map<string, Style>> = {};

  public constructor() {
    this.ir.default = new Map(defaultStyles);
  }

  public getStyle(group: string, key: string): Style | undefined {
    return this.styles[group]?.get(key);
  }

  public setStyle(group: string, key: string, style: Style): void {
    if (!this.styles[group]) {
      this.styles[group] = new Map();
    }
    this.styles[group]!.set(key, style);
  }

  public getIr(group: string, key: string): StyleIR | undefined {
    return this.ir[group]?.get(key);
  }

  public setIr(group: string, key: string, ir: StyleIR): void {
    if (!this.ir[group]) {
      this.ir[group] = new Map();
    }
    this.ir[group]!.set(key, ir);
  }
}
