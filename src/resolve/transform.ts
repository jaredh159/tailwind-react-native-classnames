import type { TwTheme } from '../tw-config';
import type { DependentStyle, ParseContext, Style, StyleIR } from '../types';
import { parseStyleVal, parseUnconfigged } from '../helpers';

function scale(
  value: string,
  context: ParseContext = {},
  config?: TwTheme['scale'],
): DependentStyle | null {
  let scaleAxis = ``;

  value = value.replace(/^(x|y)-/, (_, axis) => {
    scaleAxis = axis.toUpperCase();
    return ``;
  });

  const configValue = config?.[value];
  const styleVal = configValue
    ? parseStyleVal(configValue, context)
    : parseUnconfigged(value, context);

  if (styleVal === null) {
    return null;
  }

  return {
    kind: `dependent`,
    complete(style) {
      let transform = (style.transform as Style[]) ?? [];
      const key = `scale${scaleAxis}`;

      if (transform.length > 0) {
        transform = transform.filter((transformItem) => transformItem[key] !== undefined);
      }

      transform.push({
        [key]: styleVal,
      });

      style.transform = transform;
    },
  };
}

export function transform(
  type: 'scale',
  value: string,
  context: ParseContext = {},
  config?: TwTheme['scale'],
): StyleIR | null {
  if (type === `scale`) {
    return scale(value, context, config);
  }

  return null;
}
