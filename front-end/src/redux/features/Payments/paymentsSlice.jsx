import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  total: 0,
  currentPage: 0,
  totalPage: 0,
  limit: 0,
  data: [],
  loading: true,
  error: null,
};

export const PaymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    initDataPayment: (state, action) => {
      state.data = action.payload?.data;
      state.total = action.payload?.total;
      state.currentPage = action.payload?.currentPage;
      state.totalPage = action.payload?.totalPage;
      state.limit = action.payload?.limit;
      state.loading = false;
      state.error = action.payload?.error;
    },

    addPaymentMethod: (state, action) => {
      state.data.unshift(action.payload);
      state.loading = false;
    },

    updatePaymentMethod: (state, action) => {
      let item = state?.data?.findIndex(
        (item) => item.id === action.payload.id
      );
      console.log(item);
      // console.log(action.payload.userName);
      if (item !== -1) {
        state.data[item] = {
          ...state.data[item], 

          name: action.payload.name, 
        };
      }
    },

    removePaymentMethod: (state, action) => {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
      state.loading = false;
    },

    setErrorPaymentMethod: (state, action) => {
      state.error = action.payload;
    },

    clearDataPaymentMethod: (state, action) => {
      state.data = [];
      state.permission = [];
      state.total = 0;
      state.currentPage = 0;
      state.totalPage = 0;
      state.limit = 0;
      state.loading = true;
      state.error = null;
    },
  },
});

export const {
  initDataPayment,
  addPaymentMethod,
  updatePaymentMethod,
  removePaymentMethod,
  setErrorPaymentMethod,
  clearDataPaymentMethod,
} = PaymentsSlice.actions;

export default PaymentsSlice.reducer;
