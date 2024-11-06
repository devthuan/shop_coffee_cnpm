import api from "./api";

export const GetAllNotificationAPI = (query) => {
  return api.get(`notification?${query}`);
};

export const GetAllNotificationByUserAPI = (query) => {
  return api.get(`notification/user?${query}`);
};

export const CreateNotificationAPI = (data) => {
  const { typeSend, roleId, email, title, content } = data;
  if (typeSend === "role") {
    return api.post(`notification`, { typeSend, roleId, title, content });
  } else if (typeSend === "user") {
    return api.post(`notification`, { typeSend, email, title, content });
  } else {
    return api.post(`notification`, { typeSend, title, content });
  }
};

export const ReadNotificationAPI = (id) => {
  return api.patch(`notification/read/${id}`);
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
