import { describe, expect, it, vi } from 'vitest';
import { isReadonly, readonly } from '../reactive';

describe('readonly', () => {
  it('happy path', () => {
    // not set
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);

    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);

    expect(isReadonly(original)).toBe(false);
    expect(isReadonly(wrapped)).toBe(true);
  });

  it('warning when readonly call setter', () => {
    const obj = readonly({
      foo: 1
    });
    console.warn = vi.fn();

    obj.foo = 2;

    expect(console.warn).toBeCalled();
  });
});
