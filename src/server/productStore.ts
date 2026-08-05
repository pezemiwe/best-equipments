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
  reviews?: { name: string; rating: number; comment: string; date: number }[];
  discountPrice?: number;
  discountEnd?: number;
  createdAt?: number;
  updatedAt?: number;
};

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Every demo image below was checked to resolve (Unsplash IDs 404 silently
// otherwise) and matched to the product it illustrates.
const img = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

// Demo catalog reflecting the client's real product categories. Replace with
// actual products (and real photos) via the admin portal before launch.
const seedCatalog: (Omit<
  ProductInput,
  'url' | 'sku' | 'quantity' | 'inStock' | 'gallery'
> & { image: string; extra?: string[] })[] = [
  { name: 'Conveyor Belt (Rubber, Per Metre)', amount: 28000, category: 'belts', brand: 'Generic', description: 'Heavy-duty rubber conveyor belt for material handling systems. Cut to length, various widths and ply ratings available.', image: img('1610891015188-5369212db097'), extra: [img('1496247749665-49cf5b1022e9'), img('1717386255773-1e3037c81788')] },
  { name: 'PVC Belt (Per Metre)', amount: 12000, category: 'belts', brand: 'Generic', description: 'Food-grade PVC conveyor belt, oil and abrasion resistant. Suitable for light to medium duty conveying.', image: img('1496247749665-49cf5b1022e9'), extra: [img('1610891015188-5369212db097')] },
  { name: 'Fan Belt', amount: 4500, category: 'belts', brand: 'Gates', description: 'V-belt for engine cooling fans and auxiliary drives. Various sizes available - specify vehicle/machine when ordering.', image: img('1584741621183-bb35de119593'), extra: [img('1486262715619-67b85e0b08d3')] },
  { name: 'Timing Belt', amount: 18000, category: 'belts', brand: 'Gates', description: 'Reinforced rubber timing belt for precise engine valve timing. Various sizes available to match your engine.', image: img('1486262715619-67b85e0b08d3'), extra: [img('1584741621183-bb35de119593')] },
  { name: 'Fastener Set (Assorted)', amount: 6500, category: 'fastenersAdhesives', brand: 'Generic', description: 'Assorted industrial nuts, bolts and washers in various sizes and grades for machinery assembly.', image: img('1564226591723-659ff3852b2a'), extra: [img('1607733067403-a0396fa4d3d0')] },
  { name: 'Industrial Gum / Adhesive', amount: 8000, category: 'fastenersAdhesives', brand: 'Generic', description: 'High-strength industrial adhesive for bonding rubber, metal and belting materials.', image: img('1542238060-646c7ed65622'), extra: [img('1564226591723-659ff3852b2a')] },
  { name: 'Roller Chain (Per Metre)', amount: 15000, category: 'chainsSprockets', brand: 'Diamond', description: 'Precision roller chain for power transmission and conveyor drives. Multiple pitch sizes available.', image: img('1488272690691-2636704d6000'), extra: [img('1605701250441-2bfa95839417'), img('1579107820457-2bd4dccad947')] },
  { name: 'Sprocket', amount: 22000, category: 'chainsSprockets', brand: 'Generic', description: 'Machined steel sprocket matched to standard roller chain pitches. Specify tooth count and bore size.', image: img('1579107820457-2bd4dccad947'), extra: [img('1488272690691-2636704d6000')] },
  { name: 'Chain Link (Connecting Link)', amount: 3500, category: 'chainsSprockets', brand: 'Diamond', description: 'Replacement connecting link for roller chains. Match to your chain pitch and size.', image: img('1605701250441-2bfa95839417'), extra: [img('1488272690691-2636704d6000')] },
  { name: 'Flexible Coupling', amount: 32000, category: 'powerTransmission', brand: 'Fenner', description: 'Flexible shaft coupling that absorbs misalignment and vibration between connected shafts.', image: img('1563641749712-028dfeab14b3'), extra: [img('1593062037896-764e9f52029e')] },
  { name: 'V-Belt Pulley', amount: 19000, category: 'powerTransmission', brand: 'Generic', description: 'Cast iron pulley for V-belt drives. Various diameters and groove counts available.', image: img('1593062037896-764e9f52029e'), extra: [img('1567093322102-6bdd32fba67d')] },
  { name: 'Taper Lock Bush', amount: 14000, category: 'powerTransmission', brand: 'Fenner', description: 'Taper lock bushing for secure, keyless mounting of pulleys and sprockets onto shafts.', image: img('1524514587686-e2909d726e9b'), extra: [img('1567093322102-6bdd32fba67d')] },
  { name: 'Deep Groove Ball Bearing', amount: 9500, category: 'bearings', brand: 'SKF', description: 'General-purpose ball bearing for rotating shaft support. Wide range of sizes in stock.', image: img('1683308743837-e6ba8cdeb60a'), extra: [img('1776671236324-d9b94d727f25'), img('1580327947782-55ff50b37f01')] },
  { name: 'Bearing Sleeve', amount: 7000, category: 'bearings', brand: 'Generic', description: 'Precision-machined sleeve for bearing seating and shaft protection.', image: img('1580327947782-55ff50b37f01'), extra: [img('1776671236324-d9b94d727f25')] },
  { name: 'Pillow Block Bearing Housing', amount: 26000, category: 'bearings', brand: 'SKF', description: 'Cast pillow block housing for mounting bearings on machine frames, with grease fitting.', image: img('1776671236324-d9b94d727f25'), extra: [img('1683308743837-e6ba8cdeb60a')] },
  { name: 'Caterpillar Excavator Bucket', amount: 850000, category: 'excavatorDrilling', brand: 'Caterpillar', description: 'Heavy-duty excavator bucket compatible with Caterpillar machines. Specify machine model and bucket size.', image: img('1628645419184-26a1f2757340'), extra: [img('1580901369227-308f6f40bdeb'), img('1583024011792-b165975b52f5')] },
  { name: 'Caterpillar Bucket Teeth', amount: 35000, category: 'excavatorDrilling', brand: 'Caterpillar', description: 'Wear-resistant replacement bucket teeth for Caterpillar excavator buckets.', image: img('1580901369227-308f6f40bdeb'), extra: [img('1628645419184-26a1f2757340')] },
  { name: 'Hydraulic Rock Chisel', amount: 120000, category: 'excavatorDrilling', brand: 'Generic', description: 'Hydraulic breaker chisel point for rock and concrete demolition work.', image: img('1583024011792-b165975b52f5'), extra: [img('1523848309072-c199db53f137')] },
  { name: 'Drilling Bit', amount: 65000, category: 'excavatorDrilling', brand: 'Generic', description: 'Industrial drilling bit for rock and ground-engaging equipment. Specify diameter and shank type.', image: img('1503792574895-6074f691cc6a'), extra: [img('1551868561-7b006235bf22'), img('1760376208640-2ece4c4a0adc')] },
  { name: 'Extension Rod', amount: 45000, category: 'excavatorDrilling', brand: 'Generic', description: 'Drill extension rod for reaching greater depths in drilling operations.', image: img('1551868561-7b006235bf22'), extra: [img('1760376208640-2ece4c4a0adc')] },
  { name: 'Shank Adapter', amount: 38000, category: 'excavatorDrilling', brand: 'Generic', description: 'Shank adapter connecting the drifter to the drill string on hydraulic drilling rigs.', image: img('1760376208640-2ece4c4a0adc'), extra: [img('1503792574895-6074f691cc6a')] },
  { name: 'Oil Seal', amount: 4000, category: 'sealsGaskets', brand: 'Generic', description: 'Rubber oil seal preventing lubricant leaks around rotating shafts. Various sizes available.', image: img('1699466622736-36c7b7893745'), extra: [img('1759790475932-ac8c04b17727'), img('1571909941887-feb831a05338')] },
  { name: 'Hydraulic Seal Kit', amount: 12000, category: 'sealsGaskets', brand: 'Generic', description: 'Complete seal kit for hydraulic cylinders, sized to your cylinder bore and rod diameter.', image: img('1759790475932-ac8c04b17727'), extra: [img('1699466622736-36c7b7893745')] },
  { name: 'Mechanical Seal', amount: 28000, category: 'sealsGaskets', brand: 'John Crane', description: 'Mechanical seal for pumps and rotating equipment, preventing fluid leakage at the shaft.', image: img('1571909941887-feb831a05338'), extra: [img('1665971535489-b1ede1c1409d')] },
  { name: 'Gasket (Assorted Sizes)', amount: 5500, category: 'sealsGaskets', brand: 'Generic', description: 'Industrial gasket material cut to size for flange and joint sealing applications.', image: img('1576063713169-dd2dc1329f5b'), extra: [img('1699466622736-36c7b7893745')] },
  { name: 'Gland Packing (Per Metre)', amount: 9000, category: 'sealsGaskets', brand: 'Generic', description: 'Braided gland packing for pump and valve stem sealing under high pressure.', image: img('1665971535489-b1ede1c1409d'), extra: [img('1571909941887-feb831a05338')] },
  { name: 'Exhaust Wrap', amount: 15000, category: 'industrialSupplies', brand: 'Generic', description: 'Heat-resistant exhaust wrapping tape for thermal insulation of pipes and manifolds.', image: img('1700498362002-05f7538f91f6'), extra: [img('1585201731775-0597e1be4bfb')] },
  { name: 'Fibre Glass Matting', amount: 11000, category: 'industrialSupplies', brand: 'Generic', description: 'Fibreglass matting for reinforcement, insulation and repair work.', image: img('1585201731775-0597e1be4bfb'), extra: [img('1700498362002-05f7538f91f6')] },
  { name: 'Industrial Grease (Per Kg)', amount: 6000, category: 'industrialSupplies', brand: 'Total', description: 'Multi-purpose lithium grease for bearings, chains and general lubrication points.', image: img('1590227763209-821c686b932f'), extra: [img('1567016958860-87d898933af1')] },
  { name: 'Heavy-Duty Battery', amount: 95000, category: 'industrialSupplies', brand: 'Exide', description: 'High cold-cranking-amp battery for automotive and industrial equipment starting power.', image: img('1676337167629-d896b3ed5724'), extra: [img('1486262715619-67b85e0b08d3')] },
  { name: 'Tyre Polish (Spray)', amount: 3500, category: 'carCare', brand: 'STP', description: 'Silicone-based tyre shine spray for a long-lasting, deep black finish.', image: img('1565689876697-e467b6c54da2'), extra: [img('1607860108855-64acf2078ed9')] },
  { name: 'Wash & Wax Shampoo', amount: 4500, category: 'carCare', brand: 'Turtle Wax', description: 'Car shampoo with wax that cleans and protects paintwork in a single wash.', image: img('1607860108855-64acf2078ed9'), extra: [img('1527581849771-416a9d62308e')] },
  { name: 'Dashboard Cleaner', amount: 3800, category: 'carCare', brand: 'Meguiars', description: 'Interior cleaner and protectant that removes dust and UV-fades from dashboards and trim.', image: img('1620584899131-a5ff5f8fbb03'), extra: [img('1527581849771-416a9d62308e')] },
  { name: 'Glass Cleaner', amount: 3200, category: 'carCare', brand: 'Meguiars', description: 'Streak-free glass cleaner for windshields, windows and mirrors.', image: img('1527581849771-416a9d62308e'), extra: [img('1611239179213-d972da54091a')] },
];

const seedProducts = (): Product[] =>
  seedCatalog.map(({ image, extra, ...item }, i) => ({
    ...item,
    id: `seed-${i + 1}`,
    sku: `TBE-${String(i + 1).padStart(4, '0')}`,
    url: image,
    quantity: 10,
    inStock: true,
    gallery: extra || [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }));

// ------------------------------- file store --------------------------------

const readFileStore = async (): Promise<Product[]> => {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    if (process.env.SEED_DEMO_DATA === 'true') {
      const seeded = seedProducts();
      await writeFileStore(seeded);
      return seeded;
    }
    await writeFileStore([]);
    return [];
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
  let reviews: any[] = [];
  try {
    gallery =
      typeof row.gallery === 'string'
        ? JSON.parse(row.gallery)
        : row.gallery || [];
  } catch {
    gallery = [];
  }
  try {
    reviews =
      typeof row.reviews === 'string'
        ? JSON.parse(row.reviews)
        : row.reviews || [];
  } catch {
    reviews = [];
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
    reviews,
    discountPrice: row.discount_price ? Number(row.discount_price) : undefined,
    discountEnd: row.discount_end ? Number(row.discount_end) : undefined,
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
    if (count === 0 && process.env.SEED_DEMO_DATA === 'true') {
      for (const product of seedProducts()) {
        await query`
          INSERT INTO products (id, name, amount, url, category, brand, description, sku, quantity, gallery, created_at, updated_at, discount_price, discount_end)
          VALUES (${product.id}, ${product.name}, ${product.amount}, ${product.url}, ${product.category},
                  ${product.brand}, ${product.description}, ${product.sku}, ${product.quantity},
                  ${JSON.stringify(product.gallery)}, ${product.createdAt}, ${product.updatedAt}, ${product.discountPrice ?? null}, ${product.discountEnd ?? null})
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
    category: input.category || '',
    brand: input.brand || '',
    description: input.description || '',
    sku: input.sku || `TBE-${nanoid(6).toUpperCase()}`,
    quantity,
    inStock: quantity > 0,
    gallery,
    reviews: [],
    discountPrice: input.discountPrice ? Number(input.discountPrice) : undefined,
    discountEnd: input.discountEnd ? Number(input.discountEnd) : undefined,
    createdAt: now,
    updatedAt: now,
  };

  if (hasDatabase()) {
    await ensureDbReady();
    await sql()`
      INSERT INTO products (id, name, amount, url, category, brand, description, sku, quantity, gallery, reviews, created_at, updated_at, discount_price, discount_end)
      VALUES (${product.id}, ${product.name}, ${product.amount}, ${product.url}, ${product.category},
              ${product.brand}, ${product.description}, ${product.sku}, ${product.quantity},
              ${JSON.stringify(product.gallery)}, '[]', ${product.createdAt}, ${product.updatedAt},
              ${product.discountPrice ?? null}, ${product.discountEnd ?? null})`;
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
    discountPrice: input.discountPrice !== undefined ? (input.discountPrice ? Number(input.discountPrice) : undefined) : existing.discountPrice,
    discountEnd: input.discountEnd !== undefined ? (input.discountEnd ? Number(input.discountEnd) : undefined) : existing.discountEnd,
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
        reviews = ${JSON.stringify(updated.reviews || [])},
        discount_price = ${updated.discountPrice ?? null}, discount_end = ${updated.discountEnd ?? null},
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

export const deleteProducts = async (ids: string[]): Promise<number> => {
  if (ids.length === 0) return 0;
  if (hasDatabase()) {
    await ensureDbReady();
    const rows = (await sql()`DELETE FROM products WHERE id = ANY(${ids}) RETURNING id`) as any[];
    return rows.length;
  }
  const products = await readFileStore();
  const filtered = products.filter((product) => !ids.includes(product.id));
  const removed = products.length - filtered.length;
  if (removed > 0) await writeFileStore(filtered);
  return removed;
};

export const addReview = async (
  id: string,
  review: { name: string; rating: number; comment: string; date: number }
): Promise<Product | null> => {
  const existing = await getProduct(id);
  if (!existing) return null;
  const reviews = [...(existing.reviews || []), review];
  const updated: Product = { ...existing, reviews };

  if (hasDatabase()) {
    await ensureDbReady();
    await sql()`
      UPDATE products SET
        reviews = ${JSON.stringify(reviews)}
      WHERE id = ${id}`;
  } else {
    const products = await readFileStore();
    const index = products.findIndex((product) => product.id === id);
    products[index] = updated;
    await writeFileStore(products);
  }
  return updated;
};

export const countProductsByCategory = async (category: string): Promise<number> => {
  if (hasDatabase()) {
    await ensureDbReady();
    const rows = await sql()`SELECT COUNT(*)::int AS count FROM products WHERE category = ${category}` as any[];
    return rows[0].count;
  }
  const products = await readFileStore();
  return products.filter((p) => p.category === category).length;
};

export const reassignProductCategory = async (oldValue: string, newValue: string): Promise<void> => {
  if (hasDatabase()) {
    await ensureDbReady();
    await sql()`UPDATE products SET category = ${newValue}, updated_at = ${Date.now()} WHERE category = ${oldValue}`;
    return;
  }
  const products = await readFileStore();
  let updated = false;
  for (const product of products) {
    if (product.category === oldValue) {
      product.category = newValue;
      product.updatedAt = Date.now();
      updated = true;
    }
  }
  if (updated) await writeFileStore(products);
};
