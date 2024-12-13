import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";
import { GetAllInventory } from "~/services/InventoryService";
import { initDataInventory } from "~/redux/features/Inventories/inventoriesSilce";
import { HandleApiError } from "~/Utils/HandleApiError";
import { toast } from "react-toastify";
import {
  AddDetailSupplierAPI,
  CreateSupplierAPI,
  DeleteSupplierDetailAPI,
} from "~/services/SupplierService";
import {
  addSupplier,
  removeDetailSupplier,
} from "~/redux/features/Suppliers/suppliersSlice";

export const SupplierModelAddDetail = ({ data }) => {
  const dispatch = useDispatch();

  const inventoriesData = useSelector((item) => item.inventories.data);
  const [dataForm, setDataForm] = useState([
    {
      productAttributeId: "0",
      price: 0,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
  });

  const handleIncreaseDataForm = () => {
    const newDataForm = [...dataForm];
    newDataForm.push({
      id: newDataForm.length,
      productAttributeId: "",
      price: 0,
    });
    setDataForm(newDataForm);
  };

  const handleDecreaseDataForm = () => {
    if (dataForm.length > 1) {
      setDataForm(dataForm.slice(0, -1));
    }
  };

  const handleChoseProductAttribute = (e, index) => {
    const selectedId = e.target.value;

    // Cập nhật giá trị productAttributeId cho hàng tại index cụ thể
    setDataForm((prevDataForm) =>
      prevDataForm.map((row, i) =>
        i === index ? { ...row, productAttributeId: selectedId } : row
      )
    );
  };

  const handleQuantityChange = (idx, e) => {
    const price = parseInt(e.target.value) || 0;

    // Cập nhật price cho hàng dựa trên chỉ mục `idx`
    setDataForm((prevDataForm) =>
      prevDataForm.map((row, i) => (i === idx ? { ...row, price } : row))
    );
  };

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await DeleteSupplierDetailAPI(id);
      if (response && response.status === 200) {
        dispatch(removeDetailSupplier({ id }));
        setFormData({
          ...formData,
          detailSupplier: formData.detailSupplier.filter(
            (detail) => detail.id !== id
          ),
        });
        toast.success("Xóa sản phẩm khởi nhà cung cấp thành công.");

        // Reload the page to reflect the updated inventory
      }
    } catch (error) {
      console.log(error);
      const message = HandleApiError(error);
    }
  };

  const handleCreate = async () => {
    let formatData = dataForm.map((item) => ({
      ...item, // Spread existing properties of the object
      supplierId: data.id, // Add the `supplier` key with an object value
    }));

    try {
      // Send all API requests concurrently
      const responses = await Promise.all(
        formatData.map((element) => AddDetailSupplierAPI(element))
      );

      // Check if all responses are successful
      if (responses.every((res) => res.status === 201)) {
        // Dispatch the last response data (or handle appropriately)
        toast.success("Thêm sản phẩm cho nhà cung cấp thành công.");
        window.location.reload();
      } else {
        toast.error("Một số sản phẩm không được thêm thành công.");
      }
    } catch (error) {
      console.log(error);
      const message = HandleApiError(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let queryParams = `limit=${100}&page=${1}`;
        const response = await GetAllInventory(queryParams);
        if (response.status === 200 && response.data.data) {
          dispatch(initDataInventory(response.data));
          // laod false
        }
      } catch (error) {
        if (error.request) {
          dispatch(
            initDataInventory({ error: "Không có phản hồi từ server..." })
          );
        }
        const result = HandleApiError(error);
        result
          ? toast.error(result)
          : toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    };
    if (!inventoriesData || inventoriesData.length === 0) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, []);

  return (
    <Dialog.Root>
      {/* title button */}
      <Dialog.Trigger>thêm sản phẩm</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
        {/* chỉnh kính thước modal ở max-w-lg các option [max-w-xl,max-w-2xl, max-w-3xl... ] */}
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              {/* title modal */}
              <Dialog.Title className="text-lg font-medium text-gray-800 ">
                Thêm sản phẩm cho nhà cung cấp
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
              <div className="grid grid-rows-1 ">
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
                                value={`${item.productAttribute?.products.name} | ${item.productAttribute?.attributes.name}`}
                                type="text"
                                placeholder="Nhập giá nhập"
                                className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                              />
                            </div>
                          </td>
                          <td className="">
                            <div className="  ">
                              <input
                                // onChange={(e) => handleUpdatePrice(e, item)}
                                value={item.price}
                                type="text"
                                placeholder="Nhập giá nhập"
                                className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                              />
                            </div>
                          </td>
                          <td className="">
                            <button
                              onClick={() => handleDeleteProduct(item.id)}
                              className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg cursor-pointer"
                            >
                              Xoá
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="w-11/12 mx-auto h-[1px] bg-stone-600 mt-5"></div>
                <div className=" ">
                  <div className="relative mt-3 shadow-sm border rounded-lg overflow-x-auto">
                    <table className=" w-full table-auto text-sm text-left">
                      <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                        <tr className="divide-x">
                          <th className="py-2 px-6">Tên sản phẩm</th>
                          <th className="py-2 px-6">Giá nhập</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 divide-y">
                        {dataForm?.map((item, index) => (
                          <tr key={index} className="divide-x ">
                            <td className="">
                              <div className="relative w-full max-w-full ">
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
                                <select
                                  defaultValue=""
                                  onChange={(e) =>
                                    handleChoseProductAttribute(e, index)
                                  }
                                  className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2"
                                >
                                  <option value="" disabled>
                                    Chọn một sản phẩm
                                  </option>
                                  {inventoriesData &&
                                    inventoriesData.map((item) => {
                                      return (
                                        <option key={item.id} value={item.id}>
                                          {item.products.name} |{" "}
                                          {item.attributes.name}
                                        </option>
                                      );
                                    })}
                                </select>
                              </div>
                            </td>
                            <td className="">
                              <div className="flex justify-start ">
                                <input
                                  onChange={(e) =>
                                    handleQuantityChange(index, e)
                                  }
                                  type="text"
                                  placeholder="Nhập giá nhập"
                                  className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-end items-center">
                      <h1
                        onClick={() => handleDecreaseDataForm()}
                        className="  pr-3 text-[40px] text-red-600 cursor-pointer"
                      >
                        -
                      </h1>
                      <h1
                        onClick={() => handleIncreaseDataForm()}
                        className="  pr-3 text-[35px] text-green-600 cursor-pointer"
                      >
                        +
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Description>
            <div className="flex justify-end items-center gap-3 p-4 border-t">
              <Dialog.Close asChild>
                <button
                  onClick={() => handleCreate()}
                  className="px-6 py-2 text-base text-white bg-indigo-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2 "
                >
                  Tạo mới
                </button>
              </Dialog.Close>

              <Dialog.Close asChild>
                <button
                  className="px-6 py-2 text-base text-gray-800 border rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
                  aria-label="Close"
                >
                  Đóng
                </button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
