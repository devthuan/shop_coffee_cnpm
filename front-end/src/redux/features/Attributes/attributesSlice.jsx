import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    total : 0,
    totalPage : 0,
    currentPage : 0,
    limit : 0,
    data : [],
    isLoading : true
}
export const attributesSlice = createSlice({
    name : "attributes",
    initialState,
    reducers : {
        initDataAttribute : (state, action) => {
            state.total = action.payload?.total
            state.totalPage = action.payload?.totalPage
            state.currentPage = action.payload?.currentPage
            state.limit = action.payload?.limit
            state.data = action.payload?.data
            state.isLoading = false
        },

        deleteAttribute : (state, action) => {
            const id = action.payload.id 
            const isExistAttribute = state.data.find(attribute => attribute.id === id)
            if(isExistAttribute)
            {
                state.data = state.data.filter(attribute => attribute.id !== id)
            }
        },

        addAttribute : (state, action) => {
            state.data.push(action.payload)
            state.isLoading = false
        },

        updateAttribute : (state, action) => {
            const id = action.payload.id 
            const attributeIndex = state.data.findIndex(attribute => attribute.id === id)
            if(attributeIndex !== -1)
            {
                state.data[attributeIndex] = {
                    ...state.data[attributeIndex],
                    name : action.payload.name,
                    description : action.payload.description
                }
            }
        }
    }
})

export const {initDataAttribute, deleteAttribute, addAttribute, updateAttribute} = attributesSlice.actions
export default attributesSlice.reducer