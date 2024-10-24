import api from "./api";

// code demo
export const getAllInfoUser = (query) => {
      return api.get(`user-information/user?${query}`)
};  

