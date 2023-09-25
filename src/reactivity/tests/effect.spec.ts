import { expect, describe, it, vi } from 'vitest';
import { reactive } from '../reactive';
import { effect, stop } from '../effect';

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

  it('scheduler', () => {
    // 1. 通过 effect 第二个参数，给定一个 scheduler的 fn
    // 2. effect第一次执行的时候，还会执行第一个参数的fn
    // 3. 当响应式对象 set update 的时候，不执行第一个参数的fn，而是执行scheduler
    // 4. 执行 effect 返回值 runner 的时候，会再次执行第一个参数的fn
    let dummy;
    let run: any;

    const scheduler = vi.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });

    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        scheduler
      }
    );
    // 刚开始执行fn，不执行scheduler
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);

    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // should not run yet
    expect(dummy).toBe(1);

    run();
    // should have run
    expect(dummy).toBe(2);
  });

  it('stop', () => {
    let dummy;
    const obj = reactive({ foo: 1 });
    const runner = effect(() => {
      dummy = obj.foo;
    });

    obj.foo = 2;
    expect(dummy).toBe(2);

    stop(runner);

    obj.foo = 3;
    expect(dummy).toBe(2);
    // obj.foo = obj.foo + 1
    // get set
    obj.foo++;
    expect(dummy).toBe(2);

    runner();
    expect(dummy).toBe(4);
  });

  it('onStop', () => {
    const obj = reactive({ foo: 1 });
    const onStop = vi.fn();

    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        onStop
      }
    );
    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });
});
