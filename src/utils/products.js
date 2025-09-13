import { PRICE_RANGES } from '../constants/products';

export const areArraySetsEqual = (a, b) => {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  for (const item of b) if (!setA.has(item)) return false;
  return true;
};

export const areFiltersEqual = (a, b) =>
  a.onSale === b.onSale && areArraySetsEqual(a.priceRanges, b.priceRanges);

export const applyFiltersAndSort = (query, filters, sort) => {
  if (filters?.priceRanges?.length) {
    const selectedExprs = PRICE_RANGES.filter(r => filters.priceRanges.includes(r.id)).map(
      r => r.expr
    );
    if (selectedExprs.length) {
      query = query.or(selectedExprs.join(','));
    }
  }

  if (filters?.onSale) {
    query = query.not('price_old', 'is', null);
  }

  if (sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else if (sort === 'price_asc') {
    query = query.order('price_current', { ascending: true });
  } else if (sort === 'price_desc') {
    query = query.order('price_current', { ascending: false });
  }

  return query;
};
