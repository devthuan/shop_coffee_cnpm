import api from "./api";

export const GetAllAttribute = async (query) => {
  return await api.get(`attribute?${query}`);
};

export const DeleteAttribute = async (id) => {
  return await api.delete(`attribute/${id}`);
};

export const AddAttribute = async (data) => {
  return await api.post(`attribute`, data);
};

export const UpdateAttribute = async (id, data) => {
  return await api.patch(`attribute/${id}`, data);
};
