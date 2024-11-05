import api from "./api";

// code demo
export const GetAllPaynment = async() => {
  return await api.get(`vouchers`)
};