import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [], 
  loading: false,
  error: null,
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.data = action.payload; 
    },
  },
});

// Export các action
export const { setProducts } = productSlice.actions;

export default productSlice.reducer;
