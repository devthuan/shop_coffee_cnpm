// store.js
import { configureStore } from '@reduxjs/toolkit';
import productReducer from 'src/redux/features/PoductSlice'; // Đường dẫn tới productSlice

export const store = configureStore({
  reducer: {
    products: productReducer, // Kết hợp reducer vào store
  },
});


