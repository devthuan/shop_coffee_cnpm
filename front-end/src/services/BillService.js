

import api from "./api";

export const AddBill = async (data) => {
    return await api.post(`bills`, data)
}