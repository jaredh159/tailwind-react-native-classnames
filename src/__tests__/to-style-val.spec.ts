import { toStyleVal } from '../helpers';
import { Unit } from '../types';

describe(`toStyleVal`, () => {
  // rem
  it(`converts a number to rem`, () => {
    expect(toStyleVal(16, Unit.rem)).toBe(256);
    expect(toStyleVal(16, Unit.rem, { isNegative: true })).toBe(-256);
  });

  // px
  it(`converts a number to px`, () => {
    expect(toStyleVal(16, Unit.px)).toBe(16);
    expect(toStyleVal(16, Unit.px, { isNegative: true })).toBe(-16);
  });

  // percent
  it(`converts a number to percent`, () => {
    expect(toStyleVal(16, Unit.percent)).toBe(`16%`);
    expect(toStyleVal(16, Unit.percent, { isNegative: true })).toBe(`-16%`);
  });

  // none
  it(`converts a number to none`, () => {
    expect(toStyleVal(16, Unit.none)).toBe(16);
    expect(toStyleVal(16, Unit.none, { isNegative: true })).toBe(-16);
  });

  // vw
  it(`converts a number to vw`, () => {
    expect(
      toStyleVal(125, Unit.vw, {
        device: { windowDimensions: { width: 375, height: 768 } },
      }),
    ).toBe(468.75);
    expect(toStyleVal(16, Unit.vw)).toBe(null);
  });

  // vh
  it(`converts a number to vh`, () => {
    expect(
      toStyleVal(192, Unit.vh, {
        device: { windowDimensions: { width: 375, height: 768 } },
      }),
    ).toBe(1474.56);
    expect(toStyleVal(16, Unit.vw)).toBe(null);
  });

  // unknown
  it(`returns null for an unknown unit`, () => {
    expect(toStyleVal(16, `unknown` as Unit)).toBe(null);
  });
});
