import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  total: '',
  totalPage: '',
  currentPage: '',
  limit: '',
  data: [],
  loading: true
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    // init data 
    initCart: (state, action) => {
      state.total = action.payload?.total
      state.totalPage = action.payload?.totalPage
      state.currentPage = action.payload?.currentPage
      state.limit = action.payload?.limit
      state.data = action.payload?.data
      state.loading = false
    },


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


    increaseCart: (state, action) => {
      const { id } = action.payload;
      state.data.map((cart, index) => {
        if(cart.id != id)
        {
          state.data[index].quantity += 1
        }
      })
    },

    decreaseCart: (state, action) => {
      const { id } = action.payload;
      state.data.map((cart, index) => {
        if(cart.id != id)
        {
          if(state.data[index].quantity === 1)
          {
            return;
          }
          state.data[index].quantity -= 1
        }
      })
    }
  },
});

export const { initCart, addToCart, removeFromCart , increaseCart, decreaseCart} = cartSlice.actions;

export default cartSlice.reducer;
