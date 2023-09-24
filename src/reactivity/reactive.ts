import { mutableHandlers, readonlyHandlers } from './baseHandles';

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

export function reactive(raw: any) {
  return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw: any) {
  return createActiveObject(raw, readonlyHandlers);
}

export function isReactive(value: any) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

function createActiveObject(raw: any, baseHandles: any) {
  return new Proxy(raw, baseHandles);
}
