import { baseHeartConfig } from '@constants/animation';
import { generateHearts } from '@util/animation';

describe('generateHearts', () => {
  const originalMathRandom = Math.random;

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    Math.random = originalMathRandom;
  });

  it('Returns an array with the given count.', () => {
    const result = generateHearts(10);
    expect(result).toHaveLength(10);
  });

  it('Defaults to 25 when no count is provided.', () => {
    const result = generateHearts();
    expect(result).toHaveLength(25);
  });

  it('Cycles through baseHeartConfig with modulo index.', () => {
    const count = baseHeartConfig.length * 2 + 1;
    const result = generateHearts(count);
    for (let i = 0; i < count; i++) {
      expect(typeof result[i].delay).toBe('number');
      expect(typeof result[i].baseOffsetX).toBe('number');
      expect(typeof result[i].baseOffsetY).toBe('number');
      expect(typeof result[i].baseSize).toBe('number');
    }
  });

  it('Produces randomized values within expected bounds.', () => {
    Math.random = () => 0.5;

    const result = generateHearts(1);
    const base = baseHeartConfig[0];

    expect(result[0].delay).toBeCloseTo(base.delay + 5);
    expect(result[0].baseOffsetY).toBeCloseTo(base.baseOffsetY);
    expect(result[0].baseOffsetX).toBeCloseTo(base.baseOffsetX);
    expect(result[0].baseSize).toBeCloseTo(base.baseSize);
  });

  it('Handles zero count gracefully.', () => {
    const result = generateHearts(0);
    expect(result).toEqual([]);
  });
});
