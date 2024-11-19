import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loading from '~/components/Loading/Loading';
import { clearDataIdBillDetail, initDataIdBillDetail } from '~/redux/features/IdBillDetail/IdBillDetailSlice';
import { ChangeStatus, GetBill_IDAPI } from '~/services/BillService';
import { HandleApiError } from '~/Utils/HandleApiError';
import * as Select from "@radix-ui/react-select";



function BillDetails({ billsID, handleClickToggle }) {

    // Ngăn chặn sự kiện click ở thẻ con
    const dispatch = useDispatch();
    const id = useSelector((state) => state.idBillDetails.id)
    const total = useSelector((state) => state.idBillDetails.total)
    const totalDiscount = useSelector((state) => state.idBillDetails.totalDiscount)
    const totalPayment = useSelector((state) => state.idBillDetails.totalPayment)
    const payments = useSelector((state) => state.idBillDetails.payments)
    const vouchers = useSelector((state) => state.idBillDetails.vouchers)
    const account = useSelector((state) => state.idBillDetails.account)
    const status = useSelector((state) => state.idBillDetails.status)
    const billDetails = useSelector((state) => state.idBillDetails.billDetails) || []
    const productAttributes = useSelector((state) => state.idBillDetails.billDetails[0]?.productAttributes) || {}
    const fullName = useSelector((state) => state.idBillDetails.fullName)
    const shippingMethod = useSelector((state) => state.idBillDetails.shippingMethod)
    const deliverPhone = useSelector((state) => state.idBillDetails.deliverPhone)
    const deliverAddress = useSelector((state) => state.idBillDetails.deliverAddress)
    const note = useSelector((state) => state.idBillDetails.note)
    const loading = useSelector((state) => state.idBillDetails.loading)

    const error = useSelector((state) => state.idBillDetails.error)

    useEffect(() => {
        const fetchDataProduct = async () => {
            try {
                const response = await GetBill_IDAPI(billsID)
                dispatch(initDataIdBillDetail(response.data))
            } catch (error) {
                if (error.request) {
                    dispatch(initDataIdBillDetail({ error: "không có phản hồi từ server..." }));
                }
                const result = HandleApiError(error);
                result ? toast.error(result) : toast.error("Có lỗi xảy ra, vui lòng thử lại");
            }
        }
        dispatch(clearDataIdBillDetail());

        const timeoutId = setTimeout(() => {
            fetchDataProduct();
        }, 800);
        return () => clearTimeout(timeoutId);
    }, []);

    const handleChildClick = (event) => {
        event.stopPropagation();
    };

    const titleColumn = [
        "Tên sản phẩm",
        "Số lượng",
        "thuộc tính",
        "Đơn giá",
        "Giá giảm",
        "Tổng tiền"
    ]
    const handleChangeStatus = (value) => {
        const fetchChangeStatus = async () => {
            try {
                const response = await ChangeStatus(id, { status: value });
                if (response && response.data) {
                    const { statusCode, status, message } = response.data;                   
                    if (response.status === 200) {
                        toast.success(message);
                    } else if (statusCode === 400) {
                        toast.error(message);
                    } else {
                        toast.error(message);
                    }
                }
            } catch (err) {
                const result = HandleApiError(err);
                result
                    ? toast.error(result)
                    : toast.error("Có lỗi xảy ra, vui lòng thử lại");
            }
        };
        fetchChangeStatus();

    };




    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-5 z-10"
            onClick={handleClickToggle}
        >
            {loading ? (
                // absolute inset-0 flex justify-center items-center
                <div className="flex justify-center items-center h-64">
                    <Loading />
                </div>
            ) : (<div
                className="w-full max-w-6xl max-h-screen overflow-y-auto p-6 bg-white rounded-lg shadow-lg h-[90vh]"
                onClick={handleChildClick}
            >
                <div className="flex justify-end items-center">
                    <button className="text-gray-500 hover:text-gray-700" onClick={handleClickToggle}>
                        Đóng
                    </button>
                </div>
                <div className="flex justify-center items-center mb-6">
                    <h2 className="text-4xl font-bold">Chi tiết hoá đơn</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4 mb-4">
                    <div>
                        <div className="grid grid-cols-1 gap-4 mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg flex justify-between items-center">
                                <div className="mb-4 text-xl">
                                    <span className="text-gray-600">Hoá đơn: </span>
                                    <a href="#" className="text-blue-500 underline">{id}</a>
                                    <p className="text-gray-600">ngày tạo: {account.createdAt} </p>
                                    <p className="text-gray-600">ngày cập nhật: {account.updatedAt || "chưa cập nhật"} </p>
                                </div>
                                <div className="text-right mb-4">

                                    <span
                                        className={`px-3 py-2 rounded-full font-semibold text-xl ${status === "success"
                                            ? "text-green-600 bg-green-50"
                                            : status === "pending"
                                                ? "text-yellow-600 bg-yellow-50"
                                                : status === "delivery"
                                                    ? "text-orange-400 bg-red-50"
                                                    : "text-red-600 bg-red-50"
                                            }`}
                                    >
                                        {status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mb-4">
                            <div className="p-4 bg-gray-100 rounded-lg text-xl">
                                <h3 className="text-gray-700 font-semibold text-2xl">KHÁCH HÀNG</h3>
                                <p>{fullName}</p>
                                <p>{account.email}</p>
                                <p>{deliverPhone}</p>
                                <p>{deliverAddress}</p>
                            </div>
                        </div>

                        <table className="w-full mb-4 text-left border border-gray-300 text-xl">
                            <thead>
                                <tr className="bg-gray-200">
                                    {titleColumn.map((item, i) => (
                                        <th className="px-4 py-2" key={i}>{item}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>

                                <tr>
                                    <td className="px-4 py-2 border-b">{productAttributes?.products?.name}</td>
                                    <td className="px-4 py-2 border-b">{billDetails[0]?.quantity}</td>
                                    <td className="px-4 py-2 border-b">{productAttributes?.attributes?.name}</td>
                                    <td className="px-4 py-2 border-b">{total}</td>
                                    <td className="px-4 py-2 border-b">{totalDiscount}</td>
                                    <td className="px-4 py-2 border-b">{totalPayment}</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>

                    <div>
                        <div className="grid grid-cols-1 gap-4 mb-4">
                            <div className="p-4 bg-gray-100 rounded-lg text-xl space-y-2">
                                <h3 className="text-gray-700 font-semibold">PHƯƠNG THỨC THANH TOÁN</h3>
                                <div className="inline">{payments?.name}:</div>
                                <div className="inline ml-2">{totalPayment}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mb-4">
                            <div className="p-4 bg-gray-100 rounded-lg text-xl space-y-2">
                                <div className="space-y-2 text-right">
                                    <p className="text-gray-600">Tạm tính: {totalPayment}</p>
                                    <p className="text-gray-600">Khuyến mãi: <span className="text-red-500">{vouchers?.value || "không có"}</span></p>
                                    <p className="text-gray-600">Phương thức vận chuyển: <span className="text-green-500">{shippingMethod}</span></p>
                                    <p className="font-semibold">Thành tiền: {totalPayment}</p>
                                </div>
                            </div>
                        </div>
                        {(status === "success" || status === "failed") ? (
                            <div></div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 mb-4">
                                <div className="p-4 bg-gray-100 rounded-lg text-xl space-y-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <div className="relative w-72 max-w-full mx-auto">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="absolute top-0 bottom-0 w-5 h-5 my-auto text-gray-400 right-3"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <select className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2" onChange={(e) => handleChangeStatus(e.target.value)}>
                                                <option>thay đổi trạng thái</option>
                                                {status === "pending" ? (
                                                    <>
                                                        <option value={"delivery"}>đang vận chuyển</option>
                                                        <option value={"cancelled"}>huỷ đơn</option>
                                                    </>
                                                ) : status === "delivery" ? (
                                                    <>
                                                        <option value={"success"}>thành công</option>
                                                        <option value={"failed"}>thất bại</option>
                                                        <option value={"cancelled"}>huỷ đơn</option>
                                                    </>
                                                ) : null}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}




                    </div>
                </div>
            </div>
            )
            }
        </div>
    );
}



export default BillDetails;
