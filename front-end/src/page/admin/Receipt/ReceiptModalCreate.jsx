import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  GetAllSupplierAPI,
  GetDetailSupplierAPI,
} from "~/services/SupplierService";
import { useDispatch, useSelector } from "react-redux";
import {
  clearDataSupplier,
  initDataSupplier,
} from "~/redux/features/Suppliers/suppliersSlice";
import { HandleApiError } from "~/Utils/HandleApiError";
import { CreateReceiptAPI } from "~/services/ReceiptServer";
import { toast } from "react-toastify";
import { addReceipt, initDataReceipt } from "~/redux/features/Receipts/ReceiptsSlice";

export const ReceiptModalCreate = () => {
  const dispatch = useDispatch();
  const dataSupplier = useSelector((item) => item.suppliers.data).filter(
    (item) => item.detailSupplier.length > 0
  );
  const [supplier, setSupplier] = useState();
  const [detailSupplier, setDetailSupplier] = useState();

  const [dataForm, setDataForm] = useState([
    {
      id: 0,
      productAttributeId: "",
      price: 0,
      quantity: 0,
    },
  ]);

  const handleIncreaseDataForm = () => {
    const newDataForm = [...dataForm];
    newDataForm.push({
      id: newDataForm.length,
      productAttributeId: "",
      price: 0,
      quantity: 0,
    });
    setDataForm(newDataForm);
  };

  const handleDecreaseDataForm = () => {
    if (dataForm.length > 1) {
      setDataForm(dataForm.slice(0, -1));
    }
  };

  const handleChoseSupplier = async (e) => {
    console.log(dataForm);
    console.log(e.target.value);
    setSupplier(e.target.value);
    try {
      const response = await GetDetailSupplierAPI(e.target.value);
      if (response.data && response.status === 200) {
        setDetailSupplier(response.data[0].detailSupplier);
        console.log(response.data[0].detailSupplier);
      }
    } catch (error) {
      const { message, status } = HandleApiError(error);
      if (status === "error") {
        //  dispatch(initDataAccount({ error: message }));
      }
    }
  };

  const handleChoseProduct = (index, e) => {
    const selectedId = e.target.value;
    const selectedItem = detailSupplier.find(
      (item) => item.productAttribute.id === selectedId
    );

    // Cập nhật dữ liệu cho hàng dựa trên chỉ mục `index`
    setDataForm((prevDataForm) =>
      prevDataForm.map((row, i) =>
        i === index
          ? {
              ...row,
              productAttributeId: selectedId,
              price: selectedItem?.price || 0, // Thiết lập giá khi chọn sản phẩm
            }
          : row
      )
    );
  };

  const handleQuantityChange = (idx, e) => {
    const quantity = parseInt(e.target.value) || 0;

    // Cập nhật quantity cho hàng dựa trên chỉ mục `idx`
    setDataForm((prevDataForm) =>
      prevDataForm.map((row, i) => (i === idx ? { ...row, quantity } : row))
    );
  };

  const handleImportWarehouse = async () => {
    try {
      const response = await CreateReceiptAPI({
        supplierId: supplier,
        importReceiptDetails: dataForm.map((item) => ({
          productAttributeId: item.productAttributeId,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      if (response && response.data) {
        dispatch(addReceipt(response.data));
        toast.success("Tạo phiếu nhập thành công.");
      }
    } catch (error) {
       const { message, status } = HandleApiError(error);
       if (status === "error") {
         dispatch(initDataReceipt({ error: message }));
       }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(clearDataSupplier());
      try {
        let queryParams = "";
        const response = await GetAllSupplierAPI(queryParams);
        console.log(response.data);
        if (response.data && response.status === 200) {
          dispatch(initDataSupplier(response.data));
        }
      } catch (error) {
        const { message, status } = HandleApiError(error);
        if (status === "error") {
          dispatch(initDataSupplier({ error: message }));
        }
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <Dialog.Root>
      {/* title button */}
      <Dialog.Trigger className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm">
        Nhập hàng
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
        {/* chỉnh kính thước modal ở max-w-lg các option [max-w-xl,max-w-2xl, max-w-3xl... ] */}
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              {/* title modal */}
              <Dialog.Title className="text-lg font-medium text-gray-800 ">
                Tạo phiếu nhập hàng
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
            <Dialog.Description className="space-y-2 p-4 text-[15.5px] leading-relaxed text-gray-500">
              <div className="grid grid-rows-1 ">
                <div className="top">
                  <div className="">
                    <label className="text-gray-600">Chọn nhà cung cấp</label>
                    <div className="relative max-w-xs text-gray-500">
                      <div className="relative w-72 max-w-full ">
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
                          onClick={(e) => handleChoseSupplier(e)}
                          className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2"
                        >
                          {dataSupplier &&
                            dataSupplier.map((item) => {
                              return (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-11/12 mx-auto h-[1px] bg-stone-600 mt-5"></div>
                <div className=" ">
                  <div className="relative mt-3 shadow-sm border rounded-lg overflow-x-auto">
                    <table className=" w-full table-auto text-sm text-left">
                      <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                        <tr className="divide-x">
                          <th className="py-2 px-6">Tên sản phẩm</th>
                          <th className="py-2 px-6">Giá nhập</th>
                          <th className="py-2 px-6">Số lượng nhập</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 divide-y">
                        {dataForm.map((item, index) => (
                          <tr key={index} className="divide-x ">
                            <td className="w-full">
                              <div className="relative w-full max-w-xs ">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="absolute top-0 bottom-0 w-5 h-5 my-auto text-gray-400 right-3"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <select
                                  onChange={(e) => handleChoseProduct(index, e)}
                                  className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2"
                                >
                                  {detailSupplier &&
                                    detailSupplier.map((detail) => (
                                      <option
                                        key={detail.id}
                                        value={detail.productAttribute.id}
                                      >
                                        {detail.productAttribute.products?.name}{" "}
                                        | loại{" "}
                                        {
                                          detail.productAttribute.attributes
                                            ?.name
                                        }
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </td>
                            <td className="">
                              <div className="flex justify-start ">
                                <input
                                  type="text"
                                  value={item.price || ""}
                                  readOnly
                                  className="w-42 pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                />
                              </div>
                            </td>
                            <td className="">
                              <div className="flex justify-start ">
                                <input
                                  onChange={(e) =>
                                    handleQuantityChange(index, e)
                                  }
                                  type="number"
                                  placeholder="Nhập số lượng"
                                  className="w-42 pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
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
                  onClick={() => handleImportWarehouse()}
                  className="px-6 py-2 text-base text-white bg-indigo-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2 "
                >
                  Tạo
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
