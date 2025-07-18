export const removeFalsyValues = <T extends Record<string, unknown>>(
  object: T
): Partial<T> => {
  const result: Partial<T> = {};
  const valuesToRemove = [undefined, null, ""];

  for (const key in object) {
    const value = object[key];
    if (!valuesToRemove.includes(value as any)) {
      result[key] = value;
    }
  }

  return result;
};

export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
