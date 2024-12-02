import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  total: 0,
  totalPage: 0,
  currentPage: 0,
  limit: 0,
  data: [],
  isLoading: true,
};

export const discountsSlice = createSlice({
  name: "discounts",
  initialState,
  reducers: {
    initDataDiscount: (state, action) => {
      state.total = action.payload?.total;
      state.totalPage = action.payload?.totalPage;
      state.currentPage = action.payload?.currentPage;
      state.limit = action.payload?.limit;
      state.data = action.payload?.data;
      state.isLoading = action.payload?.isLoading;
    },

    addDiscount: (state, action) => {
      state.data.push(action.payload);
    },

    deleteDiscount: (state, action) => {
      const id = action.payload.id;
      const isExistDiscount = state.data.find(
        (attribute) => attribute.id === id
      );
      if (isExistDiscount) {
        state.data = state.data.filter((discount) => discount.id !== id);
      }
    },

    updateDiscount: (state, action) => {
      const id = action.payload.id;
      const discountId = state.data.findIndex((discount) => discount.id === id);
      if (discountId !== -1) {
        state.data[discountId] = {
          ...state.data[discountId],
          name: action.payload.name,
          code: action.payload.code,
          quantity: action.payload.quantity,
          value: action.payload.value,
          stateDate: action.payload.stateDate,
          endDate: action.payload.endDate,
        };
      }
    },
  },
});

export const { initDataDiscount, addDiscount, deleteDiscount, updateDiscount } =
  discountsSlice.actions;
export default discountsSlice.reducer;
