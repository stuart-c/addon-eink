import { expect, test, vi } from 'vitest';
import { main } from '../index.js';

test('outputs "hello world"', () => {
  const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  main();
  expect(logSpy).toHaveBeenCalledWith('hello world');
  logSpy.mockRestore();
});
