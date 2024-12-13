import api from "./api";

export const GetAllPaynment = async () => {
  return await api.get(`payment`);
};

export const CreatePaymentMethodAPI = async (data) => {
  return await api.post(`payment`, data);
};

export const UpdatePaymentMethodAPI = async (id, data) => {
  return await api.patch(`payment/${id}`, data);
};

export const DeletePaymentMethodAPI = async (id) => {
  return await api.delete(`payment/${id}`);
};

export const VnPay = async () => {
  return await api.get(`payment/vnpay/create_payment_url`);
};
