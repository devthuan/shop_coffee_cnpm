import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "./features/Accounts/accountsSilce";
import rolesReducer from "./features/Roles/rolesSilce";

export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    roles: rolesReducer
  },
});
