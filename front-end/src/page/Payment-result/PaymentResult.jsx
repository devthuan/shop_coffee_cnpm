import React, { useState, useEffect, Fragment } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AddBill, VnpayPaymentAPI } from "~/services/BillService";
import { HandleApiError } from "~/Utils/HandleApiError";
import { useSelector, useDispatch } from "react-redux";
import { GetAllPaynment } from "~/services/PaynmentService";
import { initDataPayment } from "~/redux/features/Payments/paymentsSlice";
import { useNavigate } from "react-router-dom";
import { validatePaymentData } from "~/Utils/ValidatePayment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
const PaymentResult = () => {
  const location = useLocation();
  // Tạo đối tượng URLSearchParams để dễ dàng truy cập các tham số trong URL
  const params = new URLSearchParams(location.search);

  const orderId = params.get("orderId");
  const status = params.get("status");
  const amount = params.get("amount");
  const date = params.get("date");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const payments = useSelector((state) => state.payments.data);
  const carts = location.state || {};

  const formattedDate = moment(date, "YYYYMMDDHHmmss").format(
    "YYYY-MM-DD HH:mm:ss"
  );

  return (
    <main>
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
        <div className="max-w-lg mx-auto space-y-3 text-center">
          <h3 className="text-indigo-600 font-semibold">
            <FontAwesomeIcon
              icon={faCheck}
              className={` size-44 ${
                status === "success" ? "text-green-500" : "text-red-500"
              } `}
            />
          </h3>
          <h3 className="text-gray-800 text-4xl font-semibold sm:text-5xl">
            Đặt hàng {status === "success" ? "thành công" : "thất bại"}
          </h3>
          <h3 className="text-gray-600 text-2xl">Mã đơn hàng: {orderId}</h3>
          <h3 className="text-gray-600 text-2xl">
            Tổng tiền:{" "}
            {parseInt(parseInt(amount).toString().slice(0, -1)).toLocaleString(
              "vi-VN"
            )}{" "}
            VNĐ
          </h3>
          <h3 className="text-gray-600 text-2xl">Ngày tạo: {formattedDate}</h3>
          <h3 className="text-gray-600 text-2xl">trạng thái: {status}</h3>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="/"
              className="block py-2 px-4 text-white font-medium bg-indigo-600 duration-150 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg"
            >
              Quay về trang chủ
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentResult;
