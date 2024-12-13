import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: "",
    createdAt: "",
    updatedAt: "",
    userName: "",
    email: "",
    balance: 0,
    ip: "",
    device: "",
    typeLogin: "",
    isActive: "",
    lastLogin: "",
    userInformation: {},
    loading: true,
    error: null,
};

export const userInfoSlice = createSlice({
    name: 'user_info',
    initialState,
    reducers: {
        initDataUserInfo: (state, action) => {
            state.id = action.payload?.id;
            state.createdAt = action.payload?.createdAt;
            state.updatedAt = action.payload?.updatedAt;
            state.userName = action.payload?.userName;
            state.email = action.payload?.email;
            state.balance = action.payload?.balance;
            state.ip = action.payload?.ip;
            state.device = action.payload?.device;
            state.typeLogin = action.payload?.typeLogin;
            state.isActive = action.payload?.isActive;
            state.lastLogin = action.payload?.lastLogin;
            state.userInformation = action.payload?.userInformation;
            state.loading = false;
            state.error = action.payload?.error;
        },
        clearDataUserInfo: (state, action) => {
            state.id ="";
            state.createdAt ="";
            state.updatedAt ="";
            state.userName ="";
            state.email ="";
            state.balance =0;
            state.ip ="";
            state.device ="";
            state.typeLogin ="";
            state.isActive ="";
            state.lastLogin ="";
            state.userInformation = null;
            state.loading =true;
            state.error =null;
        },
        updateUserInfo: (state, action) => {
            const { fullName, phoneNumber, address1, avatar } = action.payload;
            state.userInformation = {
                ...state.userInformation, // Giữ lại các thuộc tính không thay đổi
                fullName: fullName ?? state.userInformation.fullName,
                phoneNumber: phoneNumber ?? state.userInformation.phoneNumber,
                address1: address1 ?? state.userInformation.address1,
                avatar: avatar ?? state.userInformation.avatar
            };
        }
        
    },
});

// Export các action
export const { initDataUserInfo, clearDataUserInfo, updateUserInfo } = userInfoSlice.actions;

export default userInfoSlice.reducer;
