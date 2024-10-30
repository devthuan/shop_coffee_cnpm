import productReducer from "~/redux/features/Product/PoductSlice"; // Đường dẫn tới productSlice
import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "./features/Accounts/accountsSilce";
import rolesReducer from "./features/Roles/rolesSilce";
import permissionsReducer from "./features/Permissions/permissionsSilce";
import inventoriesReducer from "./features/Inventories/inventoriesSilce";
import suppliersReducer from "./features/Suppliers/suppliersSlice";
import receiptsReducer from "./features/Receipts/ReceiptsSlice";
import catagoriesReducer from "./features/Categories/categoriesSlice";
import userInfoReducer from "./features/UserInfor/User_InforSlice";
import cartReducer from "./features/cart/cartSlice";
import authReducer from "./features/AuthSlice/authSlice"; // Đường dẫn tới authSlice
import notificationReducer from "./features/Notifications/NotificationsSilce";

export const store = configureStore({
  reducer: {
    products: productReducer,
    catagories: catagoriesReducer,
    userInfo: userInfoReducer,
    cart: cartReducer,
    accounts: accountsReducer,
    roles: rolesReducer,
    permissions: permissionsReducer,
    inventories: inventoriesReducer,
    suppliers: suppliersReducer,
    receipts: receiptsReducer,
    auth: authReducer,
    notifications: notificationReducer,
  },

  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});
