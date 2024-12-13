import api from "./api";

export const RegisAPI = (email, username, password, confirmPassword) => {
  return api.post(`auth/register`, {
    email: email,
    username: username,
    password: password,
    confirmPassword: confirmPassword,
  });
};

export const LoginAPI = (email, password) => {
  let ip = "0.0.0.0";

  return api.post(`auth/login`, { email: email, password: password, ip: ip });
};

export const LoginWithGoogleAPI = () => {
  return api.get(`auth/google`);
};
export const LoginWithGoogleCallBackAPI = () => {
  return api.get(`auth/google/callback`);
};

export const SendOTPAPI = (email) => {
  return api.post(`auth/send-otp`, { email });
};
export const VerifyOTPAPI = (email, otp) => {
  return api.post("auth/verify-otp", { email: email, otp: otp });
};

export const LogOut = async () => {
  try {
    const response = await api.post("auth/logout");
    if (response.status === 200) {
      console.log("Logged out successfully");
    } else {
      console.log("Failed to log out");
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
export const GoogleAPI = async () => {
  return api.post(`auth/goole`, {});
};

export const RecoverPass = async (email) => {
  return await api.post("auth/forgot-password", { email });
};


export const ChangePasswordAPI = async (data) => {
  return await api.post("auth/change-password", data );
};
