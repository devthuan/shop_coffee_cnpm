import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import React from "react";
import { toast } from "react-toastify";
import { UpdateVoucher } from "~/services/VoucherService";
import { useDispatch } from "react-redux";
import { updateVoucher } from "~/redux/features/Vouchers/voucherSlice";
import { HandleApiError } from "~/Utils/HandleApiError";
import {  useSelector } from "react-redux";
import {
    GetVoucherById
} from "~/services/VoucherService";
const ModelEditVoucher = ({ data }) => {
    const reduxIsActive = useSelector((state) => state.vouchers.isActive);
   console.log(reduxIsActive)
    // Initialize local state with the Redux value
    const [isActive, setIsActive] = useState(reduxIsActive);  
      const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        value: "",
        quantity: "",
        description: "",
        startDate: "",
        endDate: "",
        updatedAt: "",
        deletedAt: "",
        id: "",
        createdAt: "",
        status: "",
    });
   
    const fetchVoucherData = async (id) => {
        try {
            const response = await GetVoucherById(id);
            if (response && response.status === 200) {
                setFormData(response.data);
            } else {
                toast.error("Không thể lấy dữ liệu mới nhất cho voucher.");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi tải dữ liệu voucher.");
        }
    };
    // Lấy dữ liệu mới mỗi lần hộp thoại được mở
    const handleDialogOpenChange = (open) => {
        if (open) fetchVoucherData(data.id); // Lấy dữ liệu khi mở hộp thoại
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }
    const handleSubmitUpdate = async () => {
        if (
            formData.value === "" ||
            formData.quantity === "" ||
            isNaN(parseInt(formData.value)) ||
            isNaN(parseInt(formData.quantity))
        ) {
            toast.error("Giá trị của quantity và value phải là số hợp lệ và không được để trống.");
            return;
        }
        try {
            console.log('Submitting update with data:', formData);
            // const findId = dataId.find((id) => id.id === formData.id);
            const response = await UpdateVoucher(formData.id, {
                value: parseInt(formData.value),
                quantity: parseInt(formData.quantity),
            });
            if (response && response.status === 200) {
                const { message } = response.data;
                dispatch(
                    updateVoucher({
                        id: formData.id,
                        value: parseInt(formData.value),
                        quantity: parseInt(formData.quantity),
                    })
                );
                toast.success(message);
            }
        }
        catch (err) {
            const result = HandleApiError(err);
            result
                ? toast.error(result)
                : toast.error("Có lỗi xảy ra, vui lòng thử lại");
        }
    };
    useEffect(() => {
        // Kiểm tra trạng thái dựa trên ngày hết hạn
        const currentDate = new Date(); // Lấy ngày hiện tại
        const endDate = new Date(data.endDate); // Lấy ngày hết hạn từ data
        const currentStatus = endDate < currentDate ? "Hết hạn" : "Còn hạn"; // Kiểm tra xem ngày hiện tại có qua ngày hết hạn chưa

        // Cập nhật formData với các giá trị từ data và trạng thái đã tính toán
        setFormData({
            code: data.code,
            name: data.name,
            value: data.value,
            quantity: data.quantity,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt,
            id: data.id,
            createdAt: data.createdAt,
            status: data.currentStatus,
        });
    }, [data]);
    return (
        <Dialog.Root onOpenChange={handleDialogOpenChange}>
            <Dialog.Trigger className=" py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg">
                Sửa
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />

                <Dialog.Content className=" fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-md shadow-lg">
                        <div className="flex items-center justify-between p-1 pl-4 border-b">
                            <Dialog.Title className="text-lg font-medium text-gray-800 ">
                                Chỉnh sửa tài khoản
                            </Dialog.Title>
                            <Dialog.Close className="p-2 text-gray-400 rounded-md hover:bg-gray-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 mx-auto"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Dialog.Close>
                        </div>
                        <Dialog.Description className="space-y-2 p-4 mt-3 text-[15.5px] leading-relaxed text-gray-500">
                            <div className="grid grid-cols-3 gap-5">
                                <div>
                                    <label className="text-gray-600">Mã</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            readOnly="true"
                                            type="text"
                                            name="code"
                                            value={formData.code}
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-600">Tên</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            readOnly="true"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-600">Giá trị</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            onChange={(e) => handleInputChange(e)}

                                            type="number"
                                            name="value"
                                            value={formData.value}
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-600">Số lượng</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            onChange={(e) => handleInputChange(e)}
                                            type="number"
                                            name="quantity"
                                            value={formData.quantity}
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-600">Mô tả</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            readOnly="true"
                                            type="text"
                                            name="description"
                                            value={formData.description}
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-600">Ngày bắt đầu</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            readOnly
                                            type="text"
                                            name="startDate"
                                            value={new Date(formData.startDate).toLocaleString()}
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-600">Ngày kết thúc</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            readOnly
                                            type="text"
                                            name="endDate"
                                            value={new Date(formData.endDate).toLocaleString()}
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-600">Thời điểm thay đổi</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            readOnly="true"
                                            type="text"
                                            name="updatedAt"
                                            value={new Date(formData.updatedAt).toLocaleString()}
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-600">Thời điểm xóa </label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            readOnly="true"
                                            type="text"
                                            name="deletedAt"
                                            value={new Date(formData.deletedAt).toLocaleString()}
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-600">ID</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            readOnly="true"
                                            type="text"
                                            name="id"
                                            value={formData.id}
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-600">Trạng thái</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            readOnly
                                            type="text"
                                            name="status"
                                            value={formData.currentStatus ? "Còn hạn" : "Hết hạn"}
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Dialog.Description>
                        <div className="flex justify-end items-center gap-3 p-4 border-t">
                            <Dialog.Close asChild>
                                <button
                                    onClick={() => handleSubmitUpdate(formData)}
                                    className="px-3 py-1 t text-xl text-white bg-green-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2 "
                                >
                                    Cập nhật
                                </button>
                            </Dialog.Close>
                            <Dialog.Close asChild>
                                <button
                                    className="px-3 py-1 text-xl text-gray-800 border rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
                                    aria-label="Close"
                                >
                                    Đóng
                                </button>
                            </Dialog.Close>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default ModelEditVoucher;
