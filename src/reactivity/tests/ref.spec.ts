import { describe, it, expect } from 'vitest';
import { ref } from '../ref';
import { effect } from '../effect';

describe('ref', () => {
  it('happy path', () => {
    const obj = ref(1);
    expect(obj.value).toBe(1);
  });

  it('should be reactive', () => {
    const obj = ref(1);
    let dummy;
    let calls = 0;

    effect(() => {
      calls++;
      dummy = obj.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    obj.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);

    // same value should not trigger
    obj.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  });

  it('nested props', () => {
    const obj = ref({
      num: 1
    });
    let dummy;
    effect(() => {
      dummy = obj.value.num;
    });

    expect(dummy).toBe(1);
    obj.value.num = 2;
    expect(dummy).toBe(2);
  });
});
