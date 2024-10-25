import axios from "axios";
import { getItemWithExpiration } from "./localStorage";

const api = axios.create({
  baseURL: "http://103.211.207.149:8080/api/v1",
  timeout: 5000, // Đặt timeout tùy ý
});

api.interceptors.request.use(
  async (config) => {
    // lấy token strong localStorage
    const tokenAndPermision = await getItemWithExpiration("token"); // Truy cập token từ Redux store
    const token = tokenAndPermision[0];
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
