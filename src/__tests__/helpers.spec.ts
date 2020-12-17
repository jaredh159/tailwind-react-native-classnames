import { describe, it, test } from '@jest/globals';
import { parseInputs } from '../helpers';

jest.mock(`react-native`, () => ({
  Platform: { OS: `ios` },
}));

describe(`parseInputs()`, () => {
  test(`simple single classname`, () => {
    const [cxs, styles] = parseInputs([`foo`]);
    expect(cxs).toStrictEqual([`foo`]);
    expect(styles).toStrictEqual({});
  });

  it(`removes excess whitespace from string classnames`, () => {
    const [cxs, styles] = parseInputs([` foo  `]);
    expect(cxs).toStrictEqual([`foo`]);
    expect(styles).toStrictEqual({});
  });

  it(`can handle multiple string inputs`, () => {
    const [cxs, styles] = parseInputs([`foo`, ` bar`]);
    expect(cxs).toStrictEqual([`foo`, `bar`]);
    expect(styles).toStrictEqual({});
  });

  it(`can handle string arrays`, () => {
    const [cxs, styles] = parseInputs([[`foo`]]);
    expect(cxs).toStrictEqual([`foo`]);
    expect(styles).toStrictEqual({});
  });

  it(`skips over falsy stuff`, () => {
    const [cxs, styles] = parseInputs([`bar`, null, `foo`, false, undefined, ``]);
    expect(cxs).toStrictEqual([`bar`, `foo`]);
    expect(styles).toStrictEqual({});
  });

  it(`handles classnames-style boolean objects`, () => {
    const [cxs, styles] = parseInputs([`foo`, { bar: true, baz: false }]);
    expect(cxs).toStrictEqual([`foo`, `bar`]);
    expect(styles).toStrictEqual({});
  });

  it(`eliminates duplicates`, () => {
    const [cxs, styles] = parseInputs([`foo`, `foo`]);
    expect(cxs).toStrictEqual([`foo`]);
    expect(styles).toStrictEqual({});
  });

  it(`can handle rn-styles`, () => {
    const [cxs, styles] = parseInputs([`foo`, { lineHeight: 33 }]);
    expect(cxs).toStrictEqual([`foo`]);
    expect(styles).toStrictEqual({ lineHeight: 33 });
  });

  it(`can handle mixture of boolean and rn-styles in object`, () => {
    const [cxs, styles] = parseInputs([`foo`, { lineHeight: 33, baz: true, bar: false }]);
    expect(cxs).toStrictEqual([`foo`, `baz`]);
    expect(styles).toStrictEqual({ lineHeight: 33 });
  });
});
