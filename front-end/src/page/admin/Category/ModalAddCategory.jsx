import React, { useEffect, useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast, ToastContainer } from "react-toastify";
import { HandleApiError } from "~/Utils/HandleApiError";
import { useDispatch, useSelector } from "react-redux";
import { AddCategory } from "~/services/CategoryService";
import { addCategory } from "~/redux/features/Categories/categoriesSlice";
import { validateCategory } from "~/Utils/Category/validateCategory";

export const ModalAddCategory = () => {
    const dispatch = useDispatch()
    const [nameCategory, setNameCategory] = useState("");
    const [descriptionCategory, setDescriptionCategory] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const categoryData = {
            name: nameCategory,
            description: descriptionCategory,
        };

        if (!validateCategory(categoryData)) {
            return;
        }
        try {
            const response = await AddCategory(categoryData)
            console.log(response)
            if (response && response.status === 201) {
                console.log("categoryData", categoryData)
                dispatch(addCategory(categoryData))
                toast.success("Thêm thể loại thành công")
            }
        }
        catch (error) {
            const result = HandleApiError(error);
            console.log(result)
            if (result) {
                // toast.error(result.message);
                toast.error("Tên danh mục đã tồn tại trong hệ thống");

            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại");
            }
        }

    }
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const categoryData = {
    //         name: nameCategory,
    //         description: descriptionCategory,
    //     };
    //     try {
    //         const response = await AddCategory(categoryData);
    //         console.log(response);
    //         if (response && response.status === 201) {
    //             console.log("categoryData", categoryData);
    //             dispatch(addCategory(categoryData));
    //             toast.success("Thêm thể loại thành công");
    //         }
    //     } catch (error) {
    //         const result = HandleApiError(error);
    //         console.log(result);
    //         if (result) {
    //             toast.error(result.message);
    //         } else {
    //             toast.error("Có lỗi xảy ra, vui lòng thử lại");
    //         }
    //     }
    // };

    return (
        <Dialog.Root
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setNameCategory("");
                    setDescriptionCategory("");
                }
            }}
        >
            <Dialog.Trigger className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm">
                Create Category
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4">
                    <div className="bg-white rounded-md shadow-lg">
                        <div className="flex items-center justify-between p-4 border-b">
                            <Dialog.Title className="text-lg font-medium text-gray-800 ">
                                Create product
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
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4 flex items-center">
                                    <label className="block text-nowrap text-sm font-medium text-gray-700 pr-4">
                                        Tên thể loại
                                    </label>
                                    <input
                                        type="text"
                                        className="mt-1 block text-[17px] w-full border border-gray-300 rounded-md p-2"
                                        required
                                        value={nameCategory}
                                        onChange={(e) => setNameCategory(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4 flex items-center">
                                    <label className="block text-sm text-nowrap pr-2 font-medium text-gray-700">
                                        Mô tả thể loại
                                    </label>
                                    <textarea
                                        className="mt-1 text-[17px] block w-full border border-gray-300 rounded-md p-2"
                                        required
                                        value={descriptionCategory}
                                        onChange={(e) => setDescriptionCategory(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="flex justify-end items-center gap-3 p-4 border-t">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 text-base text-white bg-indigo-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
                                    >
                                        Accept
                                    </button>
                                    <Dialog.Close asChild>
                                        <button
                                            type="button"
                                            className="px-6 py-2 text-base text-gray-800 border rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
                                            aria-label="Close"
                                        >
                                            Cancel
                                        </button>
                                    </Dialog.Close>
                                </div>
                            </form>
                        </Dialog.Description>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
