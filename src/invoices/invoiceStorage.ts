import localforage from "localforage";
import type { InvoiceFormType } from "./invoiceSchema";

export type StoredInvoice = InvoiceFormType & {
  id: string;
  ref: string;
  total: number;
  status: "paid" | "unpaid";
  createdAt: string;
};

const db = localforage.createInstance({ name: "cust-man-ass", storeName: "invoices" });

export async function addInvoice(data: InvoiceFormType): Promise<StoredInvoice> {
  const id = crypto.randomUUID();
  const inv: StoredInvoice = {
    ...data,
    id,
    ref: `INV-${id.slice(0, 8).toUpperCase()}`,
    total: data.items.reduce((s, i) => s + i.quantity * i.price, 0),
    status: "unpaid",
    createdAt: new Date().toISOString(),
  };
  await db.setItem(id, inv);
  return inv;
}

export async function listInvoicesByCustomer(customerId: string): Promise<StoredInvoice[]> {
  const list: StoredInvoice[] = [];
  await db.iterate<StoredInvoice, void>(v => { if (v.customerId === customerId) list.push(v); });
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function setInvoiceStatus(id: string, status: "paid" | "unpaid"): Promise<void> {
  const inv = await db.getItem<StoredInvoice>(id);
  if (inv) await db.setItem(id, { ...inv, status });
}

export async function removeInvoice(id: string): Promise<void> {
  await db.removeItem(id);
}
