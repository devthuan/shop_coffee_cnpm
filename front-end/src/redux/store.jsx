import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
// code demo
// import productDemoSlice from "./features/product/productDemoSlice";



// src/store.js
import authSlice from "./features/product-demo/authSlice"; // Đường dẫn tới authSlice
  
export const store = configureStore({
  reducer: {
    auth: authSlice, // Thêm auth reducer vào store
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

