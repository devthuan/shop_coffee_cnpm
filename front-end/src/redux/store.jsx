import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice"; // Import cartSlice

// code demo
// import productDemoSlice from "./features/product/productDemoSlice";


export const store = configureStore({
  reducer: {
    // code demo
    // product: productDemoSlice,
    cart: cartReducer,
  },
});
