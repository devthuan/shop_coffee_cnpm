import React, { useState, useEffect, Fragment } from "react";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AddBill } from "~/services/BillService";
import { HandleApiError } from "~/Utils/HandleApiError";
import { useSelector, useDispatch } from "react-redux";
import { GetAllPaynment } from "~/services/PaynmentService";
import { initDataPayment } from "~/redux/features/Payments/paymentsSlice";
import { useNavigate } from "react-router-dom";
import { validatePaymentData } from "~/Utils/ValidatePayment";
const Paynment = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const payments = useSelector(state => state.payments.data)
  const location = useLocation();
  const carts = location.state || {};
  console.log(carts)
  const [informations, setInformations] = useState({
    fullName: "",
    deliverAddress: "",
    deliverPhone: "",
    shippingMethod: "",
    paymentMethod: "",
    note: "",
    voucher: carts.codeVoucher ? carts.codeVoucher : "",
    products: carts.cartsCheck.map((cart) => ({
      productAttributeId: cart.productAttributes.id,
      quantity: cart.quantity,
    })),
  });

  const [errors, setErrors] = useState({
    fullName: "",
    deliverAddress: "",
    deliverPhone: "",
    shippingMethod: "",
    paymentMethod: "",
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
    fetchData()
  }, []);


  console.log(informations.paymentMethod)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInformations((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);

  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const response = await AddBill(informations)
      console.log(response)
      if (response && response.status === 201) {
        toast.success("Thanh toán thành công")
        setTimeout(() => {
          navigate("/")
        }, 2500)
      }
    }
    catch (error) {
      const result = HandleApiError(error);
      if (result) {
        toast.error(result);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Tên người dùng */}
        <div className="flex items-center space-x-4">
          <label htmlFor="fullName" className="block w-1/3 text-sm font-medium text-gray-700">
            Tên người dùng
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={informations.fullName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Địa chỉ */}
        <div className="flex items-center space-x-4">
          <label htmlFor="deliverAddress" className="block w-1/3 text-sm font-medium text-gray-700">
            Địa chỉ
          </label>
          <input
            type="text"
            id="deliverAddress"
            name="deliverAddress"
            value={informations.deliverAddress}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Số điện thoại */}
        <div className="flex items-center space-x-4">
          <label htmlFor="deliverPhone" className="block w-1/3 text-sm font-medium text-gray-700">
            Số điện thoại
          </label>
          <input
            type="tel"
            id="deliverPhone"
            name="deliverPhone"
            value={informations.deliverPhone}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Phương thức vận chuyển */}
        <div className="flex items-center space-x-4">
          <label htmlFor="shippingMethod" className="block w-1/3 text-sm font-medium text-gray-700">
            Phương thức vận chuyển
          </label>
          <select
            id="shippingMethod"
            name="shippingMethod"
            value={informations.shippingMethod}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="Vận chuyển siuu tốc">Vận chuyển siuu tốc</option>
            <option value="Vận chuyển từ 2-3 ngày">Vận chuyển từ 2-3 ngày</option>
          </select>
        </div>

        {/* Ghi chú */}
        <div className="flex items-start space-x-4">
          <label htmlFor="note" className="block w-1/3 text-sm font-medium text-gray-700">
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

        {/* Phương thức thanh toán */}
        <div className="flex items-center space-x-4">
          <label htmlFor="paymentMethod" className="block w-1/3 text-sm font-medium text-gray-700">
            Phương thức thanh toán
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={informations.paymentMethod}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {payments && payments.length > 0 ? (
              <Fragment>
                <option>Chọn phương thức thanh toán</option>
                {payments.map((payment, index) => (
                  <option key={index} value={payment.id}>{payment.name}</option>
                ))}
              </Fragment>
            ) :
              <option>Chọn phương thức thanh toán</option>
            }
          </select>
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

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Paynment;
