import { describe, it, test } from '@jest/globals';
import tw from '../tailwind';

describe(`tw()`, () => {
  test('things work', () => {
    expect(tw(`text-blue-500`)).toStrictEqual({ color: `rgba(59, 130, 246, 1)` });
  });
});
