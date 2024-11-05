import api from "./api";

// Lấy tất cả các voucher
export const GetAllVoucher = async () => {
  return await api.get(`vouchers`);
};


// Lấy một voucher theo ID
export const GetVoucherById = async (id) => {
  return await api.get(`vouchers/${id}`);
};

// Thêm một voucher mới
export const CreateVoucher  = async (data) => {
  return await api.post(`vouchers`, data);
};

// Cập nhật một voucher theo ID
export const UpdateVoucher  = async (id, data) => {
  return await api.patch(`vouchers/${id}`, data);
}; 

// Sử dụng một voucher theo ID
export const UseVoucher  = async (id) => {
  return await api.patch(`vouchers/use-voucher/${id}`);
};

// Khôi phục một voucher theo ID
export const RecoverVoucher  = async (id) => {
  return await api.patch(`vouchers/recover/${id}`);
};

// Xóa một voucher theo ID
export const DeleteVoucher  = async (id) => {
  return await api.delete(`vouchers/${id}`);
};
