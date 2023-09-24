import { mutableHandlers, readonlyHandlers } from './baseHandles';

export function reactive(raw: any) {
  return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw: any) {
  return createActiveObject(raw, readonlyHandlers);
}

function createActiveObject(raw: any, baseHandles: any) {
  return new Proxy(raw, baseHandles);
}
