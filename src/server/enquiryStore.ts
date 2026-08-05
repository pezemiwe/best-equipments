import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import { ensureSchema, hasDatabase, sql } from './db';

export type EnquiryStatus = 'new' | 'handled';

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  vehicle: string;
  message: string;
  status: EnquiryStatus;
  createdAt: number;
};

const DATA_FILE = path.join(process.cwd(), 'data', 'enquiries.json');

const ensureDbReady = async () => {
  try {
    await ensureSchema();
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    throw error;
  }
};

// ----------------------------- file store ----------------------------------

const readFileStore = async (): Promise<Enquiry[]> => {
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

const writeFileStore = async (data: Enquiry[]) => {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

// ----------------------------- postgres ------------------------------------

const rowToEnquiry = (row: any): Enquiry => ({
  id: row.id,
  name: row.name,
  email: row.email,
  vehicle: row.vehicle || '',
  message: row.message,
  status: row.status as EnquiryStatus,
  createdAt: Number(row.created_at),
});

// -------------------------------- CRUD -------------------------------------

export const createEnquiry = async (
  input: Omit<Enquiry, 'id' | 'status' | 'createdAt'>
): Promise<Enquiry> => {
  const id = nanoid(12);
  const now = Date.now();
  const enquiry: Enquiry = {
    id,
    name: input.name,
    email: input.email,
    vehicle: input.vehicle || '',
    message: input.message,
    status: 'new',
    createdAt: now,
  };

  if (hasDatabase()) {
    await ensureDbReady();
    await sql()`
      INSERT INTO enquiries (id, name, email, vehicle, message, status, created_at)
      VALUES (${enquiry.id}, ${enquiry.name}, ${enquiry.email}, ${enquiry.vehicle},
              ${enquiry.message}, ${enquiry.status}, ${enquiry.createdAt})`;
  } else {
    const enquiries = await readFileStore();
    enquiries.unshift(enquiry);
    await writeFileStore(enquiries);
  }
  return enquiry;
};

export const listEnquiries = async (): Promise<Enquiry[]> => {
  if (hasDatabase()) {
    await ensureDbReady();
    const rows = (await sql()`SELECT * FROM enquiries ORDER BY created_at DESC`) as any[];
    return rows.map(rowToEnquiry);
  }
  const enquiries = await readFileStore();
  return [...enquiries].sort((a, b) => b.createdAt - a.createdAt);
};

export const updateEnquiryStatus = async (
  id: string,
  status: EnquiryStatus
): Promise<Enquiry | null> => {
  if (hasDatabase()) {
    await ensureDbReady();
    const rows = (await sql()`
      UPDATE enquiries SET status = ${status} WHERE id = ${id} RETURNING *
    `) as any[];
    return rows.length ? rowToEnquiry(rows[0]) : null;
  }
  const enquiries = await readFileStore();
  const index = enquiries.findIndex((e) => e.id === id);
  if (index === -1) return null;
  enquiries[index] = { ...enquiries[index], status };
  await writeFileStore(enquiries);
  return enquiries[index];
};
