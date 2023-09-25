import { extend } from '../shared';

interface EffectOptions {
  scheduler?: Function;
  onStop?: Function;
}
let activeEffect: any = undefined;
let shouldTrack: boolean = true;

const targetMap = new WeakMap();

class ReactiveEffect {
  private _fn: any;
  deps = [];
  active = true;
  onStop?: Function;
  constructor(fn: Function, public scheduler?: Function) {
    this._fn = fn;
  }
  run() {
    // shouldTrack 来做区分
    if (!this.active) {
      return this._fn();
    }

    shouldTrack = true;
    activeEffect = this;
    const res = this._fn();
    // reset
    shouldTrack = false;

    return res;
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      this.onStop && this.onStop();
      this.active = false;
    }
  }
}

function cleanupEffect(effect: any) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}

// 依赖收集 target -> key -> dep
export function track(target: any, key: any) {
  if (!isTracking()) return;

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

  if (dep.has(activeEffect)) return;

  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

function isTracking() {
  return activeEffect !== undefined && shouldTrack;
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

export function effect(fn: Function, options: EffectOptions = {}) {
  // 抽象出一个类
  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options);

  // 修改函数this问题
  const run: any = _effect.run.bind(_effect);

  run.effect = _effect;

  run();

  return run;
}

export function stop(runner: any) {
  runner.effect.stop();
}
