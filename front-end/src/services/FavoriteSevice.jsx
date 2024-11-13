import api from "./api";

// code demo
export const getFavoriteUser = (query) => {
  return api.get(`favorite/user?${query}`);
};

export const AddFavoriteUser = (productId) => {
  return api.post(`favorite`, productId);
};

export const DelFavoriteUser = (idFavorite) => {
  return api.delete(`favorite/${idFavorite}`);
};
