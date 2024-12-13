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
      state.data.unshift(action.payload);
      state.loading = false;
    },

    updateStatusAccount: (state, action) => {
      let accountIndex = state?.data?.findIndex(
        (item) => item.id === action.payload.id
      );
      if (accountIndex !== -1) {
        state.data[accountIndex] = {
          ...state.data[accountIndex], // Keep other account properties
          isActive: action.payload.status, // Update the isActive status
        };
      }
    },

    updateAccount: (state, action) => {
      let accountIndex = state?.data?.findIndex(
        (item) => item.id === action.payload.id
      );
      console.log(accountIndex);
      console.log(action.payload.role);
      // console.log(action.payload.userName);
      if (accountIndex !== -1) {
        state.data[accountIndex] = {
          ...state.data[accountIndex], // Keep other account properties
          userName: action.payload.userName, // Update the userName status
          // role: {
          //   ...state.data[accountIndex].role, // Spread the current role object
          //   name: action.payload.role,
          // },
          role: action.payload.role,
        };
      }
    },

    removeAccount: (state, action) => {
      state.data = state.data.filter((item) => item.id !== action.payload);
      state.loading = false;
    },

    clearDataAccount: (state, action) => {
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
  initDataAccount,
  addAccount,
  removeAccount,
  clearDataAccount,
  updateStatusAccount,
  updateAccount,
} = accountsSlice.actions;

export default accountsSlice.reducer;
