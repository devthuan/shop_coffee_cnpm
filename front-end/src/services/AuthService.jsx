import api from "./api";

// code demo
export const RegisAPI = (email, password, confirmPassword,setAsDefaultCard) => {
  return api.post(`auth/register`, { username: email, password: password , confirmPassword:confirmPassword,setAsDefaultCard:setAsDefaultCard});

};
export const LogOut = async () => {
  try {
    const response = await api.post('auth/logout');
    if (response.status === 200) {
      console.log('Logged out successfully');
    } else {
      console.log('Failed to log out');
    }
  } catch (error) {
    console.error('Error during logout:', error);
  }
};
