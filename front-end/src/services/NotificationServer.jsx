import api from "./api";

export const GetAllNotificationAPI = (query) => {
  return api.get(`notification?${query}`);
};

export const GetAllNotificationByUserAPI = (query) => {
  return api.get(`notification?${query}`);
};

export const CreateNotificationAPI = ({ typeSend, title, content }) => {
  return api.post(`notification`, { typeSend, title, content });
};

export const ReadNotificationAPI = (id) => {
  return api.patch(`notification/${id}`);
};

export const UpdateNotificationAPI = (id, { title, content }) => {
  return api.patch(`notification/${id}`, { title, content });
};

export const DeleteNotificationAPI = (id) => {
  return api.delete(`notification/${id}`);
};

export const DeleteNotificationUerAPI = (id) => {
  return api.delete(`notification/user/${id}`);
};
