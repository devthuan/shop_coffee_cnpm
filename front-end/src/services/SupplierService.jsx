import api from "./api";

export const GetAllSupplierAPI = async (queryParams) => {
  return await api.get(`supplier?${queryParams}`);
};
export const GetAllSupplierDeletedAPI = async (queryParams) => {
  return await api.get(`supplier/deleted${queryParams}`);
};

export const GetDetailSupplierAPI = async (id) => {
  return await api.get(`supplier/${id}`);
};

export const CreateSupplierAPI = async (data) => {
  return await api.post(`supplier`, data);
};
export const DeleteSupplierAPI = async (id) => {
  return await api.delete(`supplier/${id}`);
};
export const UpdateSupplierAPI = async (id, data) => {
  return await api.patch(`supplier/${id}`, data);
};
