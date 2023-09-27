import { describe, it, expect, vi } from 'vitest';
import { reactive } from '../reactive';
import { computed } from '../computed';

describe('computed', () => {
  it('happy path', () => {
    const user = reactive({
      age: 1
    });

    const age = computed(() => user.age);

    expect(age.value).toBe(1);
  });

  it('should computed lazily', () => {
    // computed缓存功能
    const obj = reactive({
      num: 1
    });
    const getter = vi.fn(() => obj.num);
    const cValue = computed(getter);
    // lazy
    expect(getter).not.toHaveBeenCalled();

    // should not recomputed
    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // should not recomputed until needed
    obj.num = 2;
    expect(getter).toHaveBeenCalledTimes(1);

    // should recomputed when called computed.value
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
