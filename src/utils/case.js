export const toSnake = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export const keysToSnake = obj =>
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [toSnake(key), value]));

export const toCamel = str => str.replace(/_([a-z])/g, g => g[1].toUpperCase());

export const keysToCamel = obj =>
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [toCamel(key), value]));
