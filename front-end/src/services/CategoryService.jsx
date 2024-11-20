
import api from "./api";

export const GetAllCategory = async (query) => {
    return await api.get(`categories?${query}`)
};

export const AddCategory = async(data) => {
    return await api.post(`categories`, data)
}

export const UpdateCategory = async(id, data) => {
    return await api.patch(`categories/${id}`, data)
}

export const DeleteCategory = async(id) => {
    return await api.delete(`categories/${id}`)
}