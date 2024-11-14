import api from "./api";

// code demo
export const GetAllPaynment = async() => {
  return await api.get(`payment`)
};


export const VnPay = async() => {
  return await api.get(`payment/vnpay/create_payment_url`)
}