import { describe, expect, it, vi } from 'vitest';

import { isReadonly, shallowReadonly } from '../reactive';

describe('shallowReadonly', () => {
  it('should not make props readonly', () => {
    const original = { n: { foo: 1 } };
    const wrapped = shallowReadonly(original);

    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(wrapped.n)).toBe(false);
  });

  it('warning when shallowReadonly call setter', () => {
    const obj = shallowReadonly({
      foo: 1
    });
    console.warn = vi.fn();

    obj.foo = 2;

    expect(console.warn).toHaveBeenCalled();
  });
});
