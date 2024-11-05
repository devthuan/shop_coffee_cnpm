import axios from "axios";
import { getItemWithExpiration } from "./localStorage";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  timeout: 5000, // Đặt timeout tùy ý
});

api.interceptors.request.use(
  async (config) => {
    // lấy token strong localStorage

    const token = getItemWithExpiration("token"); // Truy cập token từ Redux store
    // const token =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZkN2IyMDI0LTQ0YTMtNDQ2MS1iMTk3LTIxMmExMzE2NGQ1NyIsInVzZXJuYW1lIjoib3ZhbnNoaWkiLCJlbWFpbCI6ImxtYWprYWhAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzI5NjY2NDQzLCJleHAiOjE3NjY2NjU0MzN9.BwX6d5MCbNr7hc7ozWkleB1dhFGE5ZTNKra4cO-LkqY";
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
