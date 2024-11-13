import api from "./api";

export const GetAllBillAPI = (query) => {
  return api.get(`bills?${query}`);
};
export const GetBill_IDAPI = (id) => {
  return api.get(`bills/${id}`);
};
export const GetBill_AccountAPI = (account) => {
  return api.get(`bills/account`);
};

export const AddBill = async (data) => {
  return await api.post(`bills`, data)
}