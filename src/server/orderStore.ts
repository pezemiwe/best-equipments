import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import { ensureSchema, hasDatabase, sql } from './db';
import { decrementStock, getProduct } from './productStore';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'delivered'
  | 'cancelled';

export type OrderItem = {
  id: string;
  name: string;
  brand: string;
  amount: number; // server-verified unit price at order time
  quantity: number;
};

export type Order = {
  id: string;
  reference: string;
  items: OrderItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
};

const DATA_FILE = path.join(process.cwd(), 'data', 'orders.json');

const readFileStore = async (): Promise<Order[]> => {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
};

const writeFileStore = async (orders: Order[]) => {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2), 'utf-8');
};

const rowToOrder = (row: any): Order => ({
  id: row.id,
  reference: row.reference,
  items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
  total: Number(row.total) || 0,
  customerName: row.customer_name,
  customerPhone: row.customer_phone,
  customerCity: row.customer_city || '',
  status: row.status,
  createdAt: Number(row.created_at),
  updatedAt: Number(row.updated_at),
});

const saveOrder = async (order: Order, isNew: boolean) => {
  if (hasDatabase()) {
    await ensureSchema();
    if (isNew) {
      await sql()`
        INSERT INTO orders (id, reference, items, total, customer_name, customer_phone, customer_city, status, created_at, updated_at)
        VALUES (${order.id}, ${order.reference}, ${JSON.stringify(order.items)}, ${order.total},
                ${order.customerName}, ${order.customerPhone}, ${order.customerCity}, ${order.status},
                ${order.createdAt}, ${order.updatedAt})`;
    } else {
      await sql()`
        UPDATE orders SET status = ${order.status}, updated_at = ${order.updatedAt}
        WHERE id = ${order.id}`;
    }
    return;
  }
  const orders = await readFileStore();
  if (isNew) {
    orders.unshift(order);
  } else {
    const index = orders.findIndex((o) => o.id === order.id);
    orders[index] = order;
  }
  await writeFileStore(orders);
};

const findOrder = async (id: string): Promise<Order | null> => {
  if (hasDatabase()) {
    await ensureSchema();
    const rows = (await sql()`SELECT * FROM orders WHERE id = ${id}`) as any[];
    return rows.length ? rowToOrder(rows[0]) : null;
  }
  const orders = await readFileStore();
  return orders.find((o) => o.id === id) || null;
};

// Builds an order from cart item ids/quantities, re-pricing every line from
// the product store so client-side price tampering or staleness cannot leak
// into the order. Throws with a customer-readable message on invalid input.
export const createOrder = async (input: {
  items: { id: string; quantity: number }[];
  customerName?: string;
  customerPhone?: string;
  customerCity?: string;
}): Promise<Order> => {
  if (!input.items?.length) throw new Error('Order has no items');
  if (input.items.length > 50) throw new Error('Too many items in order');

  const items: OrderItem[] = [];
  for (const line of input.items) {
    const quantity = Math.floor(Number(line.quantity));
    if (!quantity || quantity < 1 || quantity > 99) {
      throw new Error('Invalid quantity in order');
    }
    const product = await getProduct(String(line.id));
    if (!product) throw new Error('A product in your cart no longer exists');
    if (!product.inStock) {
      throw new Error(`"${product.name}" is out of stock`);
    }
    if (product.quantity < quantity) {
      throw new Error(
        `Only ${product.quantity} of "${product.name}" left in stock`
      );
    }
    items.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      amount: product.amount,
      quantity,
    });
  }

  const total = items.reduce(
    (acc, item) => acc + item.amount * item.quantity,
    0
  );
  const name = String(input.customerName || '').trim().slice(0, 100);
  const phone = String(input.customerPhone || '').trim().slice(0, 30);
  const city = String(input.customerCity || '').trim().slice(0, 100);

  if (!name || name.length < 2) throw new Error('Customer name is required');
  if (!phone || phone.length < 5) throw new Error('Customer phone is required');
  if (!city) throw new Error('Customer city/state is required');

  const now = Date.now();
  const order: Order = {
    id: nanoid(14),
    reference: `TBE-${now.toString(36).toUpperCase()}${nanoid(3).toUpperCase()}`,
    items,
    total,
    customerName: name,
    customerPhone: phone,
    customerCity: city,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  await saveOrder(order, true);
  return order;
};

export const listOrders = async (): Promise<Order[]> => {
  if (hasDatabase()) {
    await ensureSchema();
    const rows = (await sql()`SELECT * FROM orders ORDER BY created_at DESC`) as any[];
    return rows.map(rowToOrder);
  }
  return readFileStore();
};

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

export const updateOrderStatus = async (
  id: string,
  status: OrderStatus
): Promise<Order | null> => {
  const order = await findOrder(id);
  if (!order) return null;
  if (!VALID_TRANSITIONS[order.status]?.includes(status)) {
    throw new Error(
      `Cannot change order from "${order.status}" to "${status}"`
    );
  }

  // Stock is committed when the admin confirms the order (WhatsApp orders
  // may never complete, so we don't decrement at placement time).
  if (status === 'confirmed') {
    await decrementStock(order.items);
  }

  const updated: Order = { ...order, status, updatedAt: Date.now() };
  await saveOrder(updated, false);
  return updated;
};
