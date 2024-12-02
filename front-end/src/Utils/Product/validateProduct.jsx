import { toast } from "react-toastify";
export const validateProduct = (data, isImage=false) => {
    const specialNameRegex = /[^a-zA-Z0-9\s\u00C0-\u1EF9.,-]/;

    if(data.name === "")
    {
        toast.error("Tên sản phẩm không được để trống")
        return false;
    }
    if (data.name != "" && data.name.length < 5 ) {
        toast.error("Tên sản phẩm tối thiểu 5 kí tự")
        return false;
    }
    if(data.name != "" && data.name.length > 255 )
    {
        toast.error("Tên sản phẩm tối đa 255 kí tự")
        return false;
    }
    if(specialNameRegex.test(data.name))
    {
        toast.error("Tên sản phẩm không được chứa kí tự đặc biệt")
        return false;
    }
    if(data.categoryId === "")
    {
        toast.error("Vui lòng chọn thể loại sản phẩm");
        return false;
    }
    if(data.attributes.length == 0)
    {
        toast.error("Vui lòng chọn thuộc tính sản phẩm")
        return false;
    }
    if(isImage != false)
    {
        if (data.images.length === 0) {
            toast.error("Vui lòng chọn ảnh");
            return false
        }
    }
    if (data.description === "") {
        toast.error("Vui lòng nhập mô tả sản phẩm")
        return false
    }
    if(data.description && data.description.length < 5 && data.description != "")
    {
        toast.error("Mô tả sản phẩm phải chứa tối thiểu 5 kí tự")
        return false;
    }
    if(specialNameRegex.test(data.description))
    {
        toast.error("Mô tả sản phẩm không được chứa kí tự đặc biệt")
        return false;
    }
    if(data.description.length > 255 && data.description != "")
    {
        toast.error("Mô tả sản phẩm tối đa 255 kí tự")
        return false;
    }

    return true
}