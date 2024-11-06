import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "./features/Accounts/accountsSilce";
import rolesReducer from "./features/Roles/rolesSilce";
import cartReducer from './features/cart/cartSlice'
import permissionsReducer from "./features/Permissions/permissionsSilce";
import inventoriesReducer from "./features/Inventories/inventoriesSilce";
import productsReducer from "./features/Products/productsSlice"
import categoriesReducer from "./features/Categories/categoriesSlice"
import attributesReducer from "./features/Attributes/attributesSlice"
import discountsReducer from "./features/Discounts/discountsSlice"
import receiptsReducer from "./features/Receipts/receiptsSlice"
export const store = configureStore({
  reducer: {
    cart : cartReducer,
    accounts: accountsReducer,
    roles: rolesReducer,
    permissions: permissionsReducer,
    inventories: inventoriesReducer,
    products : productsReducer,
    categories : categoriesReducer,
    attributes : attributesReducer,
    discounts : discountsReducer,
    receipts : receiptsReducer
  },
});
