import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast, ToastContainer } from "react-toastify";
import { HandleApiError } from "~/Utils/HandleApiError";
import { useDispatch, useSelector } from "react-redux";
import { updateReview } from "~/redux/features/Reviews/reviewsSlice";
import { UpdateReview } from "~/services/ReviewService";
export const ModalEditReview = ({ data }) => {
    console.log(data)
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        id : data.id,
        rating : data.rating,
        comment : data.comment,
        createdAt : data.createdAt,
        updatedAt : data.updatedAt
    })

    useEffect(() => {
        if (data) {
            setFormData({
                id: data.id,
                rating: data.rating,
               comment : data.comment,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            })
        }
    }, [data])



    const handleChangeInput = (event) => {
        const { name, value } = event.target
        setFormData({
            ...formData,
            [name]: name === "quantity" || name === "value" ? Number(value) : value
        })
    }

    const handleSubmit = async (e) => {
        const reviewData = {
            rating : Number(formData.rating),
            comment : formData.comment
        }
        e.preventDefault()
        try {
            console.log(reviewData)
            const response = await UpdateReview(data.id, reviewData)
            console.log(response)
            if (response && response.status === 200) {
                dispatch(updateReview({id : data.id, ...reviewData}))
                toast.success(`Chỉnh sửa đánh giá thành công`)
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
            <Dialog.Trigger>
                Sửa
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />

                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-md shadow-lg">
                        <div className="flex items-center justify-between p-1 pl-4 border-b">
                            <Dialog.Title className="text-lg font-medium text-gray-800">
                                Update Attribute
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
                                    <label className="text-gray-600">Id</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            type="text"
                                            name="id"
                                            readOnly
                                            value={formData?.id}
                                            placeholder="Tên chương trình"
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-gray-600">Rating</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            type="text"
                                            name="rating"
                                            onChange={handleChangeInput}
                                            value={formData?.rating}
                                            placeholder="Tên chương trình"
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
                                            value={formData?.comment}
                                            onChange={handleChangeInput}
                                            placeholder="Tên chương trình"
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>

                              

                                <div>
                                    <label className="text-gray-600">Created At</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            readOnly
                                            type="text"
                                            name="startDate"
                                            value={formData?.createdAt}
                                            onChange={handleChangeInput}
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-gray-600">Updated At</label>
                                    <div className="relative max-w-xs mt-2">
                                        <input
                                            readOnly
                                            type="text"
                                            name="startDate"
                                            value={formData?.updatedAt}
                                            onChange={handleChangeInput}
                                            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        />
                                    </div>
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
                                Update
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
