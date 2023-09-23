class ReactiveEffect {
  private _fn: any;

  constructor(fn: Function) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    this._fn();
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
    effect.run();
  }
}

let activeEffect: any = undefined;
export function effect(fn: Function) {
  // 抽象出一个类
  const _effect = new ReactiveEffect(fn);

  _effect.run();
}
