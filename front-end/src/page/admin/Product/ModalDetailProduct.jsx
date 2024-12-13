import React from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { ToastContainer, toast } from "react-toastify";

export const ModalDetailProduct = ({ data }) => {
    console.log(data)
    const tableTitles = [
        "Id",
        "Name",
        "Sell Price",
        "Buy Price",
        "Quantity",
        "Created At",
        "Updated At"
    ];

    return (
        <Dialog.Root>
            {/* title button */}
            <Dialog.Trigger>Detail</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
                {/* chỉnh kính thước modal ở max-w-lg các option [max-w-xl,max-w-2xl, max-w-3xl... ] */}
                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-[1000px] mx-auto px-4">
                    <div className="bg-white rounded-md shadow-lg">
                        <div className="flex items-center justify-between p-4 border-b">
                            {/* title modal */}
                            <Dialog.Title className="text-lg font-medium text-gray-800 ">
                                Chi tiết sản phẩm
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

                        {/* content modal */}
                        <Dialog.Description className="space-y-2 p-4 mt-3 text-[15.5px] leading-relaxed text-gray-500">
                            <div className="mt-4  h-max overflow-auto">
                                <table className="w-full table-auto text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                        <tr>
                                            {tableTitles &&
                                                tableTitles.length > 0 &&
                                                tableTitles.map((item, index) => {
                                                    return (
                                                        <th key={index} className="py-3 pr-6">
                                                            {item}
                                                        </th>
                                                    );
                                                })}
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 divide-y">
                                        {data && data?.productAttributes && data?.productAttributes.length > 0 && data?.productAttributes.map((item, idx) =>(
                                            <tr key={idx} >
                                                {/* <td className="pr-6 py-4 whitespace-nowrap">{category.id}</td> */}
                                                <td className="pr-6 py-4 whitespace-nowrap">{item?.id}</td>
                                                <td className="pr-6 py-4 whitespace-nowrap">{item?.attributes.name}</td>
                                                <td className="pr-6 py-4 whitespace-nowrap">{item?.sellPrice}</td>
                                                <td className="pr-6 py-4 whitespace-nowrap">{item?.buyPrice}</td>
                                                <td className="pr-6 py-4 whitespace-nowrap">{item.quantity}</td>
                                                <td className="pr-6 py-4 whitespace-nowrap">{item.createdAt}</td>
                                                <td className="pr-6 py-4 whitespace-nowrap">{item.updatedAt}</td>
                                            </tr>
                                        ) )}
                                    </tbody>
                                </table>
                            </div>


                        </Dialog.Description>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
