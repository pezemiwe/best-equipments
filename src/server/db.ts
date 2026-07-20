import { neon } from '@neondatabase/serverless';

// Postgres (Neon) is used when DATABASE_URL is set; otherwise the stores fall
// back to local JSON files so development works with zero configuration.
export const hasDatabase = () =>
  !!process.env.DATABASE_URL && process.env.STORE_BACKEND !== 'file';

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
      await query`
        CREATE TABLE IF NOT EXISTS images (
          id TEXT PRIMARY KEY,
          mime TEXT NOT NULL,
          data BYTEA NOT NULL,
          created_at BIGINT NOT NULL
        )`;
    })().catch((error) => {
      schemaReady = null; // allow retry on next request
      throw error;
    });
  }
  return schemaReady;
};
