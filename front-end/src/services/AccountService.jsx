import api from "./api";

export const CreateAccountAPI = ({
  email,
  username,
  password,
  confirmPassword,
  role,
}) => {
  return api.post(`account`, {
    email,
    username,
    password,
    confirmPassword,
    role,
  });
};

export const GetAllAccountAPI = (query) => {
  return api.get(`account?${query}`);
};

export const LockAccountAPI = (id) => {
  return api.patch(`account/lock/${id}`);
};

export const UpdateAccountAPI = (id, { userName, role }) => {
  return api.patch(`account/${id}`, { userName: userName, role: role });
};
export const ResetPasswordAPI = (id) => {
  return api.patch(`account/reset-password/${id}`);
};
