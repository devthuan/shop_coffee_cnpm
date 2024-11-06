import api from "./api";

// code demo
export const getAllCategories = (query) => {
      return api.get(`categories?${query}`)
};  

