import { createSlice, createAsyncThunk, createSelector, type PayloadAction } from "@reduxjs/toolkit";
import { addCustomer, listCustomers, removeCustomer, type StoredCustomer } from "../customers/storage";
import type { CustomerSchemaType } from "../customers/schema";
import type { RootState } from "./index";

export type SortField = "name" | "email" | "createdAt";
export type SortOrder = "asc" | "desc";

interface CustomerState {
  items: StoredCustomer[];
  status: "idle" | "loading" | "saving" | "failed";
  search: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

const initialState: CustomerState = {
  items: [],
  status: "idle",
  search: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

export const fetchCustomers = createAsyncThunk("customers/fetch", async () => listCustomers());

export const createCustomer = createAsyncThunk("customers/create", async (data: CustomerSchemaType) => addCustomer(data));

export const deleteCustomer = createAsyncThunk("customers/delete", async (id: string) => {
  await removeCustomer(id);
  return id;
});

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) { state.search = action.payload; },
    setSortBy(state, action: PayloadAction<SortField>) { state.sortBy = action.payload; },
    toggleSortOrder(state) { state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc"; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => { state.status = "loading"; })
      .addCase(fetchCustomers.fulfilled, (state, action) => { state.status = "idle"; state.items = action.payload; })
      .addCase(createCustomer.pending, (state) => { state.status = "saving"; })
      .addCase(createCustomer.fulfilled, (state, action) => { state.status = "idle"; state.items.unshift(action.payload); })
      .addCase(createCustomer.rejected, (state) => { state.status = "failed"; })
      .addCase(deleteCustomer.fulfilled, (state, action) => { state.items = state.items.filter(c => c.id !== action.payload); });
  },
});

export const { setSearch, setSortBy, toggleSortOrder } = customerSlice.actions;
export default customerSlice.reducer;

export const selectStatus = (s: RootState) => s.customers.status;
export const selectSearch = (s: RootState) => s.customers.search;
export const selectSortBy = (s: RootState) => s.customers.sortBy;
export const selectSortOrder = (s: RootState) => s.customers.sortOrder;
export const selectTotalCount = (s: RootState) => s.customers.items.length;

export const selectFilteredCustomers = createSelector(
  (s: RootState) => s.customers,
  (c) => {
    let list = [...c.items];

    if (c.search.trim()) {
      const q = c.search.toLowerCase();
      list = list.filter(x =>
        `${x.firstName} ${x.lastName}`.toLowerCase().includes(q) ||
        x.email.toLowerCase().includes(q) ||
        x.phone.includes(q)
      );
    }

    const getVal = (x: StoredCustomer) =>
      c.sortBy === "name" ? `${x.firstName} ${x.lastName}` :
      c.sortBy === "email" ? x.email : x.createdAt;

    list.sort((a, b) =>
      c.sortOrder === "asc" ? getVal(a).localeCompare(getVal(b)) : getVal(b).localeCompare(getVal(a))
    );

    return list;
  }
);
