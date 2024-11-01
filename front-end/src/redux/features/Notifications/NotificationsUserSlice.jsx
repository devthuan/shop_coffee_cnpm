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

export const NotificationsUserSlice = createSlice({
  name: "notificationsUser",
  initialState,
  reducers: {
    initDataNotificationUser: (state, action) => {
      state.data = action.payload?.data;
      state.total = action.payload?.total;
      state.currentPage = action.payload?.currentPage;
      state.totalPage = action.payload?.totalPage;
      state.limit = action.payload?.limit;
      state.loading = false;
      state.error = action.payload?.error;
    },

    addNotificationUser: (state, action) => {
      state.data.push(action.payload);
      state.loading = false;
    },

    readNotificationUser: (state, action) => {
      let item = state?.data?.findIndex(
        (item) => item.id === action.payload.id
      );
      console.log(item);
      // console.log(action.payload.userName);
      if (item !== -1) {
        state.data[item] = {
          ...state.data[item], // Keep other account properties
          isRead: "True", // Update the userName status
        };
      }
    },

    removeNotificationUser: (state, action) => {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
      state.loading = false;
    },

    setErrorNotificationUser: (state, action) => {
      state.error = action.payload;
    },

    clearDataNotificationUser: (state, action) => {
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
  initDataNotificationUser,
  addNotificationUser,
  removeNotificationUser,
  setErrorNotificationUser,
  clearDataNotificationUser,
  readNotificationUser,
} = NotificationsUserSlice.actions;

export default NotificationsUserSlice.reducer;
