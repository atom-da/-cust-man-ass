import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { addInvoice, listInvoicesByCustomer, setInvoiceStatus, removeInvoice, type StoredInvoice } from "../invoices/invoiceStorage";
import type { InvoiceFormType } from "../invoices/invoiceSchema";
import type { RootState } from "./index";

interface InvoiceState {
  items: StoredInvoice[];
  custId: string;
  status: "idle" | "loading" | "saving";
}

const initialState: InvoiceState = {
  items: [],
  custId: "",
  status: "idle",
};

export const fetchInvoicesByCustomer = createAsyncThunk("invoices/fetchByCustomer", async (custId: string) => ({
  custId,
  invoices: await listInvoicesByCustomer(custId),
}));

export const createInvoice = createAsyncThunk("invoices/create", async (data: InvoiceFormType) => addInvoice(data));

export const toggleInvoiceStatus = createAsyncThunk("invoices/toggleStatus", async ({ id, current }: { id: string; current: "paid" | "unpaid" }) => {
  const next = current === "paid" ? "unpaid" : "paid";
  await setInvoiceStatus(id, next);
  return { id, status: next as "paid" | "unpaid" };
});

export const deleteInvoice = createAsyncThunk("invoices/delete", async (id: string) => {
  await removeInvoice(id);
  return id;
});

const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    setSelectedCustomer(state, action: PayloadAction<string>) { state.custId = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoicesByCustomer.pending, (state) => { state.status = "loading"; })
      .addCase(fetchInvoicesByCustomer.fulfilled, (state, action) => {
        state.status = "idle";
        state.custId = action.payload.custId;
        state.items = action.payload.invoices;
      })
      .addCase(createInvoice.pending, (state) => { state.status = "saving"; })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.status = "idle";
        if (action.payload.customerId === state.custId) state.items.unshift(action.payload);
      })
      .addCase(createInvoice.rejected, (state) => { state.status = "idle"; })
      .addCase(toggleInvoiceStatus.fulfilled, (state, action) => {
        const inv = state.items.find(i => i.id === action.payload.id);
        if (inv) inv.status = action.payload.status;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      });
  },
});

export const { setSelectedCustomer } = invoiceSlice.actions;
export default invoiceSlice.reducer;

export const selectInvoices = (s: RootState) => s.invoices.items;
export const selectInvoiceStatus = (s: RootState) => s.invoices.status;
export const selectSelectedCustomerId = (s: RootState) => s.invoices.custId;
