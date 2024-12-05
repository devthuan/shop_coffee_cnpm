import api from "./api";
import { getItemWithExpiration } from "~/services/localStorage";

// code demo
export const GetCartOfUser = async () => {
  const isLogin = getItemWithExpiration("token") || null;
  console.log(isLogin);
  if (isLogin) {
    return await api.get(`cart`);
  }
};

export const AddToCartAPI = async (data) => {
  return await api.post(`cart`, data);
};

export const IncreaseQuantityCart = async (id) => {
  return await api.patch(`cart/increase/${id}`);
};

export const DecreaseQuantityCart = async (id) => {
  return await api.patch(`cart/decrease/${id}`);
};

export const DeleteCart = async (id) => {
  return await api.delete(`cart/${id}`);
};
