import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  loading: true,
  error: null,
};

export const permissionsSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    initDataPermission: (state, action) => {
      state.data = action.payload?.data;
      state.loading = false;
      state.error = action.payload?.error;
    },

    addPermission: (state, action) => {
      state.data.push(action.payload);
      state.loading = false;
    },

    removePermission: (state, action) => {
      state.data = state.data.filter((item) => item.id !== action.payload);
      state.loading = false;
    },

    clearDataPermission: (state, action) => {
      state.data = [];
      state.loading = true;
      state.error = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  initDataPermission,
  addPermission,
  removePermission,
  clearDataPermission,
  updateStatusAccount,
} = permissionsSlice.actions;

export default permissionsSlice.reducer;
