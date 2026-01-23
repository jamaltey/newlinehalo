export const buildCartKey = (productId, size, colorId) =>
  `${productId ?? 'unknown'}__${size ?? ''}__${colorId ?? ''}`;

export const normalizeNumber = value => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

export const normalizeQuantity = value => {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 1;
  return Math.floor(n);
};
