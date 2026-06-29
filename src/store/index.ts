import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./customerSlice";
import invoiceReducer from "./invoiceSlice";

export const store = configureStore({
  reducer: {
    customers: customerReducer,
    invoices: invoiceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
