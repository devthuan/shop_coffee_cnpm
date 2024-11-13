import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { UpdateSupplierAPI } from "~/services/SupplierService";
import { HandleApiError } from "~/Utils/HandleApiError";
import { toast } from "react-toastify";

export const SupplierModelEdit = ({ data }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phone: "",
    address: "",
    email: "",
    description: "",
    updatedAt: null,
    createdAt: "",
    detailSupplier: [],
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdatePrice = (e, item) => {
    const updatedDetailSupplier = formData.detailSupplier.map((a) =>
      a.id === item.id
        ? { ...a, price: e.target.value } // Update the price for the matched item
        : a
    );

    setFormData({
      ...formData,
      detailSupplier: updatedDetailSupplier, // Update the state with the new array
    });
  };

  const handleBtnUpdate = async () => {
    console.log(formData);

    const formatData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      description: formData.description,
      detailSuppliers: formData.detailSupplier.map((item) => ({
        price: item.price,
        productAttributeId: item.productAttribute.id,
      })),
    };

    try {
      const response = await UpdateSupplierAPI(formData.id, formatData);
      if (response && response.status === 200) {
        // dispatch(addSupplier(response.data));
        toast.success("Cập nhật nhà cung cấp thành công.");
      }
    } catch (error) {
      const { message, status } = HandleApiError(error);
      if (status === "error") {
        //  dispatch(initDataRole({ error: message }));
      }
    }
  };

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, []);

  return (
    <Dialog.Root>
      {/* title button */}
      <Dialog.Trigger>Edit</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
        {/* chỉnh kính thước modal ở max-w-lg các option [max-w-xl,max-w-2xl, max-w-3xl... ] */}
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              {/* title modal */}
              <Dialog.Title className="text-lg font-medium text-gray-800 ">
                Create item
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
              <div className="grid grid-cols-3 gap-5">
                <div>
                  <label className="text-gray-600">ID</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly={true}
                      type="text"
                      name="id"
                      value={formData.id}
                      className="w-full cursor-default pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-600">Tên nhà cung cấp</label>
                  <div className="relative max-w-full mt-2">
                    <input
                      onChange={(e) => handleInputChange(e)}
                      type="text"
                      name="name"
                      value={formData.name}
                      className="w-full pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Email</label>
                  <div className="relative max-w-full mt-2">
                    <input
                      onChange={(e) => handleInputChange(e)}
                      type="text"
                      name="email"
                      value={formData.email}
                      className="w-full pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Số điện thoại</label>
                  <div className="relative max-w-full mt-2">
                    <input
                      onChange={(e) => handleInputChange(e)}
                      type="text"
                      name="phone"
                      value={formData.phone}
                      className="w-full pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Địa chỉ</label>
                  <div className="relative max-w-full mt-2">
                    <input
                      onChange={(e) => handleInputChange(e)}
                      type="text"
                      name="address"
                      value={formData.address}
                      className="w-full pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Mô tả</label>
                  <div className="relative max-w-full mt-2">
                    <input
                      onChange={(e) => handleInputChange(e)}
                      type="text"
                      name="description"
                      value={formData.description}
                      className="w-full pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Ngày tạo</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly={true}
                      type="text"
                      name="id"
                      value={new Date(formData.createdAt).toLocaleString()}
                      className="w-full cursor-default pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Ngày cập nhật cuối</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly={true}
                      type="text"
                      name="id"
                      value={new Date(formData.updatedAt).toLocaleString()}
                      className="w-full cursor-default pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="">
                <table className=" w-full table-auto text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                    <tr className="divide-x">
                      <th className="py-2 px-6">Tên sản phẩm</th>
                      <th className="py-2 px-6">Giá nhập</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 divide-y">
                    {formData?.detailSupplier?.map((item, index) => (
                      <tr key={index} className="divide-x ">
                        <td className="">
                          <div className="  ">
                            <input
                              value={item.productAttribute.products.name}
                              type="text"
                              placeholder="Nhập giá nhập"
                              className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                          </div>
                        </td>
                        <td className="">
                          <div className="  ">
                            <input
                              onChange={(e) => handleUpdatePrice(e, item)}
                              value={item.price}
                              type="text"
                              placeholder="Nhập giá nhập"
                              className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                          </div>
                        </td>
                        <td className="">
                          <button className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg cursor-pointer">
                            Xoá
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Dialog.Description>
            <div className="flex justify-end items-center gap-3 p-4 border-t">
              <Dialog.Close asChild>
                <button
                  onClick={() => handleBtnUpdate()}
                  className="px-6 py-2 text-base text-white bg-indigo-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2 "
                >
                  Update
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
