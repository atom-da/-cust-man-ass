import CustomerForm from "./customers/CustomerForm";
import CustomerList from "./customers/CustomerList";
import InvoiceForm from "./invoices/InvoiceForm";
import InvoiceList from "./invoices/InvoiceList";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12 space-y-16">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Customer Management</h2>
          <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
            <CustomerForm />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Customers</h2>
          <CustomerList />
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Billing</h2>
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h3 className="mb-6 text-base font-semibold text-gray-800">Create Invoice</h3>
            <InvoiceForm />
          </div>
          <div className="p-6">
            <h3 className="mb-6 text-base font-semibold text-gray-800">Invoices</h3>
            <InvoiceList />
          </div>
        </div>
      </div>
    </div>
  );
}
