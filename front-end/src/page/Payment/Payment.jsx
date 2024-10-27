import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { AddBill } from "~/services/BillService";
import { HandleApiError } from "~/Utils/HandleApiError";
const Paynment = () => {
  const location = useLocation();
  const carts = location.state || {};
  console.log(carts)
  const [informations, setInformations] = useState({
    fullName: "",
    deliverAddress: "",
    deliverPhone: "",
    shippingMethod: "",
    paymentMethod: "1",
    note: "",
    voucher: carts.codeVoucher ? carts.codeVoucher : "",
    products: carts.cartsCheck.map((cart) => ({
      productAttributeId: cart.productAttributes.id,
      quantity: cart.quantity,
    })),
  });

  console.log(informations)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInformations((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     
    console.log(informations)
      const response = await AddBill(informations)
      console.log(response)
      if (response && response.status === 201) {
        toast.success("Thanh toán thành công")
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
            <option>Chọn phương thức thanh toán</option>
            <option value="1">Standard Shipping</option>
            <option value="1">Express Shipping</option>
            <option value="1">Overnight Shipping</option>
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
            <option value="1">Credit Card</option>
            <option value="1">PayPal</option>
            <option value="1">Bank Transfer</option>
          </select>
        </div>

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
