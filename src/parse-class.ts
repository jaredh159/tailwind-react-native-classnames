import fontSize from './resolve/font-size';
import lineHeight from './resolve/line-height';
import spacing from './resolve/spacing';
import screens from './screens';
import { TwConfig } from './tw-config';
import {
  RnWindow,
  StyleIR,
  error,
  Platform,
  PLATFORMS,
  RnColorScheme,
  complete,
} from './types';
import { Platform as RnPlatform } from 'react-native';
import fontFamily from './resolve/font-family';
import { aspectRatio } from './resolve/aspect-ratio';
import { color, colorOpacity } from './resolve/color';
import { border, borderRadius } from './resolve/borders';
import { getDirection, unconfiggedStyle } from './helpers';
import { inset } from './resolve/inset';
import flexGrowShrink from './resolve/flex-grow-shrink';
import { widthHeight, minMaxWidthHeight } from './resolve/width-height';
import { letterSpacing } from './resolve/letter-spacing';
import { opacity } from './resolve/opacity';
import { shadowOpacity, shadowOffset } from './resolve/shadow';

export default class ClassParser {
  public cacheGroup = `default`;
  private position = 0;
  private string: string;
  private char?: string;
  private order?: number;
  private isNull = false;
  private isNegative = false;

  public constructor(
    input: string,
    private config: TwConfig = {},
    window?: RnWindow,
    colorScheme?: RnColorScheme,
  ) {
    const parts = input.trim().split(`:`);
    let prefixes: string[] = [];
    if (parts.length === 1) {
      this.string = input;
    } else {
      this.string = parts.pop() ?? ``;
      prefixes = parts;
    }
    this.char = this.string[0];

    const widthBreakpoints = screens(this.config.theme?.screens);

    // loop through the prefixes ONE time, extracting useful info
    for (const prefix of prefixes) {
      if (widthBreakpoints[prefix]) {
        const breakpointOrder = widthBreakpoints[prefix]?.[2];
        if (breakpointOrder !== undefined) {
          this.order = (this.order ?? 0) + breakpointOrder;
        }
        const windowWidth = window?.width;
        if (windowWidth) {
          this.cacheGroup = `w${windowWidth}`;
          const [min, max] = widthBreakpoints[prefix] ?? [0, 0];
          if (windowWidth <= min || windowWidth > max) {
            // breakpoint does not match
            this.isNull = true;
          }
        }
      } else if (PLATFORMS.includes(prefix as Platform) && prefix !== RnPlatform.OS) {
        // platform prefix mismatch
        this.isNull = true;
      } else if (prefix === `dark`) {
        this.cacheGroup =
          this.cacheGroup === `default` ? `dark` : `${this.cacheGroup}--dark`;
        if (colorScheme !== `dark`) {
          this.isNull = true;
        } else {
          this.order = (this.order ?? 0) + 1;
        }
      }
    }
  }

  public parse(): StyleIR {
    if (this.isNull) {
      return { kind: `null` };
    }

    this.parseIsNegative();
    const ir = this.parseIt();
    if (this.order !== undefined && ir.kind !== `error`) {
      return { kind: `ordered`, order: this.order, styleIr: ir };
    }
    return ir;
  }

  private parseIt(): StyleIR {
    const theme = this.config.theme;
    let ir: StyleIR = { kind: `error` };

    switch (this.char) {
      case `m`:
      case `p`: {
        const match = this.peekSlice(1, 3).match(/^(t|b|r|l|x|y)?-/);
        if (match) {
          const prop = this.char === `m` ? `margin` : `padding`;
          this.advance((match[0]?.length ?? 0) + 1);
          const spacingDirection = getDirection(match[1]);
          return spacing(
            prop,
            spacingDirection,
            this.isNegative,
            this.rest,
            this.config.theme?.[prop],
          );
        }
      }
    }

    if (this.consumePeeked(`h-`)) {
      ir = widthHeight(`height`, this.rest, this.isNegative, theme?.height);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`w-`)) {
      ir = widthHeight(`width`, this.rest, this.isNegative, theme?.width);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`min-w-`)) {
      ir = minMaxWidthHeight(`minWidth`, this.rest, theme?.minWidth);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`min-h-`)) {
      ir = minMaxWidthHeight(`minHeight`, this.rest, theme?.minHeight);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`max-w-`)) {
      ir = minMaxWidthHeight(`maxWidth`, this.rest, theme?.maxWidth);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`max-h-`)) {
      ir = minMaxWidthHeight(`maxHeight`, this.rest, theme?.maxHeight);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`leading-`)) {
      ir = lineHeight(this.rest, theme?.lineHeight);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`text-`)) {
      ir = fontSize(this.rest, theme?.fontSize);
      if (ir.kind !== `error`) return ir;

      ir = color(`text`, this.rest, theme?.textColor);
      if (ir.kind !== `error`) return ir;

      if (this.consumePeeked(`opacity-`)) {
        ir = colorOpacity(`text`, this.rest);
        if (ir.kind !== `error`) return ir;
      }
    }

    if (this.consumePeeked(`font-`)) {
      ir = fontFamily(this.rest, theme?.fontFamily);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`aspect-ratio-`)) {
      ir = aspectRatio(this.rest);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`bg-`)) {
      ir = color(`bg`, this.rest, theme?.backgroundColor);
      if (ir.kind !== `error`) return ir;

      if (this.consumePeeked(`opacity-`)) {
        ir = colorOpacity(`bg`, this.rest);
        if (ir.kind !== `error`) return ir;
      }
    }

    if (this.consumePeeked(`border`)) {
      ir = border(this.rest, theme);
      if (ir.kind !== `error`) return ir;

      if (this.consumePeeked(`-opacity-`)) {
        ir = colorOpacity(`border`, this.rest);
        if (ir.kind !== `error`) return ir;
      }
    }

    if (this.consumePeeked(`rounded`)) {
      ir = borderRadius(this.rest, theme?.borderRadius);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`bottom-`)) {
      ir = inset(`bottom`, this.rest, this.isNegative, theme?.inset);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`top-`)) {
      ir = inset(`top`, this.rest, this.isNegative, theme?.inset);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`left-`)) {
      ir = inset(`left`, this.rest, this.isNegative, theme?.inset);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`right-`)) {
      ir = inset(`right`, this.rest, this.isNegative, theme?.inset);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`inset-`)) {
      ir = inset(`inset`, this.rest, this.isNegative, theme?.inset);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`flex-`)) {
      if (this.consumePeeked(`grow`)) {
        ir = flexGrowShrink(`Grow`, this.rest, theme?.flexGrow);
        if (ir.kind !== `error`) return ir;
      } else if (this.consumePeeked(`shrink`)) {
        ir = flexGrowShrink(`Shrink`, this.rest, theme?.flexShrink);
        if (ir.kind !== `error`) return ir;
      }
    }

    if (this.consumePeeked(`shadow-color-opacity-`)) {
      ir = colorOpacity(`shadow`, this.rest);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`shadow-opacity-`)) {
      ir = shadowOpacity(this.rest);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`shadow-offset-`)) {
      ir = shadowOffset(this.rest);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`shadow-radius-`)) {
      ir = unconfiggedStyle(`shadowRadius`, this.rest);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`shadow-`)) {
      ir = color(`shadow`, this.rest, theme?.colors);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`elevation-`)) {
      const elevation = parseInt(this.rest, 10);
      if (!Number.isNaN(elevation)) {
        return complete({ elevation });
      }
    }

    if (this.consumePeeked(`opacity-`)) {
      ir = opacity(this.rest, theme?.opacity);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`tracking-`)) {
      ir = letterSpacing(this.rest, this.isNegative, theme?.letterSpacing);
      if (ir.kind !== `error`) return ir;
    }

    if (this.consumePeeked(`z-`)) {
      const zIndex = Number(theme?.zIndex?.[this.rest] ?? this.rest);
      if (!Number.isNaN(zIndex)) {
        return complete({ zIndex });
      }
    }

    return error(`unknown utility ${this.rest}`);
  }

  private advance(amount = 1): void {
    this.position += amount;
    this.char = this.string[this.position];
  }

  private get rest(): string {
    return this.peekSlice(0, this.string.length);
  }

  private peekSlice(begin: number, end: number): string {
    return this.string.slice(this.position + begin, this.position + end);
  }

  private consumePeeked(string: string): boolean {
    if (this.peekSlice(0, string.length) === string) {
      this.advance(string.length);
      return true;
    }
    return false;
  }

  private parseIsNegative(): void {
    if (this.char === `-`) {
      this.advance();
      this.isNegative = true;
    }
  }
}
