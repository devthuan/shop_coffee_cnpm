import api from "./api";

export const GetAllDiscount = async(query) => {
    return await api.get(`discount?${query}`)
}

export const AddDiscount = async(data) => {
    return await api.post(`discount`, data)
}

export const DeleteDiscount = async(id) => {
    return await api.delete(`discount/${id}`)
}

export const UpdateDiscount = async(id, data) => {
    return await api.patch(`discount/${id}`, data)
}