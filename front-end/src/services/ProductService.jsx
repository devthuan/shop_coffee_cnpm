import api from "./api";

// code demo
export const DetailProduct = async(id) => {
  try 
  {
    const response = await api.get(`products/detail/${id}`)
    return response.data
  }
  catch(error)
  {
    console.error("Error when get data of detail product : ", error);
  }
};

export const ProductID = async() => {
  try 
  {
    const response = await api.get(`products?limit=19`)
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
    const response = await api.get(`reviews/by-product/d45da10e-1e3a-4a6c-8923-0840e1003774`)
    return response.data;
  }
  catch(error)
  {
    console.log("Error when get data of evaluate product : ", error)
  }
}