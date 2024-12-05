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

export const vouchersSlice = createSlice({
  name: "vouchers",
  initialState,
  reducers: {
    initDataVoucher: (state, action) => {
      state.data = action.payload?.data;
      state.total = action.payload?.total;
      state.currentPage = action.payload?.currentPage;
      state.totalPage = action.payload?.totalPage;
      state.limit = action.payload?.limit;
      state.loading = false;
      state.error = action.payload?.error;
    },

    addVoucher: (state, action) => {
      console.log(action.payload);
      state.data.push(action.payload);
      state.loading = false;
    },

    updateStatusVoucher: (state, action) => {
      let voucherIndex = state?.data?.findIndex(
        (item) => item.id === action.payload.id
      );
      if (voucherIndex !== -1) {
        state.data[voucherIndex] = {
          ...state.data[voucherIndex], // Keep other account properties
          isActive: action.payload.status, // Update the isActive status
        };
      }
    },

    updateVoucher: (state, action) => {
      let voucherIndex = state?.data?.findIndex(
        (item) => item.id === action.payload.id
      );
      console.log(voucherIndex);
      console.log(action.payload.id);
      // console.log(action.payload.userName);
      if (voucherIndex !== -1) {
        state.data[voucherIndex] = {
          ...state.data[voucherIndex], // Keep other account properties
          value: action.payload.value,
          quantity: action.payload.quantity,
        };
      }
    },

    removeVoucher: (state, action) => {
      state.data = state.data.filter((item) => item.id !== action.payload);
      state.loading = false;
    },

    // Nếu cần, bạn có thể thêm các reducer khác
    initErrorVoucher: (state, action) => {
      state.error = action.payload.error;
    },
    clearDataVoucher: (state, action) => {
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

// Action creators are generated for each case reducer function
export const {
  initErrorVoucher,
  initDataVoucher,
  addVoucher,
  removeVoucher,
  clearDataVoucher,
  updateStatusVoucher,
  updateVoucher,
  deleteVoucher,
} = vouchersSlice.actions;

export default vouchersSlice.reducer;
