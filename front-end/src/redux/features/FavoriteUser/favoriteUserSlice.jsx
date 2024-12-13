import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  total: 0,
  totalPage: 0,
  currentPage: 0,
  limit: 0,
  data: [],
  loading: true,
  error: null,
};
export const favoriteUserSlice = createSlice({
  name: "favoriteUser",
  initialState,
  reducers: {
    initDataFavoriteUser: (state, action) => {
      state.data = action.payload?.data;
      state.total = action.payload?.total;
      state.currentPage = action.payload?.currentPage;
      state.totalPage = action.payload?.totalPage;
      state.limit = action.payload?.limit;
      state.loading = false;
      state.error = action.payload?.error;
    },
    clearDataFavoriteUser: (state, action) => {
      state.data = [];
      state.total = 0;
      state.currentPage = 0;
      state.totalPage = 0;
      state.limit = 0;
      state.loading = true;
      state.error = null;
    },
    addFavorite: (state, action) => {
      const newFavorite = action.payload.data;
      console.log(newFavorite);
      state.data.push(newFavorite);
    },
    deleteFavorite: (state, action) => {
      console.log(action.payload.id);
      state.data = state.data.filter((item) => item.id !== action.payload.id);
    },
  },
});
export const {
  initDataFavoriteUser,
  clearDataFavoriteUser,
  deleteFavorite,
  addFavorite,
} = favoriteUserSlice.actions;
export default favoriteUserSlice.reducer;
