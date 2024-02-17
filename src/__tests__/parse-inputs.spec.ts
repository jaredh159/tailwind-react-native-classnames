import { parseInputs } from '../parse-inputs';

describe(`parseInputs`, () => {
  it(`parses a string`, () => {
    expect(parseInputs([`foo`])).toEqual([[`foo`], null]);
  });

  it(`parses an array of strings`, () => {
    expect(parseInputs([[`foo`, `bar`]])).toEqual([[`foo`, `bar`], null]);
  });

  it(`parses an object`, () => {
    expect(parseInputs([{ foo: true }])).toEqual([[`foo`], null]);
  });

  it(`parses an array of objects`, () => {
    expect(parseInputs([{ foo: true }, { bar: true }])).toEqual([[`foo`, `bar`], null]);
  });

  it(`parses an array of mixed inputs`, () => {
    expect(parseInputs([`foo`, { bar: true }])).toEqual([[`foo`, `bar`], null]);
  });

  it(`parses an array of mixed inputs with styles`, () => {
    expect(parseInputs([`foo`, { bar: true, color: `red` }])).toEqual([
      [`foo`, `bar`],
      { color: `red` },
    ]);
  });

  it(`parses an array of mixed inputs with styles and classNames`, () => {
    expect(parseInputs([`foo`, { bar: true, color: `red` }, `baz`])).toEqual([
      [`foo`, `bar`, `baz`],
      { color: `red` },
    ]);
  });
});
