import api from "./api";

export const GetAllBillAPI = (query) => {
  return api.get(`bills?${query}`);
};
export const GetBill_IDAPI = (id) => {
  return api.get(`bills/${id}`);
};
export const GetBill_AccountAPI = (query) => {
  return api.get(`bills/account?${query}`);
};

export const AddBill = async (data) => {
  return api.post(`bills`, data);
};
export const ChangeStatus = async (id, status) => {
  return api.patch(`bills/update-status/${id}`, status);
};

export const VnpayPaymentAPI = async (amount) => {
  return await api.get(`payment/vnpay/create_payment_url?amount=${amount}`);
};

export const VnpayReturnAPI = async (data) => {
  return await api.get(`payment`, data);
};
