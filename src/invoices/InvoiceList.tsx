import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectInvoices, selectInvoiceStatus, selectSelectedCustomerId, toggleInvoiceStatus, deleteInvoice } from "../store/invoiceSlice";

function Badge({ status, onClick }: { status: "paid" | "unpaid"; onClick: () => void }) {
  const base = "rounded px-2.5 py-0.5 text-xs font-medium";
  const color = status === "paid" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-amber-100 text-amber-700 hover:bg-amber-200";
  return <button onClick={onClick} className={`${base} ${color}`}>{status === "paid" ? "Paid" : "Unpaid"}</button>;
}

export default function InvoiceList() {
  const dispatch = useAppDispatch();
  const invoices = useAppSelector(selectInvoices);
  const status = useAppSelector(selectInvoiceStatus);
  const custId = useAppSelector(selectSelectedCustomerId);

  if (!custId) return <p className="py-4 text-center text-sm text-gray-400">Select a customer above to view their invoices.</p>;
  if (status === "loading") return <p className="py-4 text-center text-sm text-gray-400">Loading...</p>;
  if (invoices.length === 0) return <p className="py-4 text-center text-sm text-gray-400">No invoices for this customer yet.</p>;

  const paid = invoices.filter(i => i.status === "paid").length;
  const unpaid = invoices.length - paid;
  const balance = invoices.filter(i => i.status === "unpaid").reduce((s, i) => s + i.total, 0);

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
        {" · "}<span className="text-green-600">{paid} paid</span>
        {" · "}<span className="text-amber-600">{unpaid} unpaid</span>
        {unpaid > 0 && <span className="text-gray-600"> · ₹{balance.toFixed(2)} outstanding</span>}
      </p>

      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Ref</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Due</th>
              <th className="px-4 py-3 font-medium text-right">Items</th>
              <th className="px-4 py-3 font-medium text-right">Total</th>
              <th className="px-4 py-3 font-medium text-center">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-400">{inv.ref}</td>
                <td className="px-4 py-3 text-gray-700">{new Date(inv.date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-gray-700">{new Date(inv.dueDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right text-gray-500">{inv.items.length}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">₹{inv.total.toFixed(2)}</td>
                <td className="px-4 py-3 text-center">
                  <Badge status={inv.status} onClick={() => dispatch(toggleInvoiceStatus({ id: inv.id, current: inv.status }))} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => dispatch(deleteInvoice(inv.id))} className="text-xs text-red-400 hover:text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
