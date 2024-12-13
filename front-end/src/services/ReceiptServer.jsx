import api from "./api";

export const GetAllReceiptAPI = async (queryParams) => {
  return await api.get(`import-receipt?${queryParams}`);
};

export const GetDetailReceiptAPI = async (id) => {
  return await api.get(`import-receipt/detail/${id}`);
};
export const ChangeStatusReceiptAPI = async (id, status) => {
  return await api.patch(`import-receipt/status/${id}`, { status: status });
};

export const CreateReceiptAPI = async (data) => {
  console.log(data)
  return await api.post(`import-receipt`, data);
};
