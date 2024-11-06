

import api from "./api";

// code demo
export const DetailProduct = async () => {
  // return await api.get(`products/detail/895a4090-8eee-4e11-888c-42e3a9f3323a`)
  return await api.get(`products/detail/7edd9611-5cd5-4d82-9500-0be792247019`)

};


export const EvaluateProduct = async () => {
  return await api.get(`reviews/by-product/7edd9611-5cd5-4d82-9500-0be792247019`)
}

export const DiscountProduct = async () => {
  return await api.get(`discount`)
}

export const GetAllProduct = async (query) => {
  // const params = new URLSearchParams();
  // if (page != null) {
  //   params.append('page', page)
  // }
  // if (limit != null) {
  //   params.append('limit', limit)
  // }
  // if (search != null) {
  //   params.append('search', search)
  // }
  return await api.get(`products?${query}`)
}

export const AddProduct = async (data) => {
  return await api.post(`products`, data)
}

export const DetailProduct123 = async (id) => {
  return await api.get(`products/detail/${id}`)
}

export const UpdateProduct = async (id, data) => {
  return await api.patch(`products/${id}`, data)
}

export const DeleteProduct = async (id) => {
  return await api.delete(`products/${id}`)
}









