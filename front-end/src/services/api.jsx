import axios from "axios";
import { getItemWithExpiration } from "./LocalStorage";

const api = axios.create({
  baseURL: "http://103.211.207.149:8080/api/v1",
  timeout: 5000, // Đặt timeout tùy ý
});

api.interceptors.request.use(
  async (config) => {
    // lấy token strong localStorage
    const tokenAndPermision = await getItemWithExpiration("token"); // Truy cập token từ Redux store
    // const token = tokenAndPermision[0];
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YmE0MjVjLTczZDctNDFkZi05MmVhLWE1N2VkNmJjYTc4ZCIsInVzZXJuYW1lIjoidGQiLCJlbWFpbCI6InRwdGFta2llbUBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MzAzMDg2NTMsImV4cCI6MTc2NzMwNzY0M30.A8e8bt--FklmicD4M1Q7FT1qNu7jeOVkS__MeEjORas';
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
