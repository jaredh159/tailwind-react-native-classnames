import { describe, test } from '@jest/globals';
import { fontFamilyStyle } from '../font-family';
import { Style } from '../types';

describe(`fontFamilyStyle()`, () => {
  const cases: Array<[unknown, Style | null]> = [
    [undefined, null],
    [[`lol`], null],
    [`NotoSansTC, sans-serif`, { fontFamily: `NotoSansTC` }],
    [`NotoSansTC`, { fontFamily: `NotoSansTC` }],
    [`"NotoSansTC", sans-serif`, { fontFamily: `NotoSansTC` }],
    [`"Noto,SansTC", sans-serif`, { fontFamily: `Noto,SansTC` }],
  ];

  test.each(cases)(`selector=%s, value=%s`, (value, expectedStyle) => {
    if (expectedStyle === null) {
      expect(fontFamilyStyle(value)).toBeNull();
    } else {
      expect(fontFamilyStyle(value)).toMatchObject(expectedStyle);
    }
  });
});
