import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    total : 0,
    currentPage : 0,
    totalPage : 0,
    limit : 0,
    data : [],
    isLoading : true,
    error : null
}

export const ReviewsSlice = createSlice({
    name : "reviews",
    initialState,
    reducers : {
        initDataReview : (state, action) => {
            state.total = action.payload.total
            state.currentPage = action.payload.currentPage
            state.totalPage = action.payload.totalPage
            state.limit = action.payload.limit
            state.data = action.payload.data
            state.isLoading = action.payload.isLoading
            state.error = action.payload.error
        }, 

        addReview : (state, action) => {
            state.data.push(action.payload)
        }, 

        updateReview : (state, action) => {
            const id = action.payload.id 
            const reivewIndex = state.data.findIndex(review => review.id === id)
            if(reivewIndex !== -1)
            {
                state.data[reivewIndex] = {
                    ...state.data[reivewIndex],
                    rating : action.payload.rating,
                    comment : action.payload.comment
                }
            }
        }, 

        deleteReview : (state, action) => {
            const id = action.payload.id 
            const isExistReview = state.data.find(review => review.id === id)
            if(isExistReview)
            {
                state.data = state.data.filter(review => review.id !== id)
            }
        }
    }
})

export const {initDataReview, addReview, updateReview, deleteReview} = ReviewsSlice.actions
export default ReviewsSlice.reducer