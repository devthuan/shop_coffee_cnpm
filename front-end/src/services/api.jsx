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
    // const token = tokenAndPermision[0];
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQyYmEyYjhiLWJiNzgtNGQyZC1iNzA0LTUxM2RlYjIxYzBmNiIsInVzZXJuYW1lIjoibXQiLCJlbWFpbCI6Im1pbmh0cnVjMjUwMTIwMDRAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzI5NjY5NDI0LCJleHAiOjE3NjY2Njg0MTR9.cMH5mZrpZ2LBtge9ISZzshCPU9ophmu4UwhN5m-yOZc";
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
