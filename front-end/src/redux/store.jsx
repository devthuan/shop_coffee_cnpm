import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "./features/Accounts/accountsSilce";

export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
  },
});
