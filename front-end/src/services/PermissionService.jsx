import api from "./api";

export const GetAllRole = (query) => {
  return api.get(`role-permission/roles?${query}`);
};

export const GetAllPermissionByRoleAPI = (role) => {
  return api.get(`role-permission/by-role/${role}`);
};

export const ChangeStatusPermissionAPI = (id) => {
  return api.patch(`role-permission/change-status/${id}`);
};
