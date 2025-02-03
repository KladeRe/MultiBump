import { describe, expect, test } from '@jest/globals';

const sum = (a: number, b: number): number => a + b;

describe('Basic Test Suite', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });

  test('true should be true', () => {
    expect(true).toBe(true);
  });

  test('array contains specific item', () => {
    const array = ['apple', 'banana', 'orange'];
    expect(array).toContain('banana');
  });
});