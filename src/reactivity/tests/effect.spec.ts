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
});
