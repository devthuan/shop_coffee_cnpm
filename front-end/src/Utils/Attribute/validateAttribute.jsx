import { toast } from "react-toastify";
export const validateAttribute = (data) => {
    const specialNameRegex = /[^a-zA-Z0-9\s\u00C0-\u1EF9.,-]/;

    if (data.name === "") {
        toast.error("Tên thuộc tính không được để trống")
        return false;
    }

    if (specialNameRegex.test(data.name) && data.name != "") {
        toast.error("Tên thuộc tính không được chứa kí tự đặc biệt")
        return false;
    }
    if (data.name != "" && data.name.length < 4) {
        toast.error("Tên thuộc tính chứa tối thiểu 4 ký tự trở lên")
        return false;
    }
    if (data.name != "" && data.name.length > 255) {
        toast.error("Tên thuộc tính chứa tối đa 255 ký tự")
        return false;
    }
    if (data.description === "") {
        toast.error("Mô tả không được để trống")
        return false;
    }
    if (specialNameRegex.test(data.description) && data.description != "") {
        toast.error("Mô tả thuộc tính không được chứa kí tự đặc biệt")
        return false;
    }
    if (data.description != "" && data.description.length < 10) {
        toast.error("Mô tả thuộc tính chứa tối thiểu 10 ký tự trở lên")
        return false;
    }
    if (data.description != "" && data.description.length > 255) {
        toast.error("Mô tả thuộc tính chứa tối đa 255 ký tự")
        return false;
    }

    return true;
}