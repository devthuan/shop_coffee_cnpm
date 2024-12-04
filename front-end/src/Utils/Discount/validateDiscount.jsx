import { toast } from "react-toastify";
export const validateDiscount= (data) => {
    const specialNameRegex = /[^a-zA-Z0-9\s\u00C0-\u1EF9.,-]/;
    const specialCodeRegex = /[^a-zA-Z0-9\s\.,-]/;

    if (data.name === "") {
        toast.error("Tên chương trình giảm giá không được để trống")
        return false;
    }

    if (specialNameRegex.test(data.name) && data.name != "") {
        toast.error("Tên chương trình giảm giá không được chứa kí tự đặc biệt")
        return false;
    }
    if (data.name != "" && data.name.length < 4) {
        toast.error("Tên chương trình giảm giá chứa tối thiểu 4 ký tự trở lên")
        return false;
    }
    if (data.name != "" && data.name.length > 255) {
        toast.error("Tên chương trình giảm giá chứa tối đa 255 ký tự")
        return false;
    }
    if (data.code === "") {
        toast.error("Mã giảm giá không được để trống")
        return false;
    }
    if (specialCodeRegex.test(data.code) && data.code != "") {
        toast.error("Mã giảm giá không được chứa kí tự đặc biệt")
        return false;
    }
    if (data.code != "" && data.code.length < 4) {
        toast.error("Mã giảm giá chứa tối thiểu 4 ký tự trở lên")
        return false;
    }
    if (data.code != "" && data.code.length > 255) {
        toast.error("Mã giảm giá chương trình giảm giá chứa tối đa 50 ký tự")
        return false;
    }
    if (data.quantity == "") {
        toast.error("Số lượng không được để trống")
        return false;
    }
    if (!Number(data.quantity)) {
        toast.error("Số lượng phải là một số nguyên")
        return false;
    }
    if (data.quantity == 0) {
        toast.error("Số lượng phải lớn hơn 0")
        return false;
    }

    if (data.value == "") {
        toast.error("Giá giảm không được để trống")
        return false;
    }
    if (!Number(data.value)) {
        toast.error("Giá giảm phải là một số")
        return false;
    }
    if (data.value == 0) {
        toast.error("Giá giảm phải lớn hơn 0")
        return false;
    }

    if (data.startDate == "") {
        toast.error("Vui lòng nhập ngày bắt đầu")
        return false;
    }
    if (data.endDate == "") {
        toast.error("Vui lòng nhập ngày kết thúc")
        return false;
    }

    if(data.product == "")
    {
        toast.error("Vui lòng nhập sản phẩm")
        return false;
    }
    return true;
}