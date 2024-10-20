import api from "./api";



export const GetAllRole = () => {
  return api.get(`role-permission/roles`);
};
