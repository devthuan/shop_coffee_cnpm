import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: "",
    payments: {},
    vouchers: null,
    account: {},
    status: "",
    billDetails: [],
    fullName: "",
    shippingMethod: "",
    deliverAddress: "",
    deliverPhone: "",
    note: "",
    loading: true,
    error: null
};

export const IdBillDetailSlice = createSlice({
    name: 'idBillDetails',
    initialState,
    reducers: {
        initDataIdBillDetail: (state, action) => {
            state.id = action.payload?.id;
            state.payments = action.payload?.payments;
            state.vouchers = action.payload?.vouchers;
            state.billDetails = action.payload?.billDetails;
            state.account = action.payload?.account;
            state.status = action.payload?.status;
            state.fullName = action.payload?.fullName;
            state.shippingMethod = action.payload?.shippingMethod;
            state.deliverPhone = action.payload?.deliverPhone;
            state.deliverAddress = action.payload?.deliverAddress;
            state.note = action.payload?.note;
            state.loading = false;
            state.error = action.payload?.error;
        },
        clearDataIdBillDetail: (state) => {
            state.id = "";
            state.payments = {};
            state.vouchers = null;
            state.account = {};
            state.fullName = "";
            state.billDetails = [];
            state.status = "";
            state.shippingMethod = "";
            state.deliverAddress = "";
            state.deliverPhone = "";
            state.note = "";
            state.loading = true;
            state.error = null;
        },
    },
});

// Export các action
export const { initDataIdBillDetail, clearDataIdBillDetail } = IdBillDetailSlice.actions;

export default IdBillDetailSlice.reducer;
