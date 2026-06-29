import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchCustomers, deleteCustomer,
  setSearch, setSortBy, toggleSortOrder,
  selectFilteredCustomers, selectStatus,
  selectSearch, selectSortBy, selectSortOrder, selectTotalCount,
  type SortField,
} from "../store/customerSlice";

const PAGE_SIZE = 5;

export default function CustomerList() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const search = useAppSelector(selectSearch);
  const sortBy = useAppSelector(selectSortBy);
  const sortOrder = useAppSelector(selectSortOrder);
  const total = useAppSelector(selectTotalCount);
  const list = useAppSelector(selectFilteredCustomers);
  const [page, setPage] = useState(1);

  useEffect(() => { dispatch(fetchCustomers()); }, [dispatch]);
  useEffect(() => { setPage(1); }, [search, sortBy, sortOrder]);

  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const rows = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (status === "loading") return <p className="py-6 text-center text-sm text-gray-400">Loading...</p>;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="search"
          value={search}
          onChange={e => dispatch(setSearch(e.target.value))}
          placeholder="Search by name, email or phone..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
        <select
          value={sortBy}
          onChange={e => dispatch(setSortBy(e.target.value as SortField))}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="createdAt">Date</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
        </select>
        <button onClick={() => dispatch(toggleSortOrder())} className="border border-gray-300 rounded px-3 py-2 text-sm hover:bg-gray-50">
          {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
        </button>
      </div>

      {total > 0 && (
        <p className="text-xs text-gray-400">
          {list.length === total ? `${total} customer${total !== 1 ? "s" : ""}` : `${list.length} of ${total} customers`}
        </p>
      )}

      {list.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          {total === 0 ? "No customers yet. Add one above." : "No results found."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Added</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{c.firstName} {c.lastName}</td>
                  <td className="px-4 py-3 text-gray-600">{c.email || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{c.phone || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{c.billing.city}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => dispatch(deleteCustomer(c.id))} className="text-xs text-red-400 hover:text-red-600">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="border rounded px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-gray-50">Prev</button>
          <span className="text-xs text-gray-500">{page} / {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="border rounded px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-gray-50">Next</button>
        </div>
      )}
    </div>
  );
}
