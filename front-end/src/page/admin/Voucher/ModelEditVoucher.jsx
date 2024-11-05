import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import React from "react";
import { toast } from "react-toastify";
import { UpdateVoucher, UseVoucher, DeleteVoucher } from "~/services/VoucherService";
import { useDispatch, useSelector } from "react-redux";
import { updateVoucher, addVoucher, updateStatusVoucher, removeVoucher, clearDataVoucher } from "~/redux/features/Vouchers/voucherSlice";
import { HandleApiError } from "~/Utils/HandleApiError";
const ModelEditVoucher = ({ data }) => {
    const dispatch = useDispatch();
    // const dataId = useSelector((item) => item.id.data);
    const dataId = useSelector((state) => state.id?.data || []);
    const [isProcessing, setIsProcessing] = useState(false);
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
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,

        });
    };

    const handleSubmitUpdate = async () => {
        try {
            const findId = dataId.filter(
                (id) => id.id === formData.id
            );
            console.log('Submitting update with data:', formData);
            // const findId = dataId.find((id) => id.id === formData.id);

            const response = await UpdateVoucher(formData.id, {

                value: formData.value,
                quantity: formData.quantity,

            });
            if (response && response.data) {
                const { statusCode, status, message } = response.data;

                if (statusCode === 200 && status === "success") {

                    dispatch(
                        updateVoucher({
                            id: formData.id,
                            value: Number(formData.value),
                            quantity: Number(formData.quantity),
                        })
                    );
                    toast.success(message);
                }
            }
        } catch (err) {
            const result = HandleApiError(err);
            result
                ? toast.error(result)
                : toast.error("Có lỗi xảy ra, vui lòng thử lại");
        }
    };

    //   const handleResetPassword = async () => {
    //     if (isProcessing) return; // Prevent further clicks during processing

    //     setIsProcessing(true); // Start processing

    //     try {
    //       const response = await ResetPasswordAPI(formData.id);

    //       if (response && response.data) {
    //         const { statusCode, status, message, data } = response.data;
    //         if (statusCode === 200 && status === "success") {
    //           toast.success(message);
    //           setIsProcessing(false);
    //         } else if (statusCode === 400 && status === "error") {
    //           toast.error(message);
    //         } else {
    //           toast.error(message);
    //         }
    //       }
    //     } catch (err) {
    //       const result = HandleApiError(err);
    //       result
    //         ? toast.error(result)
    //         : toast.error("Có lỗi xảy ra, vui lòng thử lại");
    //     }
    //   };
    // useEffect(() => {
    //     const fetchAPI = async () => {
    //       dispatch(clearDataRole());
    //       try {
    //         const response = await GetAllRole("");
    //         if (response && response.data && response.status === 200) {
    //           dispatch(initDataRole(response.data));
    //         }
    //       } catch (error) {
    //         console.log(error);
    //         const result = HandleApiError(error);
    //         result
    //           ? toast.error(result)
    //           : toast.error("Có lỗi xảy ra, vui lòng thử lại");
    //       }
    //     };
    //     if (dataRole.length === 0) {
    //       fetchAPI();
    //     }
    //   }, [dispatch]);

    useEffect(() => {
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
            status: data.status
        });
    }, []);

    return (
        <Dialog.Root>
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
                                    <label className="text-gray-600">code</label>
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
                                    <label className="text-gray-600">name</label>
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
                                    <label className="text-gray-600">value</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            onChange={handleInputChange}
                                            type="text"
                                            name="value"
                                            value={formData.value}
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-600">quantity</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            onChange={handleInputChange}
                                            type="text"
                                            name="quantity"
                                            value={formData.quantity}
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-600">description</label>
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
                                    <label className="text-gray-600">startDate</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            readOnly="true"
                                            type="text"
                                            name="startDate"
                                            value={formData.startDate}
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-600">endDate</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            readOnly="true"
                                            type="text"
                                            name="endDate"
                                            value={formData.endDate}
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-600">updatedAt</label>
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
                                    <label className="text-gray-600">deletedAt </label>
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
                                    <label className="text-gray-600">id</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            readOnly="true"
                                            type="text"
                                            name="id"
                                            value={(formData.id)}
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-600">status</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            readOnly="true"
                                            type="text"
                                            name="status"
                                            value={formData.status}
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <label className="text-gray-600">Cung cấp mật khẩu</label>
                                    <div className="relative max-w-xs mt-2">
                                        <button
                                            //   onClick={() => handleDeleteVoucher()}
                                            className="px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg duration-150 hover:bg-indigo-100 active:bg-indigo-200"
                                        >
                                            {isProcessing ? "Đang sử lý..." : "Cấp mật khẩu mới"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Dialog.Description>
                        <div className="flex justify-end items-center gap-3 p-4 border-t">
                            <Dialog.Close asChild>
                                <button
                                    onClick={() => handleSubmitUpdate()}
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
