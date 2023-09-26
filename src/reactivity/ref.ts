import { hasChanged, isObject } from '../shared';
import { isTracking, trackEffects, triggerEffects } from './effect';
import { reactive } from './reactive';

class RefImpl {
  private _value: any;
  public dep;
  private _rawValue: any;
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
