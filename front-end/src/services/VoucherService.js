import api from "./api";

// code demo
export const GetAllVoucher = async() => {
  return await api.get(`vouchers`)
};
