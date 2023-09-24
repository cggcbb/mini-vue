import { track, trigger } from './effect';

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

function createGetter(isReadonly: boolean = false) {
  return function get(target: any, key: any, receiver: any) {
    const res = Reflect.get(target, key, receiver);

    if (!isReadonly) {
      // 依赖收集
      track(target, key);
    }
    return res;
  };
}

function createSetter() {
  return function set(target: any, key: any, value: any, receiver: any) {
    const res = Reflect.set(target, key, value, receiver);
    // 派发更新（ 触发依赖 ）
    trigger(target, key);
    return res;
  };
}

export const mutableHandlers = {
  get,
  set
};

export const readonlyHandlers = {
  get: readonlyGet,
  set(target: any, key: any, value: any) {
    console.warn(
      `key: '${key}' set '${value}' 失败，因为 target 设置了readonly`,
      target
    );
    return true;
  }
};
