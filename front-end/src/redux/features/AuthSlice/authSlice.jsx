import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: null,
  token: null,
  data: [],
  permission: [],
  isLogin: false,
  loading: true,
  error: null,
};
// export const registerUser = createAsyncThunk(
//     "auth/register",
//     async ({ email, username, password, confirmPassword }, { rejectWithValue }) => {
//         try {
//             const response = await RegisAPI(email, username, password, confirmPassword);
//             return response.data; // Hoặc trả về dữ liệu cần thiết
//         } catch (error) {
//             return rejectWithValue(error.response.data); // Trả về thông báo lỗi
//         }
//     }
// );

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initDataPermission: (state, action) => {
      state.permission = action.payload;
    },
    setLogin(state, action) {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.isLogin = true;
      state.loading = false;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearAuth(state) {
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
  // extraReducers: (builder) => {
  //     builder
  //         .addCase(registerUser.pending, (state) => {
  //             state.loading = true; // Bắt đầu quá trình đăng ký
  //             state.error = null; // Xóa lỗi nếu có
  //         })
  //         .addCase(registerUser.fulfilled, (state, action) => {
  //             state.loading = false; // Hoàn tất quá trình
  //             state.token = action.payload.token; // Lưu token vào state
  //         })
  //         .addCase(registerUser.rejected, (state, action) => {
  //             state.loading = false; // Kết thúc quá trình
  //             state.error = action.payload; // Lưu thông báo lỗi
  //         });
  // },
});

export const {
  initDataPermission,
  setLoading,
  setToken,
  setError,
  clearAuth,
  setLogin,
} = authSlice.actions;
export default authSlice.reducer;
