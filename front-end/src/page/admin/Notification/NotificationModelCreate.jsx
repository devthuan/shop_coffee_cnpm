import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";
import { GetAllRole } from "~/services/PermissionService";
import { clearDataRole, initDataRole } from "~/redux/features/Roles/rolesSilce";
import { HandleApiError } from "~/Utils/HandleApiError";
import { CreateNotificationAPI } from "~/services/NotificationServer";
import { addNotification } from "~/redux/features/Notifications/NotificationsSilce";
import { toast } from "react-toastify";

export const NotificationModelCreate = () => {
  const dispatch = useDispatch();
  const listRoles = useSelector((state) => state.roles.data);

  const [typeSend, setTypeSend] = useState("all");
  const [formData, setFormData] = useState({
    roleId: "",
    email: "",
    title: "",
    content: "",
  });

  const listOptionTypeSend = [
    { value: "all", label: "Gửi đến tất cả" },
    { value: "user", label: "Gửi đến người dùng theo email" },
    { value: "role", label: "Gửi đến người dùng theo quyền" },
  ];

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreate = async () => {
    const newFormData = { ...formData, typeSend };

    try {
      const response = await CreateNotificationAPI(newFormData);
      if (response && response.status === 201) {
        dispatch(addNotification(response.data));
        toast.success("Tạo mới thông báo thành công.");
        setFormData({ roleId: "", email: "", title: "", content: "" });
        setTypeSend("all");
      }
    } catch (error) {
      console.log(error);
      const { message, status } = HandleApiError(error);
      if (status === "error") {
        //  dispatch(initDataRole({ error: message }));
      }
    }
  };

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await GetAllRole("limit=10");
        if (response && response.data && response.status === 200) {
          dispatch(initDataRole(response.data));
        }
      } catch (error) {
        console.log(error);
        const { message, status } = HandleApiError(error);
        if (status === "error") {
          // dispatch(initDataRole({ error: message }));
        }
      }
    };

    // dispatch(clearDataRole());

    if (!listRoles || listRoles.length === 0) {
      fetchAPI();
    }
  }, [dispatch]);

  return (
    <Dialog.Root>
      {/* title button */}
      <Dialog.Trigger className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm">
        Tạo mới thông báo
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
        {/* chỉnh kính thước modal ở max-w-lg các option [max-w-xl,max-w-2xl, max-w-3xl... ] */}
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-xl mx-auto px-4">
          <div className="bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              {/* title modal */}
              <Dialog.Title className="text-lg font-medium text-gray-800 ">
                Tạo mới thông báo
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
              <div className="grid grid-cols-2 gap-5">
                <div className="">
                  <label className="text-gray-600">Gửi đến</label>
                  <div className="relative w-72 max-w-full mx-auto ">
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
                      onChange={(e) => setTypeSend(e.target.value)}
                      value={typeSend}
                      className="w-full px-3 py-2 mt-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2"
                    >
                      {listOptionTypeSend &&
                        listOptionTypeSend.map((item) => {
                          return (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
                {typeSend === "role" ? (
                  <div className="">
                    <label className="text-gray-600">Quyền</label>
                    <div className="relative w-72 max-w-full mx-auto ">
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
                        onChange={(e) => handleOnchange(e)}
                        value={formData.roleId || "Chọn quyền"}
                        name="roleId"
                        className="w-full px-3 py-2 mt-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2"
                      >
                        {listRoles &&
                          listRoles.map((item) => {
                            return (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {typeSend === "user" ? (
                  <div>
                    <label className="text-gray-600">Email người dùng</label>
                    <div className="relative max-w-xs">
                      <input
                        onChange={(e) => handleOnchange(e)}
                        value={formData.email}
                        type="text"
                        name="email"
                        placeholder="Nhập email người dùng"
                        className="w-full px-3 py-2 mt-2 text-sm text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                      />
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div>
                <label className="text-gray-600">Tiêu đề</label>
                <div className="relative max-w-full">
                  <input
                    onChange={(e) => handleOnchange(e)}
                    value={formData.title}
                    type="text"
                    name="title"
                    className="w-full px-3 py-2 mt-2 text-sm text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label
                  for="message"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nội dung
                </label>
                <textarea
                  onChange={(e) => handleOnchange(e)}
                  value={formData.content}
                  name="content"
                  id="message"
                  rows="4"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Nhập nội dung vào đây..."
                ></textarea>
              </div>
            </Dialog.Description>
            <div className="flex justify-end items-center gap-3 p-4 border-t">
              <Dialog.Close asChild>
                <button
                  onClick={handleCreate}
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
