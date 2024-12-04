import api from "./api";
import { getItemWithExpiration } from "~/services/localStorage";

// code demo
export const getFavoriteUser = (query) => {
  const isLogin = getItemWithExpiration("token") || null;
  console.log(isLogin);
  if (isLogin) {
    return api.get(`favorite/user?${query}`);
  }
};

export const AddFavoriteUser = (productId) => {
  return api.post(`favorite`, productId);
};

export const DelFavoriteUser = (idFavorite) => {
  return api.delete(`favorite/${idFavorite}`);
};
