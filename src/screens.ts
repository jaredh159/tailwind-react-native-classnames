import { TwTheme } from './tw-config';
import { toPx } from './resolve/helpers';

type Screens = Record<string, [min: number, max: number, order: number]>;
export default function screens(input?: TwTheme['screens']): Screens {
  if (!input) {
    return {};
  }
  const screenData = Object.entries(input).reduce<Screens>((acc, [screen, value]) => {
    const data: [number, number, number] = [0, Infinity, 0];
    const values = typeof value === `string` ? { min: value } : value;
    const minPx = values.min ? toPx(values.min) : 0;
    if (minPx === undefined) {
      // @TODO: log
    } else {
      data[0] = minPx;
    }
    const maxPx = values.max ? toPx(values.max) : Infinity;
    if (maxPx === undefined) {
      // @TODO: log
    } else {
      data[1] = maxPx;
    }
    acc[screen] = data;
    return acc;
  }, {});

  const values = Object.values(screenData);
  values.sort((a, b) => {
    const [minA, maxA] = a;
    const [minB, maxB] = b;
    if (maxA === Infinity || maxB === Infinity) {
      return minA - minB;
    }
    return maxA - maxB;
  });

  let order = 0;
  values.forEach((value) => (value[2] = order++));

  return screenData;
}
