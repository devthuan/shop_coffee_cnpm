import api from "./api";

export const GetAllBillAPI = (query) => {
  return api.get(`bills?${query}`);
};
export const GetBill_IDAPI = (id) => {
  return api.get(`bills/${id}`);
};

export const AddBill = async (data) => {
  return await api.post(`bills`, data)
}