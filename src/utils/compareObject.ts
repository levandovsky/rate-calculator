export const shallowEqual = (obj1: object, obj2: object) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  let isEqual = false;

  for (const key of keys1) {
    const hasKey = Reflect.has(obj2, key);

    if (!hasKey) {
      isEqual = false;
      break;
    }

    const val1 = Reflect.get(obj1, key);
    const val2 = Reflect.get(obj2, key);

    isEqual = val1 === val2;

    if (!isEqual) break;
  }

  return isEqual;
};
