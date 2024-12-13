import api from "./api";

// code demo
export const getAllInfoUser = (query) => {
      return api.get(`user-information/user?${query}`)
};  

// 
export const updateInfoUser = (fullName, phoneNumber, address1, avatar) => {
      return api.patch('/user-information',{ fullName, phoneNumber, address1, avatar });
  };