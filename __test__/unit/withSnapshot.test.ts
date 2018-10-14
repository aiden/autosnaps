import { withSnapshot } from '../../src/index';

describe('withSnapshot', () => {
  it('calls inner function when wrapped function is called', () => {
    const mockFunction = jest.fn();
    withSnapshot(mockFunction)();
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it('returns the same as inner function when wrapped function is called', () => {
    const mockFunction = jest.fn((a: number, b: number) => a + b);
    expect(withSnapshot(mockFunction)(2, 3)).toBe(5);
  });

  it('preserves this', () => {
    expect.assertions(1);
    const mockThis = {};
    function mockFunction() {
      expect(this).toBe(mockThis);
    }
    const mockFunctionWithSnapshot = withSnapshot(mockFunction);
    mockFunctionWithSnapshot.call(mockThis);
  });
});
