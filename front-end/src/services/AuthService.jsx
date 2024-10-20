import api from "./api";

// code demo
export const LoginAPI = (username, password) => {
  return api.get(`auth`, { username: username, password: password });
};
