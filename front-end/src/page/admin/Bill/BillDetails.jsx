import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChangeStatus, GetBill_IDAPI } from "~/services/BillService";
import {
  clearDataIdBillDetail,
  initDataIdBillDetail,
} from "~/redux/features/IdBillDetail/IdBillDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import { HandleApiError } from "~/Utils/HandleApiError";
import { toast } from "react-toastify";
import {
  changeStatusBill,
  initDetailBill,
  initErrorBill,
} from "~/redux/features/Bill/billSilice";

export const BillDetails = ({ data }) => {
  const dispatch = useDispatch();
  const dataDetail = useSelector((state) => state.bill.detail);

  const [formData, setFormData] = useState();

  const titleColumn = [
    "Tên sản phẩm",
    "Số lượng",
    "thuộc tính",
    "Đơn giá",
    "Giá giảm",
    "Tổng tiền",
  ];

  const listStatus = {
    pending: "Đang xử lý",
    delivery: "Đang giao hàng",
    success: "Thành công",
    failed: "Thất bại",
    cancelled: "Huỷ",
  };

  //  hàm xử lý sự kiện cập nhật
  const handleStatusBill = async (status) => {
    try {
      const response = await ChangeStatus(data.id, { status });
      if (response && response.status === 200) {
        toast.success("Cập nhật trạng thái thành công");
        dispatch(
          changeStatusBill({
            id: data.id,
            status: status,
          })
        );
      } else {
        toast.error("Cập nhật trạng thái thất bại");
      }
    } catch (error) {
      HandleApiError(error);
    }
  };

  const handleOpenChange = (isOpen) => {
    if (isOpen) {
      const fetchDataProduct = async () => {
        try {
          const response = await GetBill_IDAPI(data.id);
          dispatch(initDetailBill(response.data));
        } catch (error) {
          if (error.request) {
            dispatch(
              initErrorBill({ error: "không có phản hồi từ server..." })
            );
          }
          const result = HandleApiError(error);
          result
            ? toast.error(result)
            : toast.error("Có lỗi xảy ra, vui lòng thử lại");
        }
      };

      fetchDataProduct();
    } else {
      console.log("Modal đã đóng");
    }
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      {/* title button */}
      <Dialog.Trigger>Chi tiết</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
        {/* chỉnh kính thước modal ở max-w-lg các option [max-w-xl,max-w-2xl, max-w-3xl... ] */}
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              {/* title modal */}
              <Dialog.Title className="text-lg font-medium text-gray-800 ">
                Chi tiết hoá đơn
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
              <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4 mb-4">
                <div>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg flex justify-between items-center">
                      <div className="mb-4 text-xl">
                        <span className="text-gray-600">Hoá đơn: </span>
                        <a href="#" className="">
                          {dataDetail.id}
                        </a>
                        <p className="text-gray-600">
                          ngày tạo:{" "}
                          {new Date(dataDetail.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div className="p-4 bg-gray-100 rounded-lg text-xl">
                      <h3 className="text-gray-700 font-semibold text-2xl">
                        KHÁCH HÀNG
                      </h3>
                      <p>{dataDetail.fullName}</p>
                      <p>{dataDetail.account?.email}</p>
                      <p>{dataDetail.deliverPhone}</p>
                      <p>{dataDetail.deliverAddress}</p>
                    </div>
                  </div>

                  <table className="w-full mb-4 text-left border border-gray-300 text-xl">
                    <thead>
                      <tr className="bg-gray-200">
                        {titleColumn?.map((item, i) => (
                          <th className="px-4 py-2" key={i}>
                            {item}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataDetail?.billDetails?.map((item) => {
                        return (
                          <tr>
                            <td className="px-4 py-2 border-b">
                              {item.productAttributes?.products?.name}
                            </td>
                            <td className="px-4 py-2 border-b">
                              {item?.quantity}
                            </td>
                            <td className="px-4 py-2 border-b">
                              {item.productAttributes?.attributes?.name}
                            </td>
                            <td className="px-4 py-2 border-b">
                              {item?.productAttributes.sellPrice}
                            </td>
                            <td className="px-4 py-2 border-b">
                              {item?.discount}
                            </td>
                            <td className="px-4 py-2 border-b">
                              {item?.productAttributes.sellPrice *
                                item?.quantity}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div className=" p-4 bg-gray-100 rounded-lg flex justify-start items-center">
                      <div className="text-right mb-4 mx-auto">
                        <span
                          className={`px-3 py-2 rounded-full font-semibold text-xl ${
                            dataDetail.status === "success"
                              ? "text-green-600 bg-green-50"
                              : dataDetail.status === "pending"
                              ? "text-yellow-600 bg-yellow-50"
                              : dataDetail.status === "delivery"
                              ? "text-blue-400 bg-blue-50"
                              : dataDetail.status === "cancelled"
                              ? "text-gray-600 bg-gray-50"
                              : "text-red-600 bg-red-50"
                          }`}
                        >
                          {listStatus[dataDetail.status]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div className="p-4 bg-gray-100 rounded-lg text-xl space-y-2">
                      <div className="space-y-2 text-right">
                        <p className="text-gray-600">
                          Tạm tính: {dataDetail.totalPayment}
                        </p>
                        <p className="text-gray-600">
                          Khuyến mãi:{" "}
                          <span className="text-red-500">
                            {dataDetail.vouchers?.value || "không có"}
                          </span>
                        </p>
                        <p className="text-gray-600">
                          Phương thức vận chuyển:{" "}
                          <span className="text-green-500">
                            {dataDetail.shippingMethod}
                          </span>
                        </p>
                        <p className="text-gray-600">
                          Phương thức thanh toán:
                          <span className="text-green-500">
                            {dataDetail.payments?.name}
                          </span>
                        </p>
                        <p className="font-semibold">
                          Thành tiền: {dataDetail.totalPayment}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Description>
            <div className="flex justify-end items-center gap-3 p-4 border-t">
              <Dialog.Close asChild>
                <button
                  onClick={() => handleStatusBill("success")}
                  className="px-6 py-2 text-base text-white bg-green-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2 "
                >
                  Giao hàng thành công
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  onClick={() => handleStatusBill("failed")}
                  className="px-6 py-2 text-base text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2 "
                >
                  Giao hàng thất bại
                </button>
              </Dialog.Close>

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
