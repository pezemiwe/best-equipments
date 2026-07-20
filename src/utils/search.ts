// Relevance-scored product search with typo tolerance.
//
// Scoring per query token, against name/brand/category/description:
//   exact word match      – full field weight
//   word prefix match     – 80% of field weight
//   substring match       – 50% of field weight
//   fuzzy match (edit
//   distance <= threshold)– 35% of field weight
// A product must match every query token (in any field) to be included.

const FIELD_WEIGHTS: [field: string, weight: number][] = [
  ['name', 10],
  ['brand', 6],
  ['category', 4],
  ['description', 2],
];

const tokenize = (value: string): string[] =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

// Iterative two-row Levenshtein distance.
export const editDistance = (a: string, b: string): number => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = curr;
  }
  return prev[b.length];
};

// Words of 5+ chars tolerate 1 typo; 8+ chars tolerate 2.
const fuzzyThreshold = (word: string) =>
  word.length >= 8 ? 2 : word.length >= 5 ? 1 : 0;

const scoreTokenInField = (token: string, fieldWords: string[]): number => {
  let best = 0;
  for (const word of fieldWords) {
    if (word === token) return 1;
    if (word.startsWith(token)) best = Math.max(best, 0.8);
    else if (word.includes(token)) best = Math.max(best, 0.5);
    else {
      const threshold = fuzzyThreshold(token);
      if (threshold > 0 && Math.abs(word.length - token.length) <= threshold) {
        if (editDistance(token, word) <= threshold) {
          best = Math.max(best, 0.35);
        }
      }
    }
  }
  return best;
};

export const scoreProduct = (product: any, query: string): number => {
  const tokens = tokenize(query);
  if (!tokens.length) return 1;

  const fieldWords: Record<string, string[]> = {};
  for (const [field] of FIELD_WEIGHTS) {
    fieldWords[field] = tokenize(String(product[field] || ''));
  }

  let total = 0;
  for (const token of tokens) {
    let tokenScore = 0;
    for (const [field, weight] of FIELD_WEIGHTS) {
      tokenScore = Math.max(
        tokenScore,
        scoreTokenInField(token, fieldWords[field]) * weight
      );
    }
    if (tokenScore === 0) return 0; // every token must match somewhere
    total += tokenScore;
  }
  return total;
};

export type SortOption =
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'name';

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Most relevant' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'newest', label: 'Newest arrivals' },
  { value: 'name', label: 'Name: A to Z' },
];

// Filters by query (relevance-scored) then sorts. In-stock items always rank
// above out-of-stock ones regardless of sort.
export const searchAndSort = (
  products: any[],
  query: string,
  sort: SortOption
): any[] => {
  const scored = products
    .map((product) => ({ product, score: scoreProduct(product, query) }))
    .filter((entry) => entry.score > 0);

  const comparators: Record<SortOption, (a: any, b: any) => number> = {
    relevance: (a, b) => b.score - a.score,
    'price-asc': (a, b) => (a.product.amount || 0) - (b.product.amount || 0),
    'price-desc': (a, b) => (b.product.amount || 0) - (a.product.amount || 0),
    newest: (a, b) => (b.product.createdAt || 0) - (a.product.createdAt || 0),
    name: (a, b) =>
      String(a.product.name).localeCompare(String(b.product.name)),
  };

  return scored
    .sort((a, b) => {
      const stockDelta =
        Number(b.product.inStock !== false) - Number(a.product.inStock !== false);
      if (stockDelta !== 0) return stockDelta;
      return comparators[sort](a, b);
    })
    .map((entry) => entry.product);
};

// Related products: same category first, then shared brand, ranked by price
// proximity (log-scale so ₦10k vs ₦12k is "closer" than ₦10k vs ₦100k).
export const relatedProducts = (
  products: any[],
  current: any,
  limit = 4
): any[] => {
  if (!current) return [];
  return products
    .filter((p) => p.id !== current.id && p.inStock !== false)
    .map((p) => {
      let score = 0;
      if (p.category === current.category) score += 10;
      if (p.brand && p.brand === current.brand) score += 4;
      const priceGap = Math.abs(
        Math.log((p.amount || 1) + 1) - Math.log((current.amount || 1) + 1)
      );
      score -= priceGap;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.p);
};
