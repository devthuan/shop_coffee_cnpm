import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { HandleApiError } from "~/Utils/HandleApiError";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { UpdateAttribute } from "~/services/AttributeService";
import { updateAttribute } from "~/redux/features/Attributes/attributesSlice";
import { validateAttribute } from "~/Utils/Attribute/validateAttribute";
export const ModalEditAttribute = ({ data }) => {
  const dispatch = useDispatch();
  const [formData, setFromData] = useState({
    // id: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    if (data) {
      setFromData({
        // id: data.id,
        name: data.name,
        description: data.description,
      });
    }
  }, [data]);

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    setFromData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateAttribute = async (e) => {
    e.preventDefault();
    const attributeData = {
      // id : formData.id,
      name: formData.name,
      description: formData.description,
    };

    if(!validateAttribute(attributeData))
    {
      return;
    }
    try {
      const response = await UpdateAttribute(data.id, attributeData);
      console.log(response);
      if (response && response.status === 200) {
        dispatch(updateAttribute({ id: data.id, ...attributeData }));
        toast.success("Chỉnh sửa thể loại thành công");
      }
    } catch (error) {
      const result = HandleApiError(error);
      console.log(result);
      if (result) {
        toast.error(result.message);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    }
  };

  return (
    <Dialog.Root>
      {/* title button */}
      <Dialog.Trigger>Sửa</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
        {/* chỉnh kính thước modal ở max-w-lg các option [max-w-xl,max-w-2xl, max-w-3xl... ] */}
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4">
          <div className="bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              {/* title modal */}
              <Dialog.Title className="text-lg font-medium text-gray-800 ">
                Chỉnh sửa thuộc tính
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
              <form>
                <div>
                  {/* <div className="mb-4 flex items-center">
                    <label className="block text-nowrap text-sm font-medium text-gray-700 pr-6">
                      Id sản phẩm
                    </label>
                    <input
                      readOnly
                      type="text"
                      className="mt-1 block text-[17px] w-full border border-gray-300 rounded-md p-2"
                      required
                      value={formData.id}
                    />
                  </div> */}

                  <div className="mb-4 flex items-center">
                    <label className="block text-nowrap text-sm font-medium text-gray-700 pr-4">
                      Tên thuộc tính
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="mt-1 block text-[17px] w-full border border-gray-300 rounded-md p-2"
                      required
                      value={formData.name}
                      onChange={handleChangeInput}
                    />
                  </div>

                  <div className="mb-4 flex items-center">
                    <label className="block text-sm text-nowrap pr-2 font-medium text-gray-700">
                      Mô tả thuộc tính
                    </label>
                    <textarea
                      className="mt-1 text-[17px] block w-full border border-gray-300 rounded-md p-2"
                      required
                      name="description"
                      onChange={handleChangeInput}
                      value={formData.description}
                    ></textarea>
                  </div>
                  <div className="flex justify-end items-center gap-3 p-4 border-t">
                    <button
                      onClick={handleUpdateAttribute}
                      type="submit"
                      className="px-6 py-2 text-base text-white bg-indigo-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
                    >
                      Accept
                    </button>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="px-6 py-2 text-base text-gray-800 border rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
                        aria-label="Close"
                      >
                        Cancel
                      </button>
                    </Dialog.Close>
                  </div>
                </div>
              </form>
            </Dialog.Description>
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
