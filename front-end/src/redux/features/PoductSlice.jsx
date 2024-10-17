import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [], // Lưu danh sách sản phẩm
  loading: false,
  error: null,
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.data = action.payload; // Lưu danh sách sản phẩm
    },
    setLoading: (state, action) => {
      state.loading = action.payload; // Quản lý trạng thái loading
    },
    setError: (state, action) => {
      state.error = action.payload; // Quản lý lỗi
    },
  },
});

// Export các action
export const { setProducts, setLoading, setError } = productSlice.actions;

export default productSlice.reducer;
