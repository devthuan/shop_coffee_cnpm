import api from "./api";

export const GetAllBillAPI = (query) => {
  return api.get(`bills?${query}`);
};

