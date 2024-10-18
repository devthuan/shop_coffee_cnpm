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

export const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    initDataAccount: (state, action) => {
      state.data = action.payload?.data;
      state.total = action.payload?.total;
      state.currentPage = action.payload?.currentPage;
      state.totalPage = action.payload?.totalPage;
      state.limit = action.payload?.limit;
      state.loading = false;
      state.error = action.payload?.error;
    },
    addAccount: (state, action) => {
      state.data.push(action.payload);
      state.loading = false;
    },

    removeAccount: (state, action) => {
      state.data = state.data.filter((item) => item.id !== action.payload);
      state.loading = false;
    },

    clearDataAccount: (state, action) => {
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
export const { initDataAccount, addAccount, removeAccount, clearDataAccount } =
  accountsSlice.actions;

export default accountsSlice.reducer;
