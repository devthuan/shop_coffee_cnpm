

import api from "./api";

// code demo
export const DetailProduct = async () => {
  // return await api.get(`products/detail/895a4090-8eee-4e11-888c-42e3a9f3323a`)
  return await api.get(`products/detail/2fa2d5ec-b092-4cd4-ba34-8bc82ae9273e`)

};


export const EvaluateProduct = async () => {
  return await api.get(`reviews/by-product/2fa2d5ec-b092-4cd4-ba34-8bc82ae9273e`)
}

export const DiscountProduct = async () => {
  return await api.get(`discount`)
}