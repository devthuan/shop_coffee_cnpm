
import productReducer from '~/redux/features/Product/PoductSlice'; // Đường dẫn tới productSlice
import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "./features/Accounts/accountsSilce";
import rolesReducer from "./features/Roles/rolesSilce";
import catagoriesReducer from "./features/Categories/categoriesSlice"
import userInfoReducer from "./features/UserInfor/User_InforSlice"
import billReducer from '~/redux/features/Bill/billSilice';
import IdBillDetailReducer from '~/redux/features/IdBillDetail/IdBillDetailSlice';
export const store = configureStore({
  reducer: {
    products: productReducer,
    bill: billReducer,
    catagories: catagoriesReducer,
    userInfo: userInfoReducer,
    accounts: accountsReducer,
    roles: rolesReducer,
    idBillDetails: IdBillDetailReducer
    
  },
});



