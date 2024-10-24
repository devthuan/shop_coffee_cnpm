
import productReducer from '~/redux/features/Product/PoductSlice'; // Đường dẫn tới productSlice
import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "./features/Accounts/accountsSilce";
import rolesReducer from "./features/Roles/rolesSilce";
import catagoriesReducer from "./features/Categories/categoriesSlice"
import userInfoReducer from "./features/UserInfor/User_InforSlice"
export const store = configureStore({
  reducer: {
    products: productReducer,
    catagories: catagoriesReducer,
    userInfo: userInfoReducer,
    accounts: accountsReducer,
    roles: rolesReducer
  },
});


