import localforage from "localforage";
import type { CustomerSchemaType } from "./schema";

export type StoredCustomer = CustomerSchemaType & {
  id: string;
  createdAt: string;
};

const db = localforage.createInstance({ name: "cust-man-ass", storeName: "customers" });

export async function addCustomer(data: CustomerSchemaType): Promise<StoredCustomer> {
  const c: StoredCustomer = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  await db.setItem(c.id, c);
  return c;
}

export async function listCustomers(): Promise<StoredCustomer[]> {
  const list: StoredCustomer[] = [];
  await db.iterate<StoredCustomer, void>(v => { list.push(v); });
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function removeCustomer(id: string): Promise<void> {
  await db.removeItem(id);
}

export async function emailExists(email: string): Promise<boolean> {
  let found = false;
  await db.iterate<StoredCustomer, boolean | void>(v => {
    if (v.email.toLowerCase() === email.toLowerCase()) { found = true; return true; }
  });
  return found;
}
