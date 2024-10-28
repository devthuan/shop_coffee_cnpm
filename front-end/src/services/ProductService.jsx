import api from "./api";

// code demo
export const getALLProducts = (query) => {
      return api.get(`products?${query}`)
};  


