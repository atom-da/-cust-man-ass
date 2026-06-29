import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvoiceSchema, type InvoiceFormType } from "./invoiceSchema";
import { createInvoice, fetchInvoicesByCustomer } from "../store/invoiceSlice";
import { fetchCustomers } from "../store/customerSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const cls = "border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500";
const today = new Date().toISOString().split("T")[0];

export default function InvoiceForm() {
  const dispatch = useAppDispatch();
  const customers = useAppSelector(s => s.customers.items);
  const saving = useAppSelector(s => s.invoices.status === "saving");

  useEffect(() => {
    if (customers.length === 0) dispatch(fetchCustomers());
  }, [customers.length, dispatch]);

  const { register, control, handleSubmit, watch, reset, formState: { errors } } = useForm<InvoiceFormType, unknown, InvoiceFormType>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: {
      customerId: "", date: today, dueDate: "",
      items: [{ description: "", quantity: 1, price: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const lineItems = watch("items");
  const custId = watch("customerId");
  const total = lineItems.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0);

  useEffect(() => {
    if (custId) dispatch(fetchInvoicesByCustomer(custId));
  }, [custId, dispatch]);

  const onSubmit = async (data: InvoiceFormType) => {
    await dispatch(createInvoice(data)).unwrap();
    reset({ customerId: data.customerId, date: today, dueDate: "", items: [{ description: "", quantity: 1, price: 0 }] });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Customer</label>
          <select {...register("customerId")} className={cls + " bg-white"}>
            <option value="">Select customer...</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
            ))}
          </select>
          {errors.customerId && <p className="text-xs text-red-500">{errors.customerId.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Invoice Date</label>
          <input type="date" {...register("date")} className={cls} />
          {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Due Date</label>
          <input type="date" {...register("dueDate")} className={cls} />
          {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate.message}</p>}
        </div>
      </div>

      <div>
        <div className="mb-2 grid grid-cols-[1fr_80px_100px_90px_32px] gap-2 text-xs text-gray-400">
          <span>Description</span>
          <span className="text-right">Qty</span>
          <span className="text-right">Price</span>
          <span className="text-right">Amount</span>
          <span />
        </div>

        <div className="space-y-2">
          {fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-[1fr_80px_100px_90px_32px] items-start gap-2">
              <div>
                <input {...register(`items.${i}.description`)} placeholder="Item description" className={cls + " w-full"} />
                {errors.items?.[i]?.description && <p className="mt-0.5 text-xs text-red-500">{errors.items[i].description?.message}</p>}
              </div>

              <div>
                <input type="number" min={1} {...register(`items.${i}.quantity`, { valueAsNumber: true })} className={cls + " w-full text-right"} />
                {errors.items?.[i]?.quantity && <p className="mt-0.5 text-xs text-red-500">{errors.items[i].quantity?.message}</p>}
              </div>

              <div>
                <input type="number" min={0} step={0.01} {...register(`items.${i}.price`, { valueAsNumber: true })} className={cls + " w-full text-right"} />
                {errors.items?.[i]?.price && <p className="mt-0.5 text-xs text-red-500">{errors.items[i].price?.message}</p>}
              </div>

              <div className="flex items-center justify-end pt-2">
                <span className="text-sm text-gray-700">
                  ₹{((Number(lineItems[i]?.quantity) || 0) * (Number(lineItems[i]?.price) || 0)).toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => remove(i)}
                disabled={fields.length === 1}
                className="mt-1.5 flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30"
              >✕</button>
            </div>
          ))}
        </div>

        {errors.items && !Array.isArray(errors.items) && (
          <p className="mt-1 text-xs text-red-500">{(errors.items as { message?: string }).message}</p>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <button type="button" onClick={() => append({ description: "", quantity: 1, price: 0 })} className="text-sm text-blue-600 hover:underline">+ Add item's</button>
          <p className="text-sm font-semibold text-gray-800">Total &nbsp;₹{total.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="rounded bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">{saving ? "Saving..." : "Create Invoice"}</button>
      </div>
    </form>
  );
}
