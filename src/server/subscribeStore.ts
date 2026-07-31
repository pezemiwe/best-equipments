import fs from 'fs/promises';
import path from 'path';
import { ensureSchema, hasDatabase, sql } from './db';

const DATA_FILE = path.join(process.cwd(), 'data', 'subscribers.json');

const ensureDbReady = async () => {
  try {
    await ensureSchema();
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
  }
};

const readFileStore = async (): Promise<{ email: string; createdAt: number }[]> => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
      await fs.writeFile(DATA_FILE, '[]');
      return [];
    }
    throw error;
  }
};

const writeFileStore = async (data: any[]) => {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

export const addSubscriber = async (email: string): Promise<boolean> => {
  const now = Date.now();
  if (hasDatabase()) {
    await ensureDbReady();
    try {
      await sql()`
        INSERT INTO subscribers (email, created_at)
        VALUES (${email}, ${now})
        ON CONFLICT (email) DO NOTHING`;
      return true; // We return true even if it already exists to be idempotent
    } catch (error) {
      console.error('Error adding subscriber to database:', error);
      throw error;
    }
  } else {
    const subscribers = await readFileStore();
    if (subscribers.find((sub) => sub.email === email)) {
      return true;
    }
    subscribers.push({ email, createdAt: now });
    await writeFileStore(subscribers);
    return true;
  }
};
