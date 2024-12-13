import api from "./api";

export const GetAllReview = async (queryParams) => {
    return await api.get(`reviews?${queryParams}`);
};

export const EvaluateProduct = async (id) => {
    return await api.get(
      `reviews/by-product/${id}`
    );
  };

export const DeleteReview = async (id) => {
    return await api.delete(`reviews/${id}`);
};

export const AddReview = async (data) => {
    return await api.post(`reviews`, data)
}

export const UpdateReview = async (id, data) => {
    return await api.patch(`reviews/${id}`, data)
}

export const ReplyReview = async(data) => {
    return await api.post(`reviews/reply`, data)
}