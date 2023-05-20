import { create } from "..";

describe(`ir caching between breakpoints`, () => {
  let tw = create();

  const cases: Array<
    [
      dims: { width: number; height: number } | null,
      utility: string,
      expected: Record<string, string | number>
    ]
  > = [
    [{ width: 1100, height: 600 }, `w-3`, { width: 12 }],
    [{ width: 1100, height: 600 }, `w-1 lg:w-3`, { width: 12 }],
    [{ width: 1100, height: 600 }, `w-1 md:w-2 lg:w-3`, { width: 12 }],
  ];

  test.each(cases)(`tw\`%s\` -> %s`, (dims, utility, expected) => {
    if (dims) {
      tw.setWindowDimensions(dims);
    }
    expect(tw.style(utility)).toEqual(expected);
  });
});
