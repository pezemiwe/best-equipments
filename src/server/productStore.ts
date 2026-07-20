import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import { ensureSchema, hasDatabase, sql } from './db';

export type Product = {
  id: string;
  name: string;
  amount: number;
  url: string;
  category: string;
  brand: string;
  description: string;
  sku: string;
  inStock: boolean;
  quantity: number;
  gallery: string[];
  createdAt?: number;
  updatedAt?: number;
};

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

const partImages = [
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=70',
  'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=800&q=70',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=70',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=70',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=70',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=70',
];

const seedCatalog: Omit<
  ProductInput,
  'url' | 'sku' | 'quantity' | 'inStock' | 'gallery'
>[] = [
  { name: 'Ceramic Brake Pad Set (Front)', amount: 48000, category: 'brakes', brand: 'Bosch', description: 'Low-dust ceramic brake pads engineered for quiet, fade-free stopping power. Includes hardware kit and lubricant.' },
  { name: 'Vented Brake Disc Rotor Pair', amount: 145000, category: 'brakes', brand: 'Brembo', description: 'Precision-machined vented rotors with anti-corrosion coating for consistent braking in all conditions.' },
  { name: 'Engine Oil Filter', amount: 9500, category: 'filters', brand: 'Mann-Filter', description: 'High-capacity filtration media that protects your engine between extended service intervals.' },
  { name: 'Cabin Air Filter (Activated Carbon)', amount: 15000, category: 'filters', brand: 'Mann-Filter', description: 'Activated-carbon cabin filter that traps dust, pollen and odours before they reach the interior.' },
  { name: 'High-Flow Air Filter', amount: 55000, category: 'filters', brand: 'K&N', description: 'Washable, reusable performance air filter designed to increase airflow and horsepower.' },
  { name: 'Iridium Spark Plug Set (4pc)', amount: 42000, category: 'engine', brand: 'NGK', description: 'Fine-wire iridium plugs for improved ignitability, smoother idle and longer service life.' },
  { name: 'Timing Belt Kit with Water Pump', amount: 220000, category: 'engine', brand: 'Gates', description: 'Complete kit with belt, tensioners, idlers and water pump. Everything you need for a full timing service.' },
  { name: 'Serpentine Drive Belt', amount: 24000, category: 'engine', brand: 'Gates', description: 'EPDM construction resists cracking and maintains grip across the full temperature range.' },
  { name: 'Gas-Charged Shock Absorber (Rear)', amount: 85000, category: 'suspension', brand: 'Monroe', description: 'Nitrogen gas-charged shock for improved handling, ride control and reduced braking distance.' },
  { name: 'Front Strut Assembly (Complete)', amount: 160000, category: 'suspension', brand: 'KYB', description: 'Fully assembled strut with spring and mount. Bolt-on replacement, no spring compressor needed.' },
  { name: 'Stabilizer Link Kit', amount: 28000, category: 'suspension', brand: 'Moog', description: 'Heavy-duty sway bar end links with greaseable sockets for long service life.' },
  { name: 'AGM Car Battery 70Ah', amount: 285000, category: 'electrical', brand: 'Varta', description: 'Absorbent glass mat battery for start-stop vehicles with high cold-cranking performance.' },
  { name: 'Alternator 120A (Remanufactured)', amount: 250000, category: 'electrical', brand: 'Bosch', description: 'OE-quality remanufactured alternator, tested to factory output specifications.' },
  { name: 'LED Headlight Bulb Kit H7', amount: 65000, category: 'electrical', brand: 'Philips', description: 'Bright-white 6000K LED conversion kit with integrated cooling and plug-and-play fitment.' },
  { name: 'Fully Synthetic Engine Oil 5W-30 (5L)', amount: 58000, category: 'oilsFluids', brand: 'Castrol', description: 'Advanced full-synthetic formula that protects against wear, deposits and sludge.' },
  { name: 'Long-Life Coolant Concentrate (5L)', amount: 22000, category: 'oilsFluids', brand: 'Prestone', description: 'All-vehicle antifreeze/coolant with 10-year corrosion protection. Dilute 50/50.' },
  { name: 'DOT 4 Brake Fluid (1L)', amount: 12000, category: 'oilsFluids', brand: 'ATE', description: 'High wet boiling point brake fluid for reliable braking under demanding conditions.' },
  { name: 'Alloy Wheel 17" Gunmetal', amount: 190000, category: 'wheels', brand: 'Enkei', description: 'Lightweight flow-formed alloy wheel in gunmetal finish. Sold individually.' },
  { name: 'All-Season Tyre 225/45R17', amount: 150000, category: 'wheels', brand: 'Michelin', description: 'Balanced wet and dry grip with low rolling resistance for year-round confidence.' },
  { name: 'Wiper Blade Set (Aero Flat)', amount: 18000, category: 'accessories', brand: 'Bosch', description: 'Beam-style wiper blades with aerodynamic spoiler for streak-free visibility.' },
  { name: 'Heavy-Duty Rubber Floor Mats (4pc)', amount: 45000, category: 'accessories', brand: 'WeatherTech', description: 'All-weather deep-channel floor mats that trap water, mud and road salt.' },
  { name: 'OBD2 Diagnostic Scanner', amount: 95000, category: 'accessories', brand: 'Autel', description: 'Read and clear engine fault codes, view live data and check emissions readiness.' },
  { name: 'Clutch Kit 3-Piece', amount: 275000, category: 'transmission', brand: 'LuK', description: 'Complete kit with pressure plate, friction disc and release bearing, matched to OE spec.' },
  { name: 'ATF Automatic Transmission Fluid (4L)', amount: 38000, category: 'transmission', brand: 'Valvoline', description: 'Multi-vehicle synthetic ATF for smooth shifting and anti-shudder durability.' },
];

const seedProducts = (): Product[] =>
  seedCatalog.map((item, i) => ({
    ...item,
    id: `seed-${i + 1}`,
    sku: `TBE-${String(i + 1).padStart(4, '0')}`,
    url: partImages[i % partImages.length],
    quantity: 10,
    inStock: true,
    gallery: [
      partImages[(i + 1) % partImages.length],
      partImages[(i + 2) % partImages.length],
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }));

// ------------------------------- file store --------------------------------

const readFileStore = async (): Promise<Product[]> => {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    const seeded = seedProducts();
    await writeFileStore(seeded);
    return seeded;
  }
};

const writeFileStore = async (products: Product[]) => {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
};

// ------------------------------- postgres ----------------------------------

const rowToProduct = (row: any): Product => {
  const quantity = Number(row.quantity) || 0;
  let gallery: string[] = [];
  try {
    gallery =
      typeof row.gallery === 'string'
        ? JSON.parse(row.gallery)
        : row.gallery || [];
  } catch {
    gallery = [];
  }
  return {
    id: row.id,
    name: row.name,
    amount: Number(row.amount) || 0,
    url: row.url,
    category: row.category,
    brand: row.brand,
    description: row.description,
    sku: row.sku,
    quantity,
    inStock: quantity > 0,
    gallery,
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  };
};

let dbSeeded = false;
const ensureDbReady = async () => {
  await ensureSchema();
  if (!dbSeeded) {
    const query = sql();
    const [{ count }] = (await query`SELECT COUNT(*)::int AS count FROM products`) as any[];
    if (count === 0) {
      for (const product of seedProducts()) {
        await query`
          INSERT INTO products (id, name, amount, url, category, brand, description, sku, quantity, gallery, created_at, updated_at)
          VALUES (${product.id}, ${product.name}, ${product.amount}, ${product.url}, ${product.category},
                  ${product.brand}, ${product.description}, ${product.sku}, ${product.quantity},
                  ${JSON.stringify(product.gallery)}, ${product.createdAt}, ${product.updatedAt})
          ON CONFLICT (id) DO NOTHING`;
      }
    }
    dbSeeded = true;
  }
};

// -------------------------------- images -----------------------------------

// Accepts a data URL and stores the image. With Postgres the bytes go into the
// images table and are served from /api/images/[id] (works on Vercel, no file
// system needed); in file mode they're written under public/uploads.
// Plain http(s) URLs pass through untouched.
export const resolveImageUrl = async (
  image: string,
  ownerId: string
): Promise<string> => {
  if (!image || !image.startsWith('data:')) return image;
  const match = image.match(/^data:image\/(png|jpe?g|webp|gif);base64,(.+)$/);
  if (!match) throw new Error('Unsupported image format');
  const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
  const mime = `image/${match[1]}`;
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > 4 * 1024 * 1024) throw new Error('Image exceeds 4MB');

  if (hasDatabase()) {
    await ensureSchema();
    const id = `${ownerId}-${nanoid(8)}`;
    await sql()`
      INSERT INTO images (id, mime, data, created_at)
      VALUES (${id}, ${mime}, ${buffer}, ${Date.now()})`;
    return `/api/images/${id}`;
  }

  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const filename = `${ownerId}-${Date.now()}.${ext}`;
  await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer);
  return `/uploads/${filename}`;
};

export const getImage = async (
  id: string
): Promise<{ mime: string; data: Buffer } | null> => {
  if (!hasDatabase()) return null;
  await ensureSchema();
  const rows = (await sql()`SELECT mime, data FROM images WHERE id = ${id}`) as any[];
  if (!rows.length) return null;
  return { mime: rows[0].mime, data: Buffer.from(rows[0].data) };
};

// --------------------------------- CRUD ------------------------------------

export const listProducts = async (): Promise<Product[]> => {
  if (hasDatabase()) {
    await ensureDbReady();
    const rows = (await sql()`SELECT * FROM products ORDER BY created_at DESC`) as any[];
    return rows.map(rowToProduct);
  }
  return readFileStore();
};

export const getProduct = async (id: string): Promise<Product | null> => {
  if (hasDatabase()) {
    await ensureDbReady();
    const rows = (await sql()`SELECT * FROM products WHERE id = ${id}`) as any[];
    return rows.length ? rowToProduct(rows[0]) : null;
  }
  const products = await readFileStore();
  return products.find((product) => product.id === id) || null;
};

const resolveQuantity = (
  input: Partial<ProductInput>,
  fallback: number
): number => {
  if (input.quantity !== undefined) {
    return Math.max(0, Number(input.quantity) || 0);
  }
  if (input.inStock !== undefined) {
    return input.inStock ? Math.max(fallback, 1) : 0;
  }
  return fallback;
};

const resolveGallery = async (
  gallery: string[] | undefined,
  ownerId: string
): Promise<string[]> => {
  if (!Array.isArray(gallery)) return [];
  const resolved: string[] = [];
  for (const image of gallery.slice(0, 8)) {
    if (typeof image !== 'string' || !image) continue;
    resolved.push(await resolveImageUrl(image, ownerId));
  }
  return resolved;
};

export const createProduct = async (
  input: Partial<ProductInput> & { image?: string }
): Promise<Product> => {
  const id = nanoid(12);
  const now = Date.now();
  const url = await resolveImageUrl(input.image || input.url || '', id);
  const gallery = await resolveGallery(input.gallery, id);
  const quantity = resolveQuantity(input, 10);
  const product: Product = {
    id,
    name: input.name || '',
    amount: Number(input.amount) || 0,
    url,
    category: input.category || 'accessories',
    brand: input.brand || '',
    description: input.description || '',
    sku: input.sku || `TBE-${nanoid(6).toUpperCase()}`,
    quantity,
    inStock: quantity > 0,
    gallery,
    createdAt: now,
    updatedAt: now,
  };

  if (hasDatabase()) {
    await ensureDbReady();
    await sql()`
      INSERT INTO products (id, name, amount, url, category, brand, description, sku, quantity, gallery, created_at, updated_at)
      VALUES (${product.id}, ${product.name}, ${product.amount}, ${product.url}, ${product.category},
              ${product.brand}, ${product.description}, ${product.sku}, ${product.quantity},
              ${JSON.stringify(product.gallery)}, ${product.createdAt}, ${product.updatedAt})`;
  } else {
    const products = await readFileStore();
    products.unshift(product);
    await writeFileStore(products);
  }
  return product;
};

export const updateProduct = async (
  id: string,
  input: Partial<ProductInput> & { image?: string }
): Promise<Product | null> => {
  const existing = await getProduct(id);
  if (!existing) return null;
  const url = input.image
    ? await resolveImageUrl(input.image, id)
    : input.url ?? existing.url;
  const gallery =
    input.gallery !== undefined
      ? await resolveGallery(input.gallery, id)
      : existing.gallery;
  const quantity = resolveQuantity(input, existing.quantity);
  const updated: Product = {
    ...existing,
    ...input,
    amount:
      input.amount !== undefined ? Number(input.amount) : existing.amount,
    url,
    id,
    quantity,
    inStock: quantity > 0,
    gallery,
    updatedAt: Date.now(),
  };
  delete (updated as any).image;

  if (hasDatabase()) {
    await sql()`
      UPDATE products SET
        name = ${updated.name}, amount = ${updated.amount}, url = ${updated.url},
        category = ${updated.category}, brand = ${updated.brand},
        description = ${updated.description}, sku = ${updated.sku},
        quantity = ${updated.quantity}, gallery = ${JSON.stringify(updated.gallery)},
        updated_at = ${updated.updatedAt}
      WHERE id = ${id}`;
  } else {
    const products = await readFileStore();
    const index = products.findIndex((product) => product.id === id);
    products[index] = updated;
    await writeFileStore(products);
  }
  return updated;
};

// Decrements stock for confirmed order items; floors at zero.
export const decrementStock = async (
  items: { id: string; quantity: number }[]
): Promise<void> => {
  if (hasDatabase()) {
    await ensureDbReady();
    for (const item of items) {
      await sql()`
        UPDATE products
        SET quantity = GREATEST(0, quantity - ${item.quantity}),
            updated_at = ${Date.now()}
        WHERE id = ${item.id}`;
    }
    return;
  }
  for (const item of items) {
    const product = await getProduct(item.id);
    if (!product) continue;
    const quantity = Math.max(0, product.quantity - item.quantity);
    await updateProduct(item.id, { quantity });
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  if (hasDatabase()) {
    await ensureDbReady();
    const rows = (await sql()`DELETE FROM products WHERE id = ${id} RETURNING id`) as any[];
    return rows.length > 0;
  }
  const products = await readFileStore();
  const filtered = products.filter((product) => product.id !== id);
  if (filtered.length === products.length) return false;
  await writeFileStore(filtered);
  return true;
};
