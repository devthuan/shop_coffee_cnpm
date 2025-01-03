import * as Dialog from "@radix-ui/react-dialog";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CreateVoucher } from "~/services/VoucherService";
import { useDispatch, useSelector } from "react-redux";
import { addVoucher } from "~/redux/features/Vouchers/voucherSlice";
import HalfRingLoading from "~/components/Loading/HalfRingLoading";
import { HandleApiError } from "~/Utils/HandleApiError";
const ModelAddVoucher = () => {
    const dispatch = useDispatch();
    const [isProcessing, setIsProcessing] = useState(false);
    const dataRole = useSelector((item) => item.roles.data);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        value: "",
        quantity: "",
        description: "",
        startDate: "",
        endDate: "",
    });

    const listInput = [
        {
            title: "Tên",
            typeInput: "text",
            placeholder: "Nhập tên voucher ",
            fieldName: "name",
        },
        {
            title: "Mã",
            typeInput: "text",
            placeholder: "Nhập mã voucher",
            fieldName: "code",
        },
        {
            title: "Giá trị",
            typeInput: "number",
            placeholder: "Nhập giá trị voucher",
            fieldName: "value",
        },
        {
            title: "Số lượng",
            typeInput: "number",
            placeholder: "Nhập số lượng voucher",
            fieldName: "quantity",
        },
        {
            title: "Mô tả",
            typeInput: "text",
            placeholder: "Nhập mô tả voucher",
            fieldName: "description",
        },
        {
            title: "Ngày bắt đầu",
            typeInput: "date",
            placeholder: "Nhập ngày bắt đầu voucher",
            fieldName: "startDate",
            dateFormat: "yyyy/MM/dd"
        },
        {
            title: "Ngày kết thúc",
            typeInput: "date",
            placeholder: "Nhập ngày kết thúc voucher",
            fieldName: "endDate",
            dateFormat: "yyyy/MM/dd"
        },
    ];
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            console.log("Dữ liệu gửi đi:", formData);
            const response = await CreateVoucher({
                name: formData.name,
                code: formData.code,
                value: parseInt(formData.value),
                quantity: parseInt(formData.quantity),
                description: formData.description,
                startDate: formData.startDate,
                endDate: formData.endDate,
            });
            console.log(response.status)
            if (response && response.status === 201) {
                const { statusCode, status, message, data, success } = response.data;
                console.log(response.data);
                dispatch(addVoucher(response.data));
                toast.success("Tạo Thành Công");
            }
            setFormData({
                name: "",
                code: "",
                value: "",
                quantity: "",
                description: "",
                startDate: "",
                endDate: ""
            });
            setIsProcessing(false);
        } catch (err) {
            console.log(err);
            const result = HandleApiError(err);
            result
                ? toast.error(result)
                : toast.error("Có lỗi xảy ra, vui lòng thử lại");
            setIsProcessing(false);
        }
    };
    return (
        <Dialog.Root>
            <Dialog.Trigger className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm">
                Tạo Voucher
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />

                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-md shadow-lg">
                        <div className="flex items-center justify-between p-1 pl-4 border-b">
                            <Dialog.Title className="text-lg font-medium text-gray-800">
                                Create Voucher
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
                            <div className="grid grid-cols-2 gap-y-5">
                                {listInput.map((item) => (
                                    <div key={item.title}>
                                        <label className="text-gray-600">{item.title}</label>
                                        <div className="relative max-w-xs mt-2">
                                            <input
                                                type={item.typeInput}
                                                name={item.fieldName}
                                                value={formData[item.fieldName]}
                                                onChange={(e) => handleChange(e)}
                                                placeholder={item.placeholder}
                                                className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Dialog.Description>
                        <div className="flex justify-end items-center gap-3 p-4 border-t">
                            <button
                                className="px-3 py-1 text-xl flex justify-center items-center gap-x-5 text-white bg-green-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
                                onClick={handleSubmit}
                            >
                                {isProcessing ? (
                                    <div className="py-3 px-5">
                                        <HalfRingLoading />
                                    </div>
                                ) : (
                                    "Tạo mới"
                                )}
                            </button>
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
export default ModelAddVoucher;
