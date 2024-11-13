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

export const suppliersSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    initDataSupplier: (state, action) => {
      state.data = action.payload?.data;
      state.total = action.payload?.total;
      state.currentPage = action.payload?.currentPage;
      state.totalPage = action.payload?.totalPage;
      state.limit = action.payload?.limit;
      state.loading = false;
      state.error = action.payload?.error;
    },

    addSupplier: (state, action) => {
      state.data.unshift(action.payload);
      state.loading = false;
    },

    initErrorSupplier(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    removeSupplier: (state, action) => {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
      state.loading = false;
    },

    clearDataSupplier: (state, action) => {
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
  initDataSupplier,
  initErrorSupplier,
  addSupplier,
  removeSupplier,
  clearDataSupplier,
} = suppliersSlice.actions;

export default suppliersSlice.reducer;
