import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  total: 0,
  totalPage: 0,
  currentPage: 0,
  limit: 0,
  data: [],
  productDetail: {},
  loading: true,
  error: null,
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
   initDataProduct: (state,action) => {
      state.data = action.payload?.data;
      state.total = action.payload?.total;
      state.currentPage = action.payload?.currentPage;
      state.totalPage = action.payload?.totalPage;
      state.limit = action.payload?.limit;
      state.loading = false;
      state.error = action.payload?.error;
   },
   initProductDetail: (state, action) => {
    state.productDetail = action.payload;
    state.loading = false;
    state.error = null;
   },

   clearDataProduct: (state, action) => {
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

// Export các action
export const { initDataProduct, clearDataProduct, initProductDetail } =
  productSlice.actions;

export default productSlice.reducer;
