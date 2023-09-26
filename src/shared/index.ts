export const extend = Object.assign;

export const isObject = (value: any) => {
  return value !== null && typeof value === 'object';
};

export const hasChanged = (value: any, oldValue: any): boolean => {
  return !Object.is(value, oldValue);
};
