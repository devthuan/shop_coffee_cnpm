import { createSlice } from '@reduxjs/toolkit';
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
  name: 'favoriteUser',
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
      const newFavorite = action.payload;
      if (!state.favoriteProducts.some(favorite => favorite.productId === newFavorite.productId)) {
          state.favoriteProducts.push(newFavorite);
      }
  },
    clearFavorite: (state, action) => {
      const productId = action.payload;
      if (Array.isArray(state.favoriteProducts)) {
        state.favoriteProducts = state.favoriteProducts.filter(
          (favorite) => favorite.productId !== productId
        );
      }
    }
  },
});
export const { initDataFavoriteUser, clearDataFavoriteUser, clearFavorite, addFavorite } = favoriteUserSlice.actions;
export default favoriteUserSlice.reducer;
