import { StyleIR, Style } from './types';
import defaultStyles from './styles';

export default class Cache {
  private ir: Map<string, StyleIR> = new Map(defaultStyles);
  private styles: Map<string, Style> = new Map();

  public constructor(customStyles?: Array<[string, StyleIR]>) {
    this.ir = new Map([...defaultStyles, ...(customStyles ?? [])]);
  }

  public getStyle(key: string): Style | undefined {
    return this.styles.get(key);
  }

  public setStyle(key: string, style: Style): void {
    this.styles.set(key, style);
  }

  public getIr(key: string): StyleIR | undefined {
    return this.ir.get(key);
  }

  public setIr(key: string, ir: StyleIR): void {
    this.ir.set(key, ir);
  }
}
