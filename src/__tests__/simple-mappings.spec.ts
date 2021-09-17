import { describe, test, expect } from '@jest/globals';
import { create } from '../';
import { Style } from '../types';

describe(`simple style mappings`, () => {
  const tw = create();

  const cases: Array<[string, Style]> = [
    [`items-start`, { alignItems: `flex-start` }],
    [`items-end`, { alignItems: `flex-end` }],
    [`items-center`, { alignItems: `center` }],
    [`items-baseline`, { alignItems: `baseline` }],
    [`items-stretch`, { alignItems: `stretch` }],
    [`content-start`, { alignContent: `flex-start` }],
    [`content-end`, { alignContent: `flex-end` }],
    [`content-between`, { alignContent: `space-between` }],
    [`content-around`, { alignContent: `space-around` }],
    [`content-stretch`, { alignContent: `stretch` }],
    [`content-center`, { alignContent: `center` }],
    [`self-auto`, { alignSelf: `auto` }],
    [`self-start`, { alignSelf: `flex-start` }],
    [`self-end`, { alignSelf: `flex-end` }],
    [`self-center`, { alignSelf: `center` }],
    [`self-stretch`, { alignSelf: `stretch` }],
    [`self-baseline`, { alignSelf: `baseline` }], // * @TODO: RN only
    [`direction-inherit`, { direction: `inherit` }], // * @TODO: RN only
    [`direction-ltr`, { direction: `ltr` }], // * @TODO: RN only
    [`direction-rtl`, { direction: `rtl` }], // * @TODO: RN only
    [`hidden`, { display: `none` }],
    [`flex`, { display: `flex` }],
    [`flex-row`, { flexDirection: `row` }],
    [`flex-row-reverse`, { flexDirection: `row-reverse` }],
    [`flex-col`, { flexDirection: `column` }],
    [`flex-col-reverse`, { flexDirection: `column-reverse` }],
    [`flex-wrap`, { flexWrap: `wrap` }],
    [`flex-wrap-reverse`, { flexWrap: `wrap-reverse` }],
    [`flex-nowrap`, { flexWrap: `nowrap` }],
    [`justify-start`, { justifyContent: `flex-start` }],
    [`justify-end`, { justifyContent: `flex-end` }],
    [`justify-center`, { justifyContent: `center` }],
    [`justify-between`, { justifyContent: `space-between` }],
    [`justify-around`, { justifyContent: `space-around` }],
    [`justify-evenly`, { justifyContent: `space-evenly` }],
    [`overflow-hidden`, { overflow: `hidden` }],
    [`overflow-visible`, { overflow: `visible` }],
    [`overflow-scroll`, { overflow: `scroll` }],
    [`absolute`, { position: `absolute` }],
    [`relative`, { position: `relative` }],
    [`italic`, { fontStyle: `italic` }],
    [`not-italic`, { fontStyle: `normal` }],

    [`font-thin`, { fontWeight: `100` }],
    [`font-100`, { fontWeight: `100` }], // not in tailwindcss
    [`font-extralight`, { fontWeight: `200` }],
    [`font-200`, { fontWeight: `200` }], // not in tailwindcss
    [`font-light`, { fontWeight: `300` }],
    [`font-300`, { fontWeight: `300` }], // not in tailwindcss
    [`font-normal`, { fontWeight: `normal` }],
    [`font-400`, { fontWeight: `400` }], // not in tailwindcss
    [`font-medium`, { fontWeight: `500` }],
    [`font-500`, { fontWeight: `500` }], // not in tailwindcss
    [`font-semibold`, { fontWeight: `600` }],
    [`font-600`, { fontWeight: `600` }], // not in tailwindcss
    [`font-bold`, { fontWeight: `bold` }],
    [`font-700`, { fontWeight: `700` }], // not in tailwindcss
    [`font-extrabold`, { fontWeight: `800` }],
    [`font-800`, { fontWeight: `800` }], // not in tailwindcss
    [`font-black`, { fontWeight: `900` }],
    [`font-900`, { fontWeight: `900` }], // not in tailwindcss

    [`include-font-padding`, { includeFontPadding: true }],
    [`remove-font-padding`, { includeFontPadding: false }],

    [`text-left`, { textAlign: `left` }],
    [`text-center`, { textAlign: `center` }],
    [`text-right`, { textAlign: `right` }],
    [`text-justify`, { textAlign: `justify` }],
    [`text-auto`, { textAlign: `auto` }], // RN only

    [`underline`, { textDecorationLine: `underline` }],
    [`line-through`, { textDecorationLine: `line-through` }],
    [`no-underline`, { textDecorationLine: `none` }],

    [`uppercase`, { textTransform: `uppercase` }],
    [`lowercase`, { textTransform: `lowercase` }],
    [`capitalize`, { textTransform: `capitalize` }],
    [`normal-case`, { textTransform: `none` }],
  ];

  test.each(cases)(`utility %s -> %s`, (utility, style) => {
    expect(tw.style(utility)).toMatchObject(style);
  });
});
