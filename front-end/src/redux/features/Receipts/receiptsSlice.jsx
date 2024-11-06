import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    total : "",
    totalPage : "",
    currentPage : "",
    limit : "",
    data : []
}

export const receiptsSlice = createSlice({
    name : "receipts",
    initialState,
    reducers : {
        initDataReceipt : (state, action) => {
            state.total = action.payload?.total 
            state.totalPage = action.payload?.totalPage
            state.currentPage = action.payload?.currentPage
            state.limit = action.payload?.limit
            state.data = action.payload?.data
        }
    }
})

export const {initDataReceipt} = receiptsSlice.actions 
export default receiptsSlice.reducer