import React, { useState, useEffect, Fragment } from "react";
import { redirect, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AddBill, VnpayPaymentAPI } from "~/services/BillService";
import { HandleApiError } from "~/Utils/HandleApiError";
import { useSelector, useDispatch } from "react-redux";
import { GetAllPaynment } from "~/services/PaynmentService";
import { initDataPayment } from "~/redux/features/Payments/paymentsSlice";
import { useNavigate } from "react-router-dom";
import { validatePaymentData } from "~/Utils/ValidatePayment";
import { CheckUseVoucherAPI, GetAllVoucher } from "~/services/VoucherService";
const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const payments = useSelector((state) => state.payments.data);
  const location = useLocation();
  const carts = location.state || {};

  const [usingVoucher, setUsingVoucher] = useState("");
  const [voucherObject, setVoucherObject] = useState();
  const [informations, setInformations] = useState({
    fullName: "",
    deliverAddress: "",
    deliverPhone: "",
    shippingMethod: "",
    paymentMethod: "",
    note: "",
    voucher: carts.codeVoucher ? carts.codeVoucher : "",
    products: carts?.cartsCheck?.map((cart) => ({
      productAttributeId: cart.productAttributes.id,
      quantity: cart.quantity,
    })),
  });

  console.log(carts);

  const [errors, setErrors] = useState({
    fullName: "",
    deliverAddress: "",
    deliverPhone: "",
    shippingMethod: "",
    paymentMethod: "",
  });

  const [paymentMethod, setPaymentMethod] = useState({
    paymentMethod: "",
    fee: 0,
  });

  const validateField = (fieldName, value) => {
    let errorMessage = "";
    if (fieldName === "fullName" && !value) {
      errorMessage = "Vui lòng nhập họ tên";
    } else if (fieldName === "deliverAddress" && !value) {
      errorMessage = "Vui lòng nhập địa chỉ giao hàng";
    } else if (fieldName === "deliverPhone" && !value) {
      errorMessage = "Vui lòng nhập số điện thoại";
    } else if (fieldName === "shippingMethod" && !value) {
      errorMessage = "Vui lòng chọn phương thức vận chuyển";
    } else if (fieldName === "paymentMethod" && !value) {
      errorMessage = "Vui lòng chọn phương thức thanh toán";
    }

    // Cập nhật lỗi cho trường tương ứng
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetAllPaynment("limit=100");
      if (response && response.status == 200) {
        dispatch(initDataPayment(response.data));
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInformations((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  const checkVoucher = async () => {
    try {
      const response = await CheckUseVoucherAPI(usingVoucher);
      if (response && response.status === 200) {
        toast.success("Mã giảm giá đã được sử dụng");
        setInformations((prevData) => ({
          ...prevData,
          voucher: response.data.code,
        }));
        setVoucherObject(response.data);
      }
    } catch (error) {
      const result = HandleApiError(error);
    }
  };

  const handleSubmit = async () => {
    console.log(informations);
    informations.shippingMethod = paymentMethod.paymentMethod;

    if (informations.shippingMethod === "") {
      toast.error("Vui lòng chọn phương thức vận chuyển");
      return;
    }

    const totalAmount = carts.totalEstimate + paymentMethod.fee;
    console.log(totalAmount);
    try {
      if (informations.paymentMethod === "1") {
        // Gọi API để lấy URL thanh toán
        const response = await VnpayPaymentAPI(totalAmount);
        console.log(response);
        if (response.data?.paymentUrl) {
          const response = await AddBill(informations);
          window.location.href = response.data.paymentUrl;
        }
      } else {
        const response = await AddBill(informations);
        console.log(response);
        if (response && response.status === 201) {
          navigate(
            `/payment-result?amount=${response.data.totalPayment}&date=${response.data.createdAt}&status=success`
          );
        }
      }
    } catch (error) {
      const result = HandleApiError(error);
      if (result) {
        toast.error(result);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    }
  };

  // return (
  //   <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
  //     <h2 className="text-2xl font-semibold text-gray-800 mb-6">Payment</h2>

  //     <div className="flex items-center space-x-4">
  //       <label
  //         htmlFor="fullName"
  //         className="block w-1/3 text-sm font-medium text-gray-700"
  //       >
  //         Tên người dùng
  //       </label>
  //       <input
  //         type="text"
  //         id="fullName"
  //         name="fullName"
  //         value={informations.fullName}
  //         onChange={handleChange}
  //         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
  //       />
  //     </div>

  //     <div className="flex items-center space-x-4">
  //       <label
  //         htmlFor="deliverAddress"
  //         className="block w-1/3 text-sm font-medium text-gray-700"
  //       >
  //         Địa chỉ
  //       </label>
  //       <input
  //         type="text"
  //         id="deliverAddress"
  //         name="deliverAddress"
  //         value={informations.deliverAddress}
  //         onChange={handleChange}
  //         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
  //       />
  //     </div>

  //     <div className="flex items-center space-x-4">
  //       <label
  //         htmlFor="deliverPhone"
  //         className="block w-1/3 text-sm font-medium text-gray-700"
  //       >
  //         Số điện thoại
  //       </label>
  //       <input
  //         type="tel"
  //         id="deliverPhone"
  //         name="deliverPhone"
  //         value={informations.deliverPhone}
  //         onChange={handleChange}
  //         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
  //       />
  //     </div>

  //     <div className="flex items-center space-x-4">
  //       <label
  //         htmlFor="shippingMethod"
  //         className="block w-1/3 text-sm font-medium text-gray-700"
  //       >
  //         Phương thức vận chuyển
  //       </label>
  //       <select
  //         id="shippingMethod"
  //         name="shippingMethod"
  //         value={informations.shippingMethod}
  //         onChange={handleChange}
  //         className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
  //       >
  //         <option value="Vận chuyển siuu tốc">Vận chuyển siuu tốc</option>
  //         <option value="Vận chuyển từ 2-3 ngày">Vận chuyển từ 2-3 ngày</option>
  //       </select>
  //     </div>

  //     <div className="flex items-start space-x-4">
  //       <label
  //         htmlFor="note"
  //         className="block w-1/3 text-sm font-medium text-gray-700"
  //       >
  //         Ghi chú
  //       </label>
  //       <textarea
  //         id="note"
  //         name="note"
  //         value={informations.note}
  //         onChange={handleChange}
  //         rows="3"
  //         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
  //       ></textarea>
  //     </div>

  //     <div className="flex items-center space-x-4">
  //       <label
  //         htmlFor="paymentMethod"
  //         className="block w-1/3 text-sm font-medium text-gray-700"
  //       >
  //         Phương thức thanh toán
  //       </label>
  //       <select
  //         id="paymentMethod"
  //         name="paymentMethod"
  //         value={informations.paymentMethod}
  //         onChange={handleChange}
  //         className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
  //       >
  //         {payments && payments.length > 0 ? (
  //           <Fragment>
  //             <option>Chọn phương thức thanh toán</option>
  //             {payments.map((payment, index) => (
  //               <option key={index} value={payment.id}>
  //                 {payment.name}
  //               </option>
  //             ))}
  //           </Fragment>
  //         ) : (
  //           <option>Chọn phương thức thanh toán</option>
  //         )}
  //       </select>
  //     </div>

  //     <div>
  //       <button
  //         onClick={() => handleSubmit()}
  //         type="submit"
  //         className="w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  //       >
  //         Submit
  //       </button>
  //     </div>

  //     <ToastContainer
  //       className="text-base"
  //       fontSize="10px"
  //       position="top-right"
  //       autoClose={2000}
  //       hideProgressBar={false}
  //       newestOnTop={false}
  //       closeOnClick
  //       rtl={false}
  //       pauseOnFocusLoss
  //       draggable
  //       pauseOnHover
  //       theme="light"
  //     />
  //   </div>
  // );

  return (
    <div className="w-full">
      <div className="grid grid-cols-12 gap-x-5">
        <div className="col-span-8 ">
          <div className="w-11/12 h-auto p-[30px] bg-white rounded-[20px] shadow flex-col justify-start items-start gap-2.5 inline-flex">
            <div className="flex-col justify-start items-start gap-[30px] flex">
              <div className="w-full justify-start items-center gap-[177px] inline-flex">
                <div className="text-[#1a162e] text-[22px] font-medium font-['Gordita'] leading-loose">
                  1. Thời gian vận chuyển, mất từ 3 đến 4 ngày
                </div>
                <div className="justify-start items-start gap-2.5 flex">
                  <div className="w-6 h-6 p-[3px] justify-center items-center flex">
                    <div className="w-[18px] h-[18px] relative"></div>
                  </div>
                  <div className="text-[#1a162e] text-lg font-normal font-['Gordita'] leading-relaxed">
                    Edit
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="px-4 ">
                <label for="username" className="text-left block py-2 ">
                  Họ và tên người nhận
                </label>
                <div className="flex items-center  border rounded-md">
                  <input
                    id="fullName"
                    name="fullName"
                    value={informations.fullName}
                    onChange={handleChange}
                    type="text"
                    className="w-full p-2.5 ml-2 bg-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="px-4 ">
                <label for="deliverPhone" className="text-left block py-2 ">
                  Số điện thoại
                </label>
                <div className="flex items-center  border rounded-md">
                  <input
                    type="text"
                    id="deliverPhone"
                    name="deliverPhone"
                    value={informations.deliverPhone}
                    onChange={handleChange}
                    className="w-full p-2.5 ml-2 bg-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="px-4 ">
                <label for="deliverAddress" className="text-left block py-2 ">
                  Địa chỉ nhận hàng
                </label>
                <div className="flex items-center  border rounded-md">
                  <input
                    type="text"
                    id="deliverAddress"
                    name="deliverAddress"
                    value={informations.deliverAddress}
                    onChange={handleChange}
                    className="w-full p-2.5 ml-2 bg-transparent outline-none"
                  />
                </div>
              </div>
              <div className="px-4 ">
                <label for="paymentMethod" className="text-left block py-2 ">
                  Phương thức thanh toán
                </label>
                <div className="flex items-center  border rounded-md">
                  <select
                    name="paymentMethod"
                    value={informations.paymentMethod}
                    onChange={handleChange}
                    className=" block w-full px-3 text-base py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                  >
                    <option>Chọn phương thức thanh toán</option>
                    {payments.map((payment, index) => (
                      <option key={index} value={payment.id}>
                        {payment.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="px-4 ">
                <label for="deliverAddress" className="text-left block py-2 ">
                  Ghi chú
                </label>
                <textarea
                  id="note"
                  name="note"
                  value={informations.note}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="w-11/12 mt-5 h-auto p-[30px] bg-white rounded-[20px] shadow flex-col justify-start items-start gap-2.5 inline-flex">
            <div className="flex-col justify-start items-start gap-[30px] flex">
              <div className="w-full justify-start items-center gap-[177px] inline-flex">
                <div className="text-[#1a162e] text-[22px] font-medium font-['Gordita'] leading-loose">
                  2. Loại chuyển phát
                </div>
                <div className="justify-start items-start gap-2.5 flex">
                  <div className="w-6 h-6 p-[3px] justify-center items-center flex">
                    <div className="w-[18px] h-[18px] relative"></div>
                  </div>
                  <div className="text-[#1a162e] text-lg font-normal font-['Gordita'] leading-relaxed"></div>
                </div>
              </div>
            </div>

            <div className="w-11/12 h-px bg-[#d2d1d6]" />

            <div className="w-full h-[94px] p-5 bg-[#f6f6f6] rounded-[20px] flex-col justify-start items-start gap-2.5 inline-flex">
              <div className="w-full justify-start items-start gap-5 inline-flex">
                <img
                  className="w-[70px] h-[54px] rounded-[10px] shadow"
                  src="https://via.placeholder.com/70x54"
                />
                <div className="w-full h-[54px] justify-between items-center flex">
                  <div className="flex-col justify-start items-start gap-1 inline-flex">
                    <div className="text-[#1a162e] text-lg font-bold font-['Gordita'] leading-relaxed">
                      Chuyển phát thường
                    </div>
                    <div className="text-[#9e9da8] text-base font-normal font-['Gordita'] leading-normal">
                      Vận chuyển từ: 4-5 ngày làm việc
                    </div>
                    <div className="text-[#9e9da8] text-base font-normal font-['Gordita'] leading-normal"></div>
                  </div>
                  <div className="justify-start items-center gap-3.5 flex">
                    <div className="text-right text-[#1a162e] text-lg font-medium font-['Gordita'] leading-relaxed">
                      15.000 VNĐ
                    </div>
                    <div className="w-6 h-6 p-[2.75px] justify-center items-center flex">
                      <div className="w-[18.50px] h-[18.50px] relative">
                        <input
                          checked={
                            paymentMethod.paymentMethod === "Chuyển phát thường"
                          }
                          onClick={() =>
                            setPaymentMethod({
                              paymentMethod: "Chuyển phát thường",
                              fee: 15000,
                            })
                          }
                          id="green-checkbox"
                          type="checkbox"
                          value=""
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-[94px] p-5 bg-[#f6f6f6] rounded-[20px] flex-col justify-start items-start gap-2.5 inline-flex">
              <div className="w-full justify-start items-start gap-5 inline-flex">
                <img
                  className="w-[70px] h-[54px] rounded-[10px] shadow"
                  src="https://via.placeholder.com/70x54"
                />
                <div className="w-full h-[54px] justify-between items-center flex">
                  <div className="flex-col justify-start items-start gap-1 inline-flex">
                    <div className="text-[#1a162e] text-lg font-bold font-['Gordita'] leading-relaxed">
                      Chuyển phát nhanh
                    </div>
                    <div className="text-[#9e9da8] text-base font-normal font-['Gordita'] leading-normal">
                      Vận chuyển từ: 2-3 ngày làm việc
                    </div>
                    <div className="text-[#9e9da8] text-base font-normal font-['Gordita'] leading-normal"></div>
                  </div>
                  <div className="justify-start items-center gap-3.5 flex">
                    <div className="text-right text-[#1a162e] text-lg font-medium font-['Gordita'] leading-relaxed">
                      50.000 VNĐ
                    </div>
                    <div className="w-6 h-6 p-[2.75px] justify-center items-center flex">
                      <div className="w-[18.50px] h-[18.50px] relative">
                        <input
                          checked={
                            paymentMethod?.paymentMethod === "Chuyển phát nhanh"
                          }
                          onClick={() =>
                            setPaymentMethod({
                              paymentMethod: "Chuyển phát nhanh",
                              fee: 50000,
                            })
                          }
                          id="green-checkbox"
                          type="checkbox"
                          value=""
                          className="w-4 h-4 "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-[94px] p-5 bg-[#f6f6f6] rounded-[20px] flex-col justify-start items-start gap-2.5 inline-flex">
              <div className="w-full justify-start items-start gap-5 inline-flex">
                <img
                  className="w-[70px] h-[54px] rounded-[10px] shadow"
                  src="https://via.placeholder.com/70x54"
                />
                <div className="w-full h-[54px] justify-between items-center flex">
                  <div className="flex-col justify-start items-start gap-1 inline-flex">
                    <div className="text-[#1a162e] text-lg font-bold font-['Gordita'] leading-relaxed">
                      Chuyển phát hoả tốc
                    </div>
                    <div className="text-[#9e9da8] text-base font-normal font-['Gordita'] leading-normal">
                      Vận chuyển từ: 24h
                    </div>
                    <div className="text-[#9e9da8] text-base font-normal font-['Gordita'] leading-normal"></div>
                  </div>
                  <div className="justify-start items-center gap-3.5 flex">
                    <div className="text-right text-[#1a162e] text-lg font-medium font-['Gordita'] leading-relaxed">
                      130.000 VNĐ
                    </div>
                    <div className="w-6 h-6 p-[2.75px] justify-center items-center flex">
                      <div className="w-[18.50px] h-[18.50px] relative">
                        <input
                          checked={
                            paymentMethod.paymentMethod ===
                            "Chuyển phát hoả tốc"
                          }
                          onClick={() =>
                            setPaymentMethod({
                              paymentMethod: "Chuyển phát hoả tốc",
                              fee: 130000,
                            })
                          }
                          id="green-checkbox"
                          type="checkbox"
                          value=""
                          className="w-4 h-4 "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <div className="w-full  p-5 bg-[#f6f6f6] rounded-[20px] flex justify-between items-center gap-x-5  mb-2">
            <div className="">
              {/* <input
                      // ref={refVoucher}
                      // onChange={(e) => setCodeVoucher(e.target.value)}
                      // value={codeVoucher}
                      className="ádas"
                      type="text"
                    /> */}
              <input
                type="text"
                id="voucher"
                name="voucher"
                value={usingVoucher}
                placeholder="Nhập mã voucher"
                onChange={(e) => setUsingVoucher(e.target.value)}
                className="p-2 w-full h-[50px]  ml-2 border-spacing-1"
              />
            </div>
            <div className=" w-[150px] ">
              <button
                onClick={() => checkVoucher()}
                className=" w-full h-[50px] bg-blue-500 text-[17px] text-white rounded-md shadow hover:bg-blue-600"
              >
                áp dụng
              </button>
            </div>
          </div>

          <div className="w-full  p-5 bg-[#f6f6f6] rounded-[20px] flex-col justify-start items-start gap-2.5 inline-flex">
            <div className=" flex-col justify-start items-start gap-[30px] inline-flex">
              <div className="flex-col justify-start items-start gap-5 flex">
                <div className="w-[321px] justify-between items-start inline-flex">
                  <div>
                    <span>Tổng sản phẩm </span>
                  </div>
                  <div className="text-right text-[#1a162e] text-base font-bold font-['Gordita'] leading-normal">
                    {carts.cartsCheck?.length ? carts.cartsCheck.length : 0}
                  </div>
                </div>
                <div className="w-[321px] justify-between items-start inline-flex">
                  <div>
                    <span>Tổng tiền </span>
                  </div>
                  <div className="text-right text-[#1a162e] text-base font-bold font-['Gordita'] leading-normal">
                    {(
                      carts.totalEstimate +
                      (carts?.voucher ? carts?.voucher.value : 0)
                    ).toLocaleString("vi-VN")}{" "}
                    VNĐ
                  </div>
                </div>
                <div className="w-[321px] justify-between items-start inline-flex">
                  <div className="text-[#1a162e] text-base font-medium font-['Gordita'] leading-normal">
                    Phí vận chuyển
                  </div>
                  <div className="text-right text-[#1a162e] text-base font-bold font-['Gordita'] leading-normal">
                    {paymentMethod.fee.toLocaleString("vi-VN")} VNĐ
                  </div>
                </div>
                <div className="w-[321px] justify-between items-start inline-flex">
                  <div className="text-[#1a162e] text-base font-medium font-['Gordita'] leading-normal">
                    Giảm giá
                  </div>
                  <div className="text-right text-[#1a162e] text-base font-bold font-['Gordita'] leading-normal">
                    -{" "}
                    {voucherObject
                      ? voucherObject?.value.toLocaleString("vi-VN")
                      : 0}{" "}
                    VNĐ
                  </div>
                </div>
                <div className="w-[321px] h-px bg-[#ededf6]" />
                <div className="w-[321px] justify-between items-start inline-flex">
                  <div className="text-[#1a162e] text-base font-medium font-['Gordita'] leading-normal">
                    Tổng tiền thanh toán
                  </div>
                  <div className="text-right text-[#1a162e] text-base font-bold font-['Gordita'] leading-normal">
                    {(
                      carts.totalEstimate +
                      paymentMethod.fee -
                      (voucherObject?.value || 0)
                    ).toLocaleString("vi-VN")}{" "}
                    VNĐ
                  </div>
                </div>
              </div>
              <div
                onClick={() => handleSubmit()}
                className="cursor-pointer w-[321px]  py-[28px] bg-[#ffb700] rounded-[10px] justify-center items-center gap-2.5 inline-flex"
              >
                <div className="text-right text-[#1a162e] text-[22px] font-medium font-['Gordita'] leading-loose">
                  Thanh toán{" "}
                  {(
                    carts.totalEstimate +
                    paymentMethod.fee -
                    (voucherObject?.value || 0)
                  ).toLocaleString("vi-VN")}{" "}
                  VNĐ
                </div>
              </div>
            </div>
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
    </div>
  );
};

export default Payment;
