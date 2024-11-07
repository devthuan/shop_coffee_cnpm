import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ChangeStatusReceiptAPI,
  GetDetailReceiptAPI,
} from "~/services/ReceiptServer";
import { HandleApiError } from "~/Utils/HandleApiError";
import { useDispatch, useSelector } from "react-redux";
import {
  changeStatusReceipt,
  initDataDetail,
} from "~/redux/features/Receipts/receiptsSlice";
import { toast } from "react-toastify";

export const ReceiptModelEdit = ({ data }) => {
  const dispatch = useDispatch();
  const [detailReceipt, setDetailReceipt] = useState({});

  const handleBtnUpdate = async (statusReceipt) => {
    try {
      const response = await ChangeStatusReceiptAPI(data.id, statusReceipt);
      if (response && response.data) {
        const { statusCode, status, message } = response.data;
        dispatch(changeStatusReceipt({ id: data.id, status: statusReceipt }));
        toast.success("Cập nhật trạng thái thành công");
      }
    } catch (error) {
      const { message, status } = HandleApiError(error);
      if (status === "error") {
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(data.id);
        const response = await GetDetailReceiptAPI(data.id);
        if (response.data && response.status === 200) {
          setDetailReceipt(response.data);
        }
      } catch (error) {
        const { message, status } = HandleApiError(error);
        if (status === "error") {
        }
      }
    };
    fetchData();
  }, [data.id]);

  return (
    <Dialog.Root>
      {/* title button */}
      <Dialog.Trigger>Chi tiết</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
        {/* chỉnh kính thước modal ở max-w-lg các option [max-w-xl,max-w-2xl, max-w-3xl... ] */}
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              {/* title modal */}
              <Dialog.Title className="text-lg font-medium text-gray-800 ">
                Chi tiết phiếu nhập
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
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="text-gray-600">ID</label>
                  <div className="relative mt-2 max-w-xs text-gray-500">
                    <input
                      type="text"
                      defaultValue={data.id}
                      className="w-full pl-2 py-2 appearance-none bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Người tạo</label>
                  <div className="relative mt-2 max-w-xs text-gray-500">
                    <input
                      type="text"
                      defaultValue={data.account.email}
                      className="w-full pl-2 py-2 appearance-none bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Nhà cung cấp</label>
                  <div className="relative mt-2 max-w-xs text-gray-500">
                    <input
                      type="text"
                      defaultValue={data.supplier.name}
                      className="w-full pl-2 py-2 appearance-none bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Ngày tạo</label>
                  <div className="relative mt-2 max-w-xs text-gray-500">
                    <input
                      type="text"
                      defaultValue={new Date(data.createdAt).toLocaleString()}
                      className="w-full pl-2 py-2 appearance-none bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="max-w-screen-xl mx-auto   ">
                <div className="mt-4 shadow-sm border rounded-lg overflow-x-auto">
                  <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                      <tr>
                        <th className="py-3 px-6">Sản phẩm</th>
                        <th className="py-3 px-6">Thuộc tính</th>
                        <th className="py-3 px-6">Giá</th>
                        <th className="py-3 px-6">Số lượng</th>
                        <th className="py-3 px-6">Tổng</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                      {detailReceipt &&
                        detailReceipt?.importReceiptDetail?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item?.productAttribute.products.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item?.productAttribute?.attributes?.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.unitPrice}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.totalPrice}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="w-11/12 pl-5">
                <div className="mt-4 flex justify-between px-2">
                  <div className="text-gray-600 text-base">Tổng tiền : </div>
                  <div className=" text-gray-500 text-base pr-5">
                    {detailReceipt.totalAmount}
                  </div>
                </div>
                <div className="mt-4 flex justify-between px-2">
                  <div className="text-gray-600 text-base">Trạng thái : </div>

                  <div
                    className={`px-5 py-2 rounded-[10px] text-base 
                    ${
                      detailReceipt.status === "approved"
                        ? "text-green-600 bg-green-50"
                        : detailReceipt.status === "pending"
                        ? "text-yellow-600 bg-yellow-50"
                        : "text-red-600 bg-red-50"
                    }
                  `}
                  >
                    {detailReceipt.status}
                  </div>
                </div>
              </div>
            </Dialog.Description>
            <div className="flex justify-end items-center gap-3 p-4 border-t">
              {detailReceipt.status === "pending" ? (
                <>
                  <Dialog.Close asChild>
                    <button
                      onClick={() => handleBtnUpdate("approved")}
                      className="px-6 py-2 text-base text-white bg-green-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2 "
                    >
                      Approved
                    </button>
                  </Dialog.Close>
                  <Dialog.Close asChild>
                    <button
                      onClick={() => handleBtnUpdate("rejected")}
                      className="px-6 py-2 text-base text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2 "
                    >
                      Rejected
                    </button>
                  </Dialog.Close>
                </>
              ) : (
                ""
              )}

              <Dialog.Close asChild>
                <button
                  className="px-6 py-2 text-base text-gray-800 border rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
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
