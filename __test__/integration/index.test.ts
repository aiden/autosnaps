import { sum } from '../../dist/index';

it('also adds when built', () => {
  expect(sum(1, 1)).toBe(2);
});
