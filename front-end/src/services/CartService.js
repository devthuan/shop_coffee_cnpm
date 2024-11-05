

import api from "./api";

// code demo
export const GetCartOfUser = async () => {
    return await api.get(`cart`)
};

export const AddToCart = async (data) => {
    return await api.post(`cart`, data)
}

export const IncreaseQuantityCart = async (id) => {
    return await api.patch(`cart/increase/${id}`)
};


export const DecreaseQuantityCart = async (id) => {
    return await api.patch(`cart/decrease/${id}`)
};

export const DeleteCart = async (id) => {
    return await api.delete(`cart/${id}`)
};


