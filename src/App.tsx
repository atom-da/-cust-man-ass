import CustomerForm from './customers/CustomerForm'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12">
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Customer Registration</h1>
          <p className="mt-1 text-sm text-gray-500">Fill in the details to add a new customer.</p>
        </div>
        <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <CustomerForm />
        </div>
      </div>
    </div>
  )
}
