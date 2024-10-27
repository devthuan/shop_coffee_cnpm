import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "./features/Accounts/accountsSilce";
import rolesReducer from "./features/Roles/rolesSilce";
import cartReducer from './features/cart/cartSlice'
import permissionsReducer from "./features/Permissions/permissionsSilce";
import inventoriesReducer from "./features/Inventories/inventoriesSilce";
export const store = configureStore({
  reducer: {
    cart : cartReducer,
    accounts: accountsReducer,
    roles: rolesReducer,
    permissions: permissionsReducer,
    inventories: inventoriesReducer,
  },
});
