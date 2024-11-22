import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { HandleApiError } from "~/Utils/HandleApiError";
import { useDispatch } from "react-redux";
import { CreatePaymentMethodAPI } from "~/services/PaynmentService";
import {
  addPaymentMethod,
  setErrorPaymentMethod,
} from "~/redux/features/Payments/paymentsSlice";
import { toast } from "react-toastify";

export const PaymentModelCreate = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
  });

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreate = async () => {
    try {
      const response = await CreatePaymentMethodAPI(formData);
      if (response && response.status === 201) {
        dispatch(addPaymentMethod(response.data));
        toast.success("Tạo mới thông báo thành công.");
        setFormData({});
      }
    } catch (error) {
      const { message, status } = HandleApiError(error);
      if (status === "error") {
        dispatch(setErrorPaymentMethod({ error: message }));
      }
    }
  };

  return (
    <Dialog.Root>
      {/* title button */}
      <Dialog.Trigger className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm">
        Create item
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
        {/* chỉnh kính thước modal ở max-w-lg các option [max-w-xl,max-w-2xl, max-w-3xl... ] */}
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4">
          <div className="bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              {/* title modal */}
              <Dialog.Title className="text-lg font-medium text-gray-800 ">
                Tạo mới phương thức thanh toán
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
              <div className="grid grid-cols-2 gap-5"></div>
              <div>
                <label className="text-gray-600">
                  Tên phương thức thanh toán
                </label>
                <div className="relative max-w-full">
                  <input
                    onChange={(e) => handleOnchange(e)}
                    value={formData.name}
                    type="text"
                    name="name"
                    className="w-full px-3 py-2 mt-2 text-sm text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  />
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
