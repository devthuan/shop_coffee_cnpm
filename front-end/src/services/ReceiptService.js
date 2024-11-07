import api from "./api"

export const GetAllReceipt = async(query) => {
    return await api.get(`import-receipt?${query}`)
}