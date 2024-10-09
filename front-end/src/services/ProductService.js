

import api from "./api";

// code demo
export const DetailProduct = async() => {
  try 
  {
    const response = await api.get(`products/detail/f87101a1-d5ee-4be3-80fc-a2ce8c756e4a`)
    return response.data
  }
  catch(error)
  {
    console.error("Error when get data of detail product : ", error);
  }
};


export const EvaluateProduct = async() => {
  try 
  {
    const response = await api.get(`reviews/by-product/f87101a1-d5ee-4be3-80fc-a2ce8c756e4a`)
    return response.data;
  }
  catch(error)
  {
    console.log("Error when get data of evaluate product : ", error)
  }
}