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

export const NotificationsSilce = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    initDataNotification: (state, action) => {
      state.data = action.payload?.data;
      state.total = action.payload?.total;
      state.currentPage = action.payload?.currentPage;
      state.totalPage = action.payload?.totalPage;
      state.limit = action.payload?.limit;
      state.loading = false;
      state.error = action.payload?.error;
    },

    addNotification: (state, action) => {
      state.data.unshift(action.payload);
      state.loading = false;
    },

    updateNotification: (state, action) => {
      let item = state?.data?.findIndex(
        (item) => item.id === action.payload.id
      );
      console.log(item);
      // console.log(action.payload.userName);
      if (item !== -1) {
        state.data[item] = {
          ...state.data[item], // Keep other account properties
          title: action.payload.title, // Update the userName status
          content: action.payload.content, // Update the userName status
        };
      }
    },

    removeNotification: (state, action) => {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
      state.loading = false;
    },

    setErrorNotification: (state, action) => {
      state.error = action.payload;
    },

    clearDataNotification: (state, action) => {
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
  initDataNotification,
  addNotification,
  removeNotification,
  setErrorNotification,
  clearDataNotification,
  updateNotification,
} = NotificationsSilce.actions;

export default NotificationsSilce.reducer;
