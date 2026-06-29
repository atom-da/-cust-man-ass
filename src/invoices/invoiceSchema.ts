import { z } from "zod";

export const InvoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z
    .number({ error: "Enter a quantity" })
    .int("Must be a whole number")
    .min(1, "At least 1"),
  price: z
    .number({ error: "Enter a price" })
    .positive("Must be greater than 0"),
});

export const InvoiceSchema = z
  .object({
    customerId: z.string().min(1, "Select a customer"),
    date: z.string().min(1, "Date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    items: z.array(InvoiceItemSchema).min(1, "Add at least one item"),
  })
  .refine((d) => d.dueDate >= d.date, {
    message: "Due date must be on or after the invoice date",
    path: ["dueDate"],
  });

export type InvoiceItemType = z.infer<typeof InvoiceItemSchema>;
export type InvoiceFormType = z.infer<typeof InvoiceSchema>;
