import api from "./api";

export const GetAllSupplierAPI = async (queryParams) => {
  return await api.get(`supplier/${queryParams}`);
};

export const GetDetailSupplierAPI = async (id) => {
  return await api.get(`supplier/${id}`);
};
