import { expect, describe, it } from 'vitest';
import { reactive } from '../reactive';
import { effect } from '../effect';

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10
    });
    // init
    let rAge = undefined;
    effect(() => {
      rAge = user.age + 1;
    });
    expect(rAge).toBe(11);

    // update
    user.age++;
    expect(rAge).toBe(12);
  });

  it('effect runner', () => {
    // effect(fn) -> runner -> fn -> return
    let foo = 10;
    const returnRunner = 'runner';
    // effect return runner
    const runner = effect(() => {
      foo++;
      return returnRunner;
    });

    expect(foo).toBe(11);
    // runner执行会再次调用fn, 并 return fn 返回值
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe(returnRunner);
  });
});
