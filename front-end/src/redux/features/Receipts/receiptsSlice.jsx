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

export const ReceiptsSlice = createSlice({
  name: "receipts",
  initialState,
  reducers: {
    initDataReceipt: (state, action) => {
      state.data = action.payload?.data;
      state.total = action.payload?.total;
      state.currentPage = action.payload?.currentPage;
      state.totalPage = action.payload?.totalPage;
      state.limit = action.payload?.limit;
      state.loading = false;
      state.error = action.payload?.error;
    },

    changeStatusReceipt: (state, action) => {
      state.data = state.data.map((item) =>
        item.id === action.payload.id
          ? { ...item, status: action.payload.status }
          : item
      );
      state.loading = false;
    },

    addReceipt: (state, action) => {
      state.data.unshift(action.payload);
      state.loading = false;
    },

    removeReceipt: (state, action) => {
      state.data = state.data.filter((item) => item.id !== action.payload);
      state.loading = false;
    },

    clearDataReceipt: (state, action) => {
      state.data = [];
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
  initDataReceipt,
  addReceipt,
  removeReceipt,
  clearDataReceipt,
  changeStatusReceipt,
} = ReceiptsSlice.actions;

export default ReceiptsSlice.reducer;
