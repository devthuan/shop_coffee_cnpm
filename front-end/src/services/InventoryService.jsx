import api from "./api";

export const GetAllInventory = (queryParams) => {
  return api.get(`inventory?${queryParams}`);
};
