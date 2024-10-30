import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { HandleApiError } from "~/Utils/HandleApiError";
import { toast } from "react-toastify";
import { UpdateNotificationAPI } from "~/services/NotificationServer";
import { useDispatch } from "react-redux";
import { updateNotification } from "~/redux/features/Notifications/NotificationsSilce";

export const TemplateModelEdit = ({ data }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //  hàm xử lý sự kiện cập nhật
  const handleBtnUpdate = async () => {
    console.log(formData);
    try {
      const response = await UpdateNotificationAPI(formData.id, {
        title: formData.title,
        content: formData.content,
      });

      console.log(response.data);
      if (response && response.status === 200) {
        dispatch(
          updateNotification({
            id: formData.id,
            title: formData.title,
            content: response.content,
          })
        );
        toast.success("Cập nhật thông báo thành công");
      }
    } catch (error) {
      const result = HandleApiError(error);
      result
        ? toast.error(result)
        : toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  useEffect(() => {
    setFormData(data);
  }, []);

  return (
    <Dialog.Root>
      {/* title button */}
      <Dialog.Trigger>Chi tiết</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
        {/* chỉnh kính thước modal ở max-w-lg các option [max-w-xl,max-w-2xl, max-w-3xl... ] */}
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              {/* title modal */}
              <Dialog.Title className="text-lg font-medium text-gray-800 ">
                Chỉnh sửa thông báo
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
              <div className="grid grid-cols-2 gap-5 ">
                <div>
                  <label className="text-gray-600">ID</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="id"
                      value={formData.id}
                      className="w-full cursor-default pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Người tạo</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="id"
                      value={formData?.account?.email}
                      className="w-full cursor-default pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Gửi đến</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="typeSend"
                      value={formData.typeSend}
                      className="w-full cursor-default pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-600">Ngày tạo</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="createdAt"
                      value={new Date(formData.createdAt).toLocaleString()}
                      className="w-full cursor-default pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Cập nhật cuối</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="updatedAt"
                      value={new Date(formData.updatedAt).toLocaleString()}
                      className="w-full cursor-default pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-gray-600">Tiêu đề</label>
                <div className="relative max-w-full mt-2">
                  <input
                    onChange={(e) => handleInputChange(e)}
                    type="text"
                    name="title"
                    value={formData.title}
                    className="w-full pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label
                  for="message"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nội dung
                </label>
                <textarea
                  onChange={(e) => handleInputChange(e)}
                  name="content"
                  id="message"
                  rows="4"
                  value={formData.content}
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Nhập nội dung vào đây..."
                ></textarea>
              </div>
            </Dialog.Description>
            <div className="flex justify-end items-center gap-3 p-4 border-t">
              <Dialog.Close asChild>
                <button
                  onClick={() => handleBtnUpdate()}
                  className="px-6 py-2 text-base text-white bg-indigo-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2 "
                >
                  Cập nhật
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
