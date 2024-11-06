import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    total : 0,
    totalPage : 0,
    currentPage : 0,
    limit : 0,
    data : [],
    isLoading : true
}

export const categoriesSlice = createSlice({
    name : "categories",
    initialState,
    reducers : {
        initDataCategory : (state, action) => {
            state.total = action.payload?.total
            state.totalPage = action.payload?.totalPage
            state.currentPage = action.payload?.currentPage
            state.limit = action.payload?.limit
            state.data = action.payload?.data
            state.isLoading = false
        },

        addCategory : (state, action) => {
            state.data.push(action.payload)
        }, 

        updateCategory : (state, action) => {
            const id = action.payload.id
            const categoryIndex = state.data.findIndex(category => category.id === id)
            if(categoryIndex != -1)
            {
                state.data[categoryIndex] = {
                    ...state.data[categoryIndex],
                    name : action.payload.name,
                    description : action.payload.description
                }
            }
        }, 

        deleteCategory : (state, action) => {
            const id = action.payload.id
            const isExistCategory = state.data.find(category => category.id === id)
            if(isExistCategory)
            {
                state.data = state.data.filter(category => category.id != id)
            }
        }
    }
})

export const { initDataCategory, addCategory, updateCategory, deleteCategory } = categoriesSlice.actions
export default categoriesSlice.reducer