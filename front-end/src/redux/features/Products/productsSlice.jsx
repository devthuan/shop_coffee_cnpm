import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  total: 0,
  totalPage: 0,
  currentPage: 0,
  limit: 0,
  data: [],
  isLoading: true,
};
export const productsSlice = createSlice({
  name: "productss",
  initialState,
  reducers: {
    initDataProduct: (state, action) => {
      state.total = action.payload?.total;
      state.totalPage = action.payload?.totalPage;
      state.currentPage = action.payload?.currentPage;
      state.limit = action.payload?.limit;
      state.data = action.payload?.data;
      state.isLoading = false;
    },

    initDetailProduct: (state, action) => {
      state.id = action.payload?.id;
      state.description = action.payload?.description;
      state.name = action.payload?.name;
      state.images = action.payload?.images;
      state.productAttributes = action.payload?.productAttributes;
    },

    addProduct: (state, action) => {
      state.data.unshift(action.payload);
      state.isLoading = false;
    },

    updateProduct: (state, action) => {
      const productIndex = state.data.findIndex(
        (product) => product.id === action.payload.id
      );

      if (productIndex !== -1) {
        // const existingProduct = state.data[productIndex];
        // const newAttributes = action.payload.productAttributes
        // newAttributes.forEach(newAttr => {
        //     const isExistAttribute = existingProduct.productAttributes.some(
        //         existAttr => existAttr.attributes.id === newAttr.attributeId
        //     )
        //     if(!isExistAttribute)
        //     {
        // existingProduct.productAttributes.push({
        //     "attributes": {
        //         "id": "1886383d-2d49-4866-a64e-c0c12581d39a",
        //     }
        // })

        // })

        state.data[productIndex] = {
          ...state.data[productIndex],
          name: action.payload.name,
          description: action.payload.description,
          category: action.payload.category,
          productAttributes: action.payload.productAttributes,
        };
      }
    },

    deleteProduct: (state, action) => {
      const id = action.payload.id;
      const isExistProduct = state.data.find((product) => product.id === id);
      if (isExistProduct) {
        state.data = state.data.filter((product) => product.id !== id);
      }
    },
  },
});
export const {
  initDataProduct,
  initDetailProduct,
  updateProduct,
  deleteProduct,
  addProduct,
} = productsSlice.actions;
export default productsSlice.reducer;
