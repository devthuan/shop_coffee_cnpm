import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast, ToastContainer } from "react-toastify";
import { HandleApiError } from "~/Utils/HandleApiError";
import { useDispatch, useSelector } from "react-redux";
import { GetAllProduct } from "~/services/ProductService";
import { initDataProduct } from "~/redux/features/Products/productsSlice";
import { AddReview } from "~/services/ReviewService";
import { addReview } from "~/redux/features/Reviews/reviewsSlice";
import { GetAllAccountAPI } from "~/services/AccountService";
import { initDataAccount } from "~/redux/features/Accounts/accountsSilce";
export const ModalAddReview = () => {
    const dispatch = useDispatch()
    const accounts = useSelector(state => state.accounts.data)
    const products = useSelector(state => state.productss.data)
    const [formData, setFormData] = useState({
        rating: "",
        comment: "",
        productsId: 0
        // accountId : ""
    })

    useEffect(() => {
        const fetchData = async () => {
            const response = await GetAllProduct("limit=1000")
            const responseAccount = await GetAllAccountAPI("limit=1000")
            if (response && response.status === 200) {
                dispatch(initDataProduct(response.data))
                dispatch(initDataAccount(responseAccount.data))
            }
        }
        fetchData()
    }, [])

    const handleChangeInput = (event) => {
        const { name, value } = event.target
        setFormData({
            ...formData,
            [name]: name === "rating"  ? Number(value) : value

        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            console.log(formData)
            const response = await AddReview(formData)
            if (response && response.status === 201) {
                dispatch(addReview(response.data))
                toast.success("Thêm nhận xét sản phẩm thành công")
            }
        }
        catch (error) {
            const result = HandleApiError(error);
            console.log(result)
            if (result) {
                toast.error(result.message);
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại");
            }
        }

    };
    console.log(formData)
    return (
        <Dialog.Root>
            <Dialog.Trigger className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm">
                Create Review
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />

                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-md shadow-lg">
                        <div className="flex items-center justify-between p-1 pl-4 border-b">
                            <Dialog.Title className="text-lg font-medium text-gray-800">
                                Create Review
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
                            <div className="grid grid-cols-2 gap-y-2">
                                <div>
                                    <label className="text-gray-600">Rating</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            type="text"
                                            name="rating"
                                            onChange={handleChangeInput}
                                            value={formData.rating}
                                            placeholder="Rating"
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-gray-600">Comment</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            type="text"
                                            name="comment"
                                            value={formData.comment}
                                            onChange={handleChangeInput}
                                            placeholder="Comment"
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div className="relative max-w-xs mt-2">
                                    <label className="text-gray-600">Sản phẩm</label>
                                    <select
                                        name="productsId"
                                        onChange={handleChangeInput}
                                        value={formData.productsId}
                                        className="w-full pr-12 pl-3 py-2 mt-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                    >
                                        <option value = "0">Chọn sản phẩm</option>
                                        {products && products.length > 0 && products.map((product) => {
                                            return (
                                                <option value={product.id}>{product.name}</option>
                                            )
                                        })}

                                    </select>
                                </div>

                                <div className="relative max-w-xs mt-2">
                                    <label className="text-gray-600">Người dùng</label>
                                    <select
                                        name="accountId"
                                        onChange={handleChangeInput}
                                        value={formData.accountId}
                                        className="w-full pr-12 pl-3 py-2 mt-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                    >
                                        {accounts && accounts.length > 0 && accounts.map((account) => {
                                            return (
                                                <option value={account.id}>{account.userName}</option>
                                            )
                                        })}

                                    </select>
                                </div>
                            </div>

                            <ToastContainer
                                className="text-base"
                                fontSize="10px"
                                position="top-right"
                                autoClose={2000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                theme="light"
                            />
                        </Dialog.Description>

                        <div className="flex justify-end items-center gap-3 p-4 border-t">
                            <button
                                className="px-3 py-1 text-xl flex justify-center items-center gap-x-5 text-white bg-green-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
                                onClick={handleSubmit}
                            >
                                Create
                            </button>
                            <Dialog.Close asChild>
                                <button
                                    className="px-3 py-1 text-xl text-gray-800 border rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
                                    aria-label="Close"
                                >
                                    Cancel
                                </button>
                            </Dialog.Close>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
