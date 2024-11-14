import productReducer from "~/redux/features/Product/PoductSlice"; // Đường dẫn tới productSlice
import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "./features/Accounts/accountsSilce";
import rolesReducer from "./features/Roles/rolesSilce";
import productsReducer from "./features/Products/productsSlice"
import attributesReducer from "./features/Attributes/attributesSlice"
import discountsReducer from "./features/Discounts/discountsSlice"
import statisticalReducer from "./features/Statistical/statisticalSlice"


import billReducer from '~/redux/features/Bill/billSilice';
import IdBillDetailReducer from '~/redux/features/IdBillDetail/IdBillDetailSlice';

import permissionsReducer from "./features/Permissions/permissionsSilce";
import inventoriesReducer from "./features/Inventories/inventoriesSilce";
import suppliersReducer from "./features/Suppliers/suppliersSlice";
import receiptsReducer from "./features/Receipts/receiptsSlice";
import catagoriesReducer from "./features/Categories/categoriesSlice"
import userInfoReducer from "./features/UserInfor/User_InforSlice";
import cartReducer from "./features/cart/cartSlice";
import authReducer from "./features/AuthSlice/authSlice"; // Đường dẫn tới authSlice
import vouchersReducer from "./features/Vouchers/voucherSlice"
import notificationReducer from "./features/Notifications/NotificationsSilce";
import notificationUserReducer from "./features/Notifications/NotificationsUserSlice"; //
import paymentsReducer from "./features/Payments/paymentsSlice"
import favoriteUserReducer from "~/redux/features/FavoriteUser/favoriteUserSlice";
import billAccountReducer from "~/redux/features/BillAccount/billAccountSlice";


export const store = configureStore({
  reducer: {
    products: productReducer,
    // products: productsReducer,
    bill: billReducer,
    catagories: catagoriesReducer,
    userInfo: userInfoReducer,
    cart: cartReducer,
    accounts: accountsReducer,
    roles: rolesReducer,
    idBillDetails: IdBillDetailReducer,
    permissions: permissionsReducer,
    inventories: inventoriesReducer,
    attributes: attributesReducer,
    discounts: discountsReducer,
    suppliers: suppliersReducer,
    productss: productsReducer,

    auth: authReducer,
    receipts: receiptsReducer,
    auth: authReducer,
    vouchers: vouchersReducer,

    notifications: notificationReducer,
    notificationUser: notificationUserReducer,
    statistical: statisticalReducer,
    payments: paymentsReducer,
    favoriteUser: favoriteUserReducer,
    billAccount: billAccountReducer
  },

  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});




