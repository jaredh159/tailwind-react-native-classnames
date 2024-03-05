import type { StyleIR, DependentStyle } from './types';
import { complete } from './helpers';

const defaultStyles: Array<[string, StyleIR]> = [
  [`aspect-square`, complete({ aspectRatio: 1 })],
  [`aspect-video`, complete({ aspectRatio: 16 / 9 })],
  [`items-center`, complete({ alignItems: `center` })],
  [`items-start`, complete({ alignItems: `flex-start` })],
  [`items-end`, complete({ alignItems: `flex-end` })],
  [`items-baseline`, complete({ alignItems: `baseline` })],
  [`items-stretch`, complete({ alignItems: `stretch` })],
  [`justify-start`, complete({ justifyContent: `flex-start` })],
  [`justify-end`, complete({ justifyContent: `flex-end` })],
  [`justify-center`, complete({ justifyContent: `center` })],
  [`justify-between`, complete({ justifyContent: `space-between` })],
  [`justify-around`, complete({ justifyContent: `space-around` })],
  [`justify-evenly`, complete({ justifyContent: `space-evenly` })],
  [`content-start`, complete({ alignContent: `flex-start` })],
  [`content-end`, complete({ alignContent: `flex-end` })],
  [`content-between`, complete({ alignContent: `space-between` })],
  [`content-around`, complete({ alignContent: `space-around` })],
  [`content-stretch`, complete({ alignContent: `stretch` })],
  [`content-center`, complete({ alignContent: `center` })],
  [`self-auto`, complete({ alignSelf: `auto` })],
  [`self-start`, complete({ alignSelf: `flex-start` })],
  [`self-end`, complete({ alignSelf: `flex-end` })],
  [`self-center`, complete({ alignSelf: `center` })],
  [`self-stretch`, complete({ alignSelf: `stretch` })],
  [`self-baseline`, complete({ alignSelf: `baseline` })],

  [`direction-inherit`, complete({ direction: `inherit` })],
  [`direction-ltr`, complete({ direction: `ltr` })],
  [`direction-rtl`, complete({ direction: `rtl` })],

  [`hidden`, complete({ display: `none` })],
  [`flex`, complete({ display: `flex` })],

  [`flex-row`, complete({ flexDirection: `row` })],
  [`flex-row-reverse`, complete({ flexDirection: `row-reverse` })],
  [`flex-col`, complete({ flexDirection: `column` })],
  [`flex-col-reverse`, complete({ flexDirection: `column-reverse` })],
  [`flex-wrap`, complete({ flexWrap: `wrap` })],
  [`flex-wrap-reverse`, complete({ flexWrap: `wrap-reverse` })],
  [`flex-nowrap`, complete({ flexWrap: `nowrap` })],

  [`flex-auto`, complete({ flexGrow: 1, flexShrink: 1, flexBasis: `auto` })],
  [`flex-initial`, complete({ flexGrow: 0, flexShrink: 1, flexBasis: `auto` })],
  [`flex-none`, complete({ flexGrow: 0, flexShrink: 0, flexBasis: `auto` })],

  [`overflow-hidden`, complete({ overflow: `hidden` })],
  [`overflow-visible`, complete({ overflow: `visible` })],
  [`overflow-scroll`, complete({ overflow: `scroll` })],

  [`absolute`, complete({ position: `absolute` })],
  [`relative`, complete({ position: `relative` })],

  [`italic`, complete({ fontStyle: `italic` })],
  [`not-italic`, complete({ fontStyle: `normal` })],

  [`oldstyle-nums`, fontVariant(`oldstyle-nums`)],
  [`small-caps`, fontVariant(`small-caps`)],
  [`lining-nums`, fontVariant(`lining-nums`)],
  [`tabular-nums`, fontVariant(`tabular-nums`)],
  [`proportional-nums`, fontVariant(`proportional-nums`)],

  [`font-thin`, complete({ fontWeight: `100` })],
  [`font-100`, complete({ fontWeight: `100` })],
  [`font-extralight`, complete({ fontWeight: `200` })],
  [`font-200`, complete({ fontWeight: `200` })],
  [`font-light`, complete({ fontWeight: `300` })],
  [`font-300`, complete({ fontWeight: `300` })],
  [`font-normal`, complete({ fontWeight: `normal` })],
  [`font-400`, complete({ fontWeight: `400` })],
  [`font-medium`, complete({ fontWeight: `500` })],
  [`font-500`, complete({ fontWeight: `500` })],
  [`font-semibold`, complete({ fontWeight: `600` })],
  [`font-600`, complete({ fontWeight: `600` })],
  [`font-bold`, complete({ fontWeight: `bold` })],
  [`font-700`, complete({ fontWeight: `700` })],
  [`font-extrabold`, complete({ fontWeight: `800` })],
  [`font-800`, complete({ fontWeight: `800` })],
  [`font-black`, complete({ fontWeight: `900` })],
  [`font-900`, complete({ fontWeight: `900` })],

  [`include-font-padding`, complete({ includeFontPadding: true })],
  [`remove-font-padding`, complete({ includeFontPadding: false })],

  // not sure if RN supports `max-width: none;`, but this should be equivalent
  [`max-w-none`, complete({ maxWidth: `99999%` })],

  [`text-left`, complete({ textAlign: `left` })],
  [`text-center`, complete({ textAlign: `center` })],
  [`text-right`, complete({ textAlign: `right` })],
  [`text-justify`, complete({ textAlign: `justify` })],
  [`text-auto`, complete({ textAlign: `auto` })], // RN only

  [`underline`, complete({ textDecorationLine: `underline` })],
  [`line-through`, complete({ textDecorationLine: `line-through` })],
  [`no-underline`, complete({ textDecorationLine: `none` })],

  [`uppercase`, complete({ textTransform: `uppercase` })],
  [`lowercase`, complete({ textTransform: `lowercase` })],
  [`capitalize`, complete({ textTransform: `capitalize` })],
  [`normal-case`, complete({ textTransform: `none` })],

  [`w-auto`, complete({ width: `auto` })],
  [`h-auto`, complete({ height: `auto` })],

  [`basis-auto`, complete({ flexBasis: `auto` })],
  [`flex-basis-auto`, complete({ flexBasis: `auto` })],

  [`align-auto`, complete({ verticalAlign: `auto` })],
  [`align-top`, complete({ verticalAlign: `top` })],
  [`align-bottom`, complete({ verticalAlign: `bottom` })],
  [`align-middle`, complete({ verticalAlign: `middle` })],

  // default box-shadow implementations
  [
    `shadow-sm`,
    complete({
      shadowOffset: { width: 1, height: 1 },
      shadowColor: `#000`,
      shadowRadius: 1,
      shadowOpacity: 0.025,
      elevation: 1,
    }),
  ],
  [
    `shadow`,
    complete({
      shadowOffset: { width: 1, height: 1 },
      shadowColor: `#000`,
      shadowRadius: 1,
      shadowOpacity: 0.075,
      elevation: 2,
    }),
  ],
  [
    `shadow-md`,
    complete({
      shadowOffset: { width: 1, height: 1 },
      shadowColor: `#000`,
      shadowRadius: 3,
      shadowOpacity: 0.125,
      elevation: 3,
    }),
  ],
  [
    `shadow-lg`,
    complete({
      shadowOffset: { width: 1, height: 1 },
      shadowColor: `#000`,
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    }),
  ],
  [
    `shadow-xl`,
    complete({
      shadowOffset: { width: 1, height: 1 },
      shadowColor: `#000`,
      shadowOpacity: 0.19,
      shadowRadius: 20,
      elevation: 12,
    }),
  ],
  [
    `shadow-2xl`,
    complete({
      shadowOffset: { width: 1, height: 1 },
      shadowColor: `#000`,
      shadowOpacity: 0.25,
      shadowRadius: 30,
      elevation: 16,
    }),
  ],
  [
    `shadow-none`,
    complete({
      shadowOffset: { width: 0, height: 0 },
      shadowColor: `#000`,
      shadowRadius: 0,
      shadowOpacity: 0,
      elevation: 0,
    }),
  ],
];

export default defaultStyles;

function fontVariant(type: string): DependentStyle {
  return {
    kind: `dependent`,
    complete(style) {
      if (!style.fontVariant || !Array.isArray(style.fontVariant)) {
        style.fontVariant = [];
      }
      style.fontVariant.push(type);
    },
  };
}
