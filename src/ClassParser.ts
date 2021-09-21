import { Platform as RnPlatform } from 'react-native';
import fontSize from './resolve/font-size';
import lineHeight from './resolve/line-height';
import spacing from './resolve/spacing';
import screens from './screens';
import { TwConfig } from './tw-config';
import { StyleIR, isOrientation, isPlatform, DeviceContext, ParseContext } from './types';
import fontFamily from './resolve/font-family';
import { color, colorOpacity } from './resolve/color';
import { border, borderRadius } from './resolve/borders';
import {
  getCompleteStyle,
  getDirection,
  unconfiggedStyle,
  warn,
  complete,
  parseNumericValue,
} from './helpers';
import { inset } from './resolve/inset';
import { flexGrowShrink, flex } from './resolve/flex';
import { widthHeight, minMaxWidthHeight } from './resolve/width-height';
import { letterSpacing } from './resolve/letter-spacing';
import { opacity } from './resolve/opacity';
import { shadowOpacity, shadowOffset } from './resolve/shadow';
import Cache from './cache';

export default class ClassParser {
  private position = 0;
  private string: string;
  private char?: string;
  private order?: number;
  private isNull = false;
  private isNegative = false;
  private context: ParseContext = {};

  public constructor(
    input: string,
    private config: TwConfig = {},
    private cache: Cache,
    device: DeviceContext,
  ) {
    this.context.device = device;
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
        const windowWidth = device.windowDimensions?.width;
        if (windowWidth) {
          const [min, max] = widthBreakpoints[prefix] ?? [0, 0];
          if (windowWidth <= min || windowWidth > max) {
            // breakpoint does not match
            this.isNull = true;
          }
        } else {
          this.isNull = true;
        }
      } else if (isPlatform(prefix)) {
        this.isNull = prefix !== RnPlatform.OS;
      } else if (isOrientation(prefix)) {
        if (!device.windowDimensions) {
          this.isNull = true;
        } else {
          const deviceOrientation =
            device.windowDimensions.width > device.windowDimensions.height
              ? `landscape`
              : `portrait`;
          if (deviceOrientation !== prefix) {
            this.isNull = true;
          } else {
            this.incrementOrder();
          }
        }
      } else if (prefix === `dark`) {
        if (device.colorScheme !== `dark`) {
          this.isNull = true;
        } else {
          this.incrementOrder();
        }
      } else if (!this.handlePossibleArbitraryBreakpointPrefix(prefix)) {
        this.isNull = true;
      }
    }
  }

  public parse(): StyleIR {
    if (this.isNull) {
      return { kind: `null` };
    }

    // resolve things like ios:hidden, after prefix removed
    const cached = this.cache.getIr(this.rest);
    if (cached) {
      return cached;
    }

    this.parseIsNegative();
    const ir = this.parseUtility();
    if (!ir) {
      return { kind: `null` };
    }

    if (this.order !== undefined) {
      return { kind: `ordered`, order: this.order, styleIr: ir };
    }

    return ir;
  }

  private parseUtility(): StyleIR | null {
    const theme = this.config.theme;
    let style: StyleIR | null = null;

    switch (this.char) {
      case `m`:
      case `p`: {
        const match = this.peekSlice(1, 3).match(/^(t|b|r|l|x|y)?-/);
        if (match) {
          const prop = this.char === `m` ? `margin` : `padding`;
          this.advance((match[0]?.length ?? 0) + 1);
          const spacingDirection = getDirection(match[1]);
          const style = spacing(
            prop,
            spacingDirection,
            this.isNegative,
            this.rest,
            this.config.theme?.[prop],
          );
          if (style) return style;
        }
      }
    }

    if (this.consumePeeked(`h-`)) {
      style = widthHeight(`height`, this.rest, this.context, theme?.height);
      if (style) return style;
    }

    if (this.consumePeeked(`w-`)) {
      style = widthHeight(`width`, this.rest, this.context, theme?.width);
      if (style) return style;
    }

    if (this.consumePeeked(`min-w-`)) {
      style = minMaxWidthHeight(`minWidth`, this.rest, this.context, theme?.minWidth);
      if (style) return style;
    }

    if (this.consumePeeked(`min-h-`)) {
      style = minMaxWidthHeight(`minHeight`, this.rest, this.context, theme?.minHeight);
      if (style) return style;
    }

    if (this.consumePeeked(`max-w-`)) {
      style = minMaxWidthHeight(`maxWidth`, this.rest, this.context, theme?.maxWidth);
      if (style) return style;
    }

    if (this.consumePeeked(`max-h-`)) {
      style = minMaxWidthHeight(`maxHeight`, this.rest, this.context, theme?.maxHeight);
      if (style) return style;
    }

    if (this.consumePeeked(`leading-`)) {
      style = lineHeight(this.rest, theme?.lineHeight);
      if (style) return style;
    }

    if (this.consumePeeked(`text-`)) {
      style = fontSize(this.rest, theme?.fontSize);
      if (style) return style;

      style = color(`text`, this.rest, theme?.textColor);
      if (style) return style;

      if (this.consumePeeked(`opacity-`)) {
        style = colorOpacity(`text`, this.rest);
        if (style) return style;
      }
    }

    if (this.consumePeeked(`font-`)) {
      style = fontFamily(this.rest, theme?.fontFamily);
      if (style) return style;
    }

    if (this.consumePeeked(`aspect-ratio-`)) {
      style = getCompleteStyle(`aspectRatio`, this.rest, { fractions: true });
      if (style) return style;
    }

    if (this.consumePeeked(`bg-`)) {
      style = color(`bg`, this.rest, theme?.backgroundColor);
      if (style) return style;

      if (this.consumePeeked(`opacity-`)) {
        style = colorOpacity(`bg`, this.rest);
        if (style) return style;
      }
    }

    if (this.consumePeeked(`border`)) {
      style = border(this.rest, theme);
      if (style) return style;

      if (this.consumePeeked(`-opacity-`)) {
        style = colorOpacity(`border`, this.rest);
        if (style) return style;
      }
    }

    if (this.consumePeeked(`rounded`)) {
      style = borderRadius(this.rest, theme?.borderRadius);
      if (style) return style;
    }

    if (this.consumePeeked(`bottom-`)) {
      style = inset(`bottom`, this.rest, this.isNegative, theme?.inset);
      if (style) return style;
    }

    if (this.consumePeeked(`top-`)) {
      style = inset(`top`, this.rest, this.isNegative, theme?.inset);
      if (style) return style;
    }

    if (this.consumePeeked(`left-`)) {
      style = inset(`left`, this.rest, this.isNegative, theme?.inset);
      if (style) return style;
    }

    if (this.consumePeeked(`right-`)) {
      style = inset(`right`, this.rest, this.isNegative, theme?.inset);
      if (style) return style;
    }

    if (this.consumePeeked(`inset-`)) {
      style = inset(`inset`, this.rest, this.isNegative, theme?.inset);
      if (style) return style;
    }

    if (this.consumePeeked(`flex-`)) {
      if (this.consumePeeked(`grow`)) {
        style = flexGrowShrink(`Grow`, this.rest, theme?.flexGrow);
      } else if (this.consumePeeked(`shrink`)) {
        style = flexGrowShrink(`Shrink`, this.rest, theme?.flexShrink);
      } else {
        style = flex(this.rest, theme?.flex);
      }
      if (style) return style;
    }

    if (this.consumePeeked(`shadow-color-opacity-`)) {
      style = colorOpacity(`shadow`, this.rest);
      if (style) return style;
    }

    if (this.consumePeeked(`shadow-opacity-`)) {
      style = shadowOpacity(this.rest);
      if (style) return style;
    }

    if (this.consumePeeked(`shadow-offset-`)) {
      style = shadowOffset(this.rest);
      if (style) return style;
    }

    if (this.consumePeeked(`shadow-radius-`)) {
      style = unconfiggedStyle(`shadowRadius`, this.rest);
      if (style) return style;
    }

    if (this.consumePeeked(`shadow-`)) {
      style = color(`shadow`, this.rest, theme?.colors);
      if (style) return style;
    }

    if (this.consumePeeked(`elevation-`)) {
      const elevation = parseInt(this.rest, 10);
      if (!Number.isNaN(elevation)) {
        return complete({ elevation });
      }
    }

    if (this.consumePeeked(`opacity-`)) {
      style = opacity(this.rest, theme?.opacity);
      if (style) return style;
    }

    if (this.consumePeeked(`tracking-`)) {
      style = letterSpacing(this.rest, this.isNegative, theme?.letterSpacing);
      if (style) return style;
    }

    if (this.consumePeeked(`z-`)) {
      const zIndex = Number(theme?.zIndex?.[this.rest] ?? this.rest);
      if (!Number.isNaN(zIndex)) {
        return complete({ zIndex });
      }
    }

    warn(`\`${this.rest}\` unknown or invalid utility`);
    return null;
  }

  private handlePossibleArbitraryBreakpointPrefix(prefix: string): boolean {
    // save the expense of running the regex with a quick sniff test
    if (prefix[0] !== `m`) return false;

    const match = prefix.match(/^(min|max)-(w|h)-\[([^\]]+)\]$/);
    if (!match) return false;

    if (!this.context.device?.windowDimensions) {
      this.isNull = true;
      return true;
    }

    const windowDims = this.context.device.windowDimensions;
    const [, type = ``, dir = ``, amount = ``] = match;
    const checkDimension = dir === `w` ? windowDims.width : windowDims.height;
    const parsedAmount = parseNumericValue(amount, this.context);
    if (parsedAmount === null) {
      this.isNull = true;
      return true;
    }

    const [bound, unit] = parsedAmount;
    if (unit !== `px`) {
      this.isNull = true;
    }

    if (type === `min` ? checkDimension >= bound : checkDimension <= bound) {
      this.incrementOrder();
    } else {
      this.isNull = true;
    }
    return true;
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
      this.context.isNegative = true;
    }
  }

  private incrementOrder(): void {
    this.order = (this.order ?? 0) + 1;
  }
}
