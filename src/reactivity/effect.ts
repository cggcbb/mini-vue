interface EffectOptions {
  scheduler?: Function;
}

class ReactiveEffect {
  private _fn: any;

  constructor(fn: Function, public scheduler?: Function) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
}

const targetMap = new WeakMap();

// 依赖收集 target -> key -> dep
export function track(target: any, key: any) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  dep.add(activeEffect);
}

// 派发更新（ 触发依赖 ）target -> key -> dep -> effect
export function trigger(target: any, key: any) {
  const depsMap = targetMap.get(target);
  const dep = depsMap.get(key);

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

let activeEffect: any = undefined;
export function effect(fn: Function, options: EffectOptions = {}) {
  // 抽象出一个类
  const _effect = new ReactiveEffect(fn, options.scheduler);

  // 修改函数this问题
  const run = _effect.run.bind(_effect);

  run();

  return run;
}
