export const PRICE_RANGES = [
  { id: 'lt25', label: '< 25 €', expr: 'price_current.lt.25' },
  { id: '25-40', label: '25 - 40 €', expr: 'and(price_current.gte.25,price_current.lte.40)' },
  { id: '40-60', label: '40 - 60 €', expr: 'and(price_current.gte.40,price_current.lte.60)' },
  { id: '65-90', label: '65 - 90 €', expr: 'and(price_current.gte.65,price_current.lte.90)' },
  { id: 'gt90', label: '> 90 €', expr: 'price_current.gt.90' },
];

export const DEFAULT_FILTERS = { priceRanges: [], onSale: false };

export const SORT_OPTIONS = [
  { id: 'recommended', title: 'The top picks', label: 'We recommend' },
  { id: 'newest', title: 'The newest arrivals', label: 'Newest' },
  { id: 'price_asc', title: 'Lowest price', label: 'Low to High' },
  { id: 'price_desc', title: 'Highest price', label: 'High to Low' },
];
