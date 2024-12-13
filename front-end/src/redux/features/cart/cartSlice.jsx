import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  total: "",
  totalPage: "",
  currentPage: "",
  limit: "",
  data: [],
  loading: true,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // init data
    initCart: (state, action) => {
      state.total = action.payload?.total;
      state.totalPage = action.payload?.totalPage;
      state.currentPage = action.payload?.currentPage;
      state.limit = action.payload?.limit;
      state.data = action.payload?.data;
      state.loading = false;
    },

    // add cart
    addToCart: (state, action) => {
      const newItem = action.payload;
      console.log(newItem);
      const existingItem = state.data.find((item) => item.id === newItem.id);
      if (!existingItem) {
        state.data.push({
          ...newItem,
          quantity: 1,
        });
      } else {
        existingItem.quantity++;
      }

      state.totalQuantity++;
      state.totalPrice += newItem.price;
    },

    deleteCart: (state, action) => {
      const id = action.payload.id;
      const existingItem = state.data.find((item) => item.id === id);

      if (existingItem) {
        state.data = state.data.filter((item) => item.id !== id);
      }
    },

    increaseCart: (state, action) => {
      const id = action.payload.id;

      // Find the index of the cart item
      const index = state.data.findIndex((cart) => cart.id === id);

      // If the item exists in the cart, increase its quantity
      if (index !== -1) {
        state.data[index].quantity += 1;
      }
    },

    decreaseCart: (state, action) => {
      const id = action.payload.id;

      // Find the index of the cart item
      const index = state.data.findIndex((cart) => cart.id === id);

      // If the item exists in the cart and its quantity is greater than 1, decrease the quantity
      if (index !== -1 && state.data[index].quantity > 1) {
        state.data[index].quantity -= 1;
      }
    },
  },
});

export const { initCart, addToCart, deleteCart, increaseCart, decreaseCart } =
  cartSlice.actions;

export default cartSlice.reducer;
