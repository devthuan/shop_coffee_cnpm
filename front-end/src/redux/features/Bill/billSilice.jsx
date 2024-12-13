import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  total: 0,
  totalPage: 0,
  currentPage: 0,
  limit: 0,
  data: [],
  detail: "",
  dataOrderPending: [],
  loading: true,
  error: null,
};

export const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    initDataBill: (state, action) => {
      state.data = action.payload?.data;
      state.total = action.payload?.total;
      state.currentPage = action.payload?.currentPage;
      state.totalPage = action.payload?.totalPage;
      state.limit = action.payload?.limit;
      state.loading = false;
      state.error = action.payload?.error;
    },

    initDetailBill: (state, action) => {
      state.detail = action.payload;
    },
    initOrderPending: (state, action) => {
      state.dataOrderPending = action.payload;
    },

    clearDataBill: (state, action) => {
      state.data = [];
      state.total = 0;
      state.currentPage = 0;
      state.totalPage = 0;
      state.limit = 0;
      state.loading = true;
      state.error = null;
    },
    changeStatusBill: (state, action) => {
      let billIndex = state?.data.findIndex(
        (item) => item.id === action.payload.id
      );
      console.log(billIndex);
      if (billIndex !== -1) {
        state.data[billIndex] = {
          ...state.data[billIndex],
          status: action.payload.status,
        };
      } else {
        console.log("không có bill này");
      }
    },

    initErrorBill: (state, action) => {
      state.error = action.payload.error;
      state.loading = false;
      state.data = [];
      state.total = 0;
      state.currentPage = 0;
      state.totalPage = 0;
      state.limit = 0;
      state.detail = "";
    },
  },
});

// Export các action
export const {
  initOrderPending,
  initDataBill,
  changeStatusBill,
  initErrorBill,
  initDetailBill,
  clearDataBill,
} = billSlice.actions;

export default billSlice.reducer;
