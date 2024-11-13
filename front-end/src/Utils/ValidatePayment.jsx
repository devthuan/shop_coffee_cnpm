// src/utils/validatePayment.js
import { toast } from "react-toastify";

export const validatePaymentData = (data) => {
  if (!data.fullName) {
    toast.error("Vui lòng nhập họ tên");
    return false;
  }
  if (!data.deliverAddress) {
    toast.error("Vui lòng nhập địa chỉ giao hàng");
    return false;
  }
  if (!data.deliverPhone) {
    toast.error("Vui lòng nhập số điện thoại");
    return false;
  }
  if (!data.shippingMethod) {
    toast.error("Vui lòng chọn phương thức vận chuyển");
    return false;
  }
  if (!data.paymentMethod) {
    toast.error("Vui lòng chọn phương thức thanh toán");
    return false;
  }

  // Nếu tất cả điều kiện đều hợp lệ, trả về true
  return true;
};
