import api from "./api";

// code demo
export const getALLProducts = (query) => {
  return api.get(`products?${query}`);
};

// code demo
export const DetailProduct = async (id) => {
  // return await api.get(`products/detail/895a4090-8eee-4e11-888c-42e3a9f3323a`)
  return await api.get(`products/detail/${id}`);
};

export const EvaluateProduct = async (id) => {
  return await api.get(
    `reviews/by-product/${id}`
  );
};

export const DiscountProduct = async () => {
  return await api.get(`discount`);
};
