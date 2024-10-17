

import api from "./api";

// code demo
export const GetCartOfUser = async () => {
    try {
        const response = await api.get(`cart`, {
            headers: {
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YmE0MjVjLTczZDctNDFkZi05MmVhLWE1N2VkNmJjYTc4ZCIsInVzZXJuYW1lIjoidGQiLCJlbWFpbCI6InRwdGFta2llbUBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MjkxNTM1OTUsImV4cCI6MTc2NjE1MjU4NX0.vii41SzTMRYN2J0HRZYDclz6oPUZKZzQL-xvzfhT5ic`,
            }
        })
        return response.data
    }
    catch (error) {
        console.error("Error when get data cart : ", error);
    }
};

export const IncreaseQuantityCart = async (id) => {
    try {
        const response = await api.patch(`cart/increase/${id}`, {}, {
            headers: {
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YmE0MjVjLTczZDctNDFkZi05MmVhLWE1N2VkNmJjYTc4ZCIsInVzZXJuYW1lIjoidGQiLCJlbWFpbCI6InRwdGFta2llbUBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MjkxNTM1OTUsImV4cCI6MTc2NjE1MjU4NX0.vii41SzTMRYN2J0HRZYDclz6oPUZKZzQL-xvzfhT5ic`,
            }
        })
        return response.data
    }
    catch (error) {
        console.error("Error when increase quanity cart : ", error);
    }
};


export const DecreaseQuantityCart = async (id) => {
    try {
        const response = await api.patch(`cart/decrease/${id}`, {}, {
            headers: {
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YmE0MjVjLTczZDctNDFkZi05MmVhLWE1N2VkNmJjYTc4ZCIsInVzZXJuYW1lIjoidGQiLCJlbWFpbCI6InRwdGFta2llbUBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MjkxNTM1OTUsImV4cCI6MTc2NjE1MjU4NX0.vii41SzTMRYN2J0HRZYDclz6oPUZKZzQL-xvzfhT5ic`,
            }
        })
        return response.data
    }
    catch (error) {
        console.error("Error when decrease quanity cart : ", error);
    }
};

export const DeleteCart = async (id) => {
    try {
        const response = await api.delete(`cart/${id}`, {
            headers: {
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YmE0MjVjLTczZDctNDFkZi05MmVhLWE1N2VkNmJjYTc4ZCIsInVzZXJuYW1lIjoidGQiLCJlbWFpbCI6InRwdGFta2llbUBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MjkxNTM1OTUsImV4cCI6MTc2NjE1MjU4NX0.vii41SzTMRYN2J0HRZYDclz6oPUZKZzQL-xvzfhT5ic`,
            }
        })
        return response.data
    }
    catch (error) {
        console.error("Error when delete cart : ", error);
    }
};


