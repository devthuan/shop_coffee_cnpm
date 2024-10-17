import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Mảng chứa các sản phẩm trong giỏ hàng
  totalQuantity: 0, // Tổng số lượng sản phẩm trong giỏ hàng
  totalPrice: 0, // Tổng giá trị của giỏ hàng
};

export const cartSlice = createSlice({
  name: "cart", 
  initialState,
  reducers: {

    // add cart
    addToCart: (state, action) => {
      const newItem = action.payload; 
      const existingItem = state.items.find((item) => item.id === newItem.id); 
      if (!existingItem) {
        state.items.push({
          ...newItem,
          quantity: 1, 
        });
      } else {
        existingItem.quantity++;
      }

      state.totalQuantity++;
      state.totalPrice += newItem.price;
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity; 
        state.totalPrice -= existingItem.price * existingItem.quantity; 
        state.items = state.items.filter((item) => item.id !== id); 
      }
    },

    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id); 

      if (existingItem) {
        const quantityDifference = quantity - existingItem.quantity; 
        state.totalQuantity += quantityDifference; 
        state.totalPrice += existingItem.price * quantityDifference; 
        existingItem.quantity = quantity; 
      }
    },
  },
});

export const { addToCart, removeFromCart, updateCartQuantity } = cartSlice.actions;

export default cartSlice.reducer;
