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
export const catagoriesSlice = createSlice({
    name: 'catagories',
    initialState,
    reducers: {
     initDataCatagories: (state,action) => {
        state.data = action.payload?.data;
        state.total = action.payload?.total;
        state.currentPage = action.payload?.currentPage;
        state.totalPage = action.payload?.totalPage;
        state.limit = action.payload?.limit;
        state.loading = false;
        state.error = action.payload?.error;
     },
     clearDataCatagories: (state, action) => {
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
  export const { initDataCatagories,clearDataCatagories } = catagoriesSlice.actions;
  
  export default catagoriesSlice.reducer;
  