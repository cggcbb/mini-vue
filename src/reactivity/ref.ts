import { hasChanged, isObject } from '../shared';
import { isTracking, trackEffects, triggerEffects } from './effect';
import { reactive } from './reactive';

class RefImpl {
  private _value: any;
  public dep;
  private _rawValue: any;
  private __v_isRef = true;
  constructor(value: any) {
    this._rawValue = value;
    // value 是否是对象
    this._value = convert(value);
    this.dep = new Set();
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    // newVal -> this._value
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = convert(newVal);
      triggerEffects(this.dep);
    }
  }
}

function convert(value: any) {
  return isObject(value) ? reactive(value) : value;
}

function trackRefValue(ref: any) {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}

export function ref(value: any) {
  return new RefImpl(value);
}

export function isRef(ref: any) {
  return !!ref.__v_isRef;
}

export function unRef(ref: any) {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs<T extends object>(objectWithRefs: T) {
  return new Proxy(objectWithRefs, {
    get(target, key, receiver) {
      return unRef(Reflect.get(target, key, receiver));
    },
    set(target: any, key, value, receiver) {
      const oldValue = target[key];
      if (isRef(oldValue) && !isRef(value)) {
        return (oldValue.value = value);
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    }
  });
}
