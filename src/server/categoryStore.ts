import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import { ensureSchema, hasDatabase, sql } from './db';
import { resolveImageUrl } from './productStore';

export type Category = {
  id: string;
  name: string;
  value: string;
  image: string;
  createdAt: number;
  updatedAt: number;
};

export type CategoryInput = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;

const DATA_FILE = path.join(process.cwd(), 'data', 'categories.json');

const seedCategoriesData = [
  { name: "Belts", value: "belts", image: "https://images.unsplash.com/photo-1610891015188-5369212db097?auto=format&fit=crop&w=900&q=70" },
  { name: "Chains & Sprockets", value: "chainsSprockets", image: "https://images.unsplash.com/photo-1488272690691-2636704d6000?auto=format&fit=crop&w=900&q=70" },
  { name: "Power Transmission", value: "powerTransmission", image: "https://images.unsplash.com/photo-1567093322102-6bdd32fba67d?auto=format&fit=crop&w=900&q=70" },
  { name: "Bearings", value: "bearings", image: "https://images.unsplash.com/photo-1776671236324-d9b94d727f25?auto=format&fit=crop&w=900&q=70" },
  { name: "Seals & Gaskets", value: "sealsGaskets", image: "https://images.unsplash.com/photo-1699466622736-36c7b7893745?auto=format&fit=crop&w=900&q=70" },
  { name: "Excavator & Drilling Parts", value: "excavatorDrilling", image: "https://images.unsplash.com/photo-1628645419184-26a1f2757340?auto=format&fit=crop&w=900&q=70" },
  { name: "Fasteners & Adhesives", value: "fastenersAdhesives", image: "https://images.unsplash.com/photo-1564226591723-659ff3852b2a?auto=format&fit=crop&w=900&q=70" },
  { name: "Industrial Supplies", value: "industrialSupplies", image: "https://images.unsplash.com/photo-1567016958860-87d898933af1?auto=format&fit=crop&w=900&q=70" },
  { name: "Car Care Products", value: "carCare", image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=900&q=70" },
];

const seedCategories = (): Category[] =>
  seedCategoriesData.map((item, i) => ({
    ...item,
    id: `cat-${i + 1}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }));

const readFileStore = async (): Promise<Category[]> => {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    const seeded = seedCategories();
    await writeFileStore(seeded);
    return seeded;
  }
};

const writeFileStore = async (categories: Category[]) => {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(categories, null, 2), 'utf-8');
};

const rowToCategory = (row: any): Category => ({
  id: row.id,
  name: row.name,
  value: row.value,
  image: row.image,
  createdAt: Number(row.created_at),
  updatedAt: Number(row.updated_at),
});

let dbSeeded = false;
const ensureDbReady = async () => {
  await ensureSchema();
  if (!dbSeeded) {
    const query = sql();
    const [{ count }] = (await query`SELECT COUNT(*)::int AS count FROM categories`) as any[];
    if (count === 0) {
      for (const cat of seedCategories()) {
        await query`
          INSERT INTO categories (id, name, value, image, created_at, updated_at)
          VALUES (${cat.id}, ${cat.name}, ${cat.value}, ${cat.image}, ${cat.createdAt}, ${cat.updatedAt})
          ON CONFLICT (id) DO NOTHING`;
      }
    }
    dbSeeded = true;
  }
};

export const listCategories = async (): Promise<Category[]> => {
  if (hasDatabase()) {
    await ensureDbReady();
    const rows = (await sql()`SELECT * FROM categories ORDER BY created_at ASC`) as any[];
    return rows.map(rowToCategory);
  }
  return readFileStore();
};

export const getCategory = async (id: string): Promise<Category | null> => {
  if (hasDatabase()) {
    await ensureDbReady();
    const rows = (await sql()`SELECT * FROM categories WHERE id = ${id}`) as any[];
    return rows.length ? rowToCategory(rows[0]) : null;
  }
  const categories = await readFileStore();
  return categories.find((c) => c.id === id) || null;
};

export const createCategory = async (
  input: Partial<CategoryInput> & { fileImage?: string }
): Promise<Category> => {
  const id = nanoid(12);
  const now = Date.now();
  const image = input.fileImage 
    ? await resolveImageUrl(input.fileImage, id) 
    : input.image || '';

  const value = input.value || input.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || id;

  const category: Category = {
    id,
    name: input.name || '',
    value,
    image,
    createdAt: now,
    updatedAt: now,
  };

  if (hasDatabase()) {
    await ensureDbReady();
    await sql()`
      INSERT INTO categories (id, name, value, image, created_at, updated_at)
      VALUES (${category.id}, ${category.name}, ${category.value}, ${category.image}, ${category.createdAt}, ${category.updatedAt})`;
  } else {
    const categories = await readFileStore();
    categories.push(category);
    await writeFileStore(categories);
  }
  return category;
};

export const updateCategory = async (
  id: string,
  input: Partial<CategoryInput> & { fileImage?: string }
): Promise<Category | null> => {
  const existing = await getCategory(id);
  if (!existing) return null;
  
  const image = input.fileImage
    ? await resolveImageUrl(input.fileImage, id)
    : input.image ?? existing.image;
    
  const updated: Category = {
    ...existing,
    name: input.name ?? existing.name,
    value: input.value ?? existing.value,
    image,
    updatedAt: Date.now(),
  };

  if (hasDatabase()) {
    await sql()`
      UPDATE categories SET
        name = ${updated.name}, value = ${updated.value}, image = ${updated.image},
        updated_at = ${updated.updatedAt}
      WHERE id = ${id}`;
  } else {
    const categories = await readFileStore();
    const index = categories.findIndex((c) => c.id === id);
    categories[index] = updated;
    await writeFileStore(categories);
  }
  return updated;
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  if (hasDatabase()) {
    await ensureDbReady();
    const rows = (await sql()`DELETE FROM categories WHERE id = ${id} RETURNING id`) as any[];
    return rows.length > 0;
  }
  const categories = await readFileStore();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) return false;
  await writeFileStore(filtered);
  return true;
};
