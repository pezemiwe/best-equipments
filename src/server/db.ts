import { neon } from '@neondatabase/serverless';

// Postgres (Neon) is used when DATABASE_URL is set; otherwise the stores fall
// back to local JSON files so development works with zero configuration.
export const hasDatabase = () => {
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing. The file-store fallback is development-only and will not work on Netlify. Please set DATABASE_URL in Netlify > Site settings > Environment variables.');
  }
  return !!process.env.DATABASE_URL && process.env.STORE_BACKEND !== 'file';
};

let client: ReturnType<typeof neon> | null = null;
let schemaReady: Promise<void> | null = null;

export const sql = (): ReturnType<typeof neon> => {
  if (!client) {
    client = neon(process.env.DATABASE_URL as string);
  }
  return client;
};

// Creates tables on first use so a fresh Neon project needs no manual setup.
export const ensureSchema = (): Promise<void> => {
  if (!schemaReady) {
    schemaReady = (async () => {
      const query = sql();
      await query`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          amount NUMERIC NOT NULL DEFAULT 0,
          url TEXT NOT NULL DEFAULT '',
          category TEXT NOT NULL DEFAULT 'accessories',
          brand TEXT NOT NULL DEFAULT '',
          description TEXT NOT NULL DEFAULT '',
          sku TEXT NOT NULL DEFAULT '',
          quantity INTEGER NOT NULL DEFAULT 0,
          created_at BIGINT NOT NULL,
          updated_at BIGINT NOT NULL
        )`;
      await query`ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery JSONB NOT NULL DEFAULT '[]'`;
      await query`ALTER TABLE products ADD COLUMN IF NOT EXISTS reviews JSONB NOT NULL DEFAULT '[]'`;
      await query`ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_price NUMERIC`;
      await query`ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_end BIGINT`;
      await query`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          value TEXT NOT NULL UNIQUE,
          image TEXT NOT NULL DEFAULT '',
          created_at BIGINT NOT NULL,
          updated_at BIGINT NOT NULL
        )`;
      await query`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          reference TEXT NOT NULL,
          items JSONB NOT NULL,
          total NUMERIC NOT NULL,
          customer_name TEXT NOT NULL DEFAULT '',
          customer_phone TEXT NOT NULL DEFAULT '',
          status TEXT NOT NULL DEFAULT 'pending',
          created_at BIGINT NOT NULL,
          updated_at BIGINT NOT NULL
        )`;
      await query`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_city TEXT NOT NULL DEFAULT ''`;
      await query`
        CREATE TABLE IF NOT EXISTS images (
          id TEXT PRIMARY KEY,
          mime TEXT NOT NULL,
          data BYTEA NOT NULL,
          created_at BIGINT NOT NULL
        )`;
      await query`
        CREATE TABLE IF NOT EXISTS subscribers (
          email TEXT PRIMARY KEY,
          created_at BIGINT NOT NULL
        )`;
      await query`
        CREATE TABLE IF NOT EXISTS enquiries (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          vehicle TEXT NOT NULL DEFAULT '',
          message TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'new',
          created_at BIGINT NOT NULL
        )`;
    })().catch((error) => {
      schemaReady = null; // allow retry on next request
      throw error;
    });
  }
  return schemaReady;
};
