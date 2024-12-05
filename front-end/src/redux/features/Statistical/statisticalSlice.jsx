import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalRevenue: 0,
  totalBills: 0,
  totalProduct: 0,
  totalAccount: 0,
  data: [],
  dataRevenue: [],
  dataBillings: [],
  dataProducts: [],
  dataImportReceipt: [],
  loading: true,
  error: null,
};

export const statisticalSlice = createSlice({
  name: "statistical",
  initialState,
  reducers: {
    initDataStatistical: (state, action) => {
      state.totalRevenue = action.payload?.totalRevenue;
      state.totalBills = action.payload?.totalProducts;
      state.totalProduct = action.payload?.totalUsers;
      state.totalAccount = action.payload?.totalBills;
      state.loading = false;
      state.error = action.payload?.error;
    },
    initDataRevenue: (state, action) => {
      state.dataRevenue = action.payload?.data;
    },
    initDataBillings: (state, action) => {
      state.dataBillings = action.payload?.data;
    },
    initDataProducts: (state, action) => {
      state.dataProducts = action.payload?.data;
    },
    initDataImportReceipt: (state, action) => {
      state.dataImportReceipt = action.payload?.data;
    },

    initError: (state, action) => {
      state.error = action.payload?.error;
      state.loading = false;
    },

    clearDataStatistical: (state, action) => {
      state.totalRevenue = 0;
      state.totalBills = 0;
      state.totalProduct = 0;
      state.totalAccount = 0;
      state.loading = true;
      state.error = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  initDataProducts,
  initDataBillings,
  initDataRevenue,
  initDataImportReceipt,
  initDataStatistical,
  clearDataStatistical,
  initError,
} = statisticalSlice.actions;

export default statisticalSlice.reducer;
