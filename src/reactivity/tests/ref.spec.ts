import { describe, it, expect } from 'vitest';
import { isRef, proxyRefs, ref, unRef } from '../ref';
import { effect } from '../effect';
import { isProxy, reactive } from '../reactive';

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

  it('isRef', () => {
    const num = ref(1);
    expect(isRef(num)).toBe(true);
    expect(isRef(1)).toBe(false);

    const obj = reactive({
      num: 1
    });
    expect(isRef(obj)).toBe(false);
  });

  it('unRef', () => {
    const num = ref(1);
    expect(unRef(num)).toBe(1);
    expect(unRef(1)).toBe(1);
  });

  it('proxyRefs', () => {
    const user = {
      age: ref(18),
      name: 'anx'
    };

    const proxyUser: any = proxyRefs(user);
    expect(user.age.value).toBe(18);
    expect(proxyUser.age).toBe(18);
    expect(proxyUser.name).toBe('anx');

    proxyUser.age = 20;
    expect(user.age.value).toBe(20);
    expect(proxyUser.age).toBe(20);
    expect(proxyUser.name).toBe('anx');

    proxyUser.age = ref(22);
    expect(proxyUser.age).toBe(22);
    expect(user.age.value).toBe(22);
  });
});
