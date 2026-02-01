import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

export type Purchase = {
  id: string;
  productId: string;
  email: string;
  orderId: string;
  paymentId: string;
  amountInr: number;
  createdAt: string; // ISO
};

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "purchases.json");

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readPurchases(): Purchase[] {
  ensureDir();
  if (!existsSync(FILE_PATH)) return [];
  try {
    const raw = readFileSync(FILE_PATH, "utf-8");
    const data = JSON.parse(raw) as { purchases?: Purchase[] };
    return Array.isArray(data.purchases) ? data.purchases : [];
  } catch {
    return [];
  }
}

function writePurchases(purchases: Purchase[]) {
  ensureDir();
  writeFileSync(
    FILE_PATH,
    JSON.stringify({ purchases }, null, 2),
    "utf-8"
  );
}

export function addPurchase(p: Omit<Purchase, "id" | "createdAt">): Purchase {
  const purchases = readPurchases();
  const id = `pur_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const created: Purchase = {
    ...p,
    id,
    createdAt: new Date().toISOString(),
  };
  purchases.push(created);
  writePurchases(purchases);
  return created;
}

export function getPurchasesByEmail(email: string): Purchase[] {
  const purchases = readPurchases();
  const normalized = email.trim().toLowerCase();
  return purchases.filter((p) => p.email.toLowerCase() === normalized);
}

export function hasPurchase(
  productId: string,
  email: string,
  orderId: string
): boolean {
  const purchases = readPurchases();
  const normalizedEmail = email.trim().toLowerCase();
  return purchases.some(
    (p) =>
      p.productId === productId &&
      p.email.toLowerCase() === normalizedEmail &&
      p.orderId === orderId
  );
}
