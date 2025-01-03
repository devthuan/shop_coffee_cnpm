import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import React from "react";
import { toast } from "react-toastify";
import { ResetPasswordAPI, UpdateAccountAPI } from "~/services/AccountService";
import { useDispatch, useSelector } from "react-redux";
import { updateAccount } from "~/redux/features/Accounts/accountsSilce";
import { HandleApiError } from "~/Utils/HandleApiError";
import { clearDataRole, initDataRole } from "~/redux/features/Roles/rolesSilce";
import { GetAllRole } from "~/services/PermissionService";
const ModelEditAccount = ({ data }) => {
  const dispatch = useDispatch();
  const dataRole = useSelector((item) => item.roles.data);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    userName: "",
    role: "",
    balance: "",
    ip: "",
    typeLogin: "",
    status: "",
    updated_at: "",
    deleted_at: "",
    created_at: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmitUpdate = async () => {
    try {
      const findRole = dataRole.filter(
        (role) => role.codeName === formData.role
      );
      const response = await UpdateAccountAPI(formData.id, {
        userName: formData.userName,
        role: formData.role,
      });
      if (response && response.data) {
        const { statusCode, status, message } = response.data;
        if (statusCode === 200 && status === "success") {
          dispatch(
            updateAccount({
              id: formData.id,
              userName: formData.userName,
              role: findRole[0],
            })
          );
          toast.success(message);
        }
      }
    } catch (err) {
      const result = HandleApiError(err);
      result
        ? toast.error(result)
        : toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleResetPassword = async () => {
    if (isProcessing) return; // Prevent further clicks during processing

    setIsProcessing(true); // Start processing

    try {
      const response = await ResetPasswordAPI(formData.id);

      if (response && response.data) {
        const { statusCode, status, message, data } = response.data;
        if (statusCode === 200 && status === "success") {
          toast.success(message);
          setIsProcessing(false);
        } else if (statusCode === 400 && status === "error") {
          toast.error(message);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      const result = HandleApiError(err);
      result
        ? toast.error(result)
        : toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };
  useEffect(() => {
    const fetchAPI = async () => {
      dispatch(clearDataRole());
      try {
        const response = await GetAllRole("");
        if (response && response.data && response.status === 200) {
          dispatch(initDataRole(response.data));
        }
      } catch (error) {
        console.log(error);
        const result = HandleApiError(error);
        result
          ? toast.error(result)
          : toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    };
    if (!dataRole && dataRole.length === 0) {
      fetchAPI();
    }
  }, [dispatch]);

  useEffect(() => {
    setFormData({
      id: data.id,
      email: data.email,
      userName: data.userName,
      role: data.role.codeName,
      balance: data.balance,
      ip: data.ip,
      typeLogin: data.typeLogin,
      status: data.isActive,
      lastLogin: data.lastLogin,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
      createdAt: data.createdAt,
    });
  }, []);

  return (
    <Dialog.Root>
      <Dialog.Trigger className=" py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg">
        Sửa
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />

        <Dialog.Content className=" fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between p-1 pl-4 border-b">
              <Dialog.Title className="text-lg font-medium text-gray-800 ">
                Chỉnh sửa tài khoản
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
            <Dialog.Description className="space-y-2 p-4 mt-3 text-[15.5px] leading-relaxed text-gray-500">
              <div className="grid grid-cols-3 gap-5">
                <div>
                  <label className="text-gray-600">ID</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="id"
                      value={formData.id}
                      className="w-full pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Email</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="email"
                      value={formData.email}
                      className="w-full pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Username</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      onChange={handleInputChange}
                      type="text"
                      name="userName"
                      value={formData.userName}
                      className="w-full pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-600 select ">Quyền</label>
                  <select
                    onChange={handleInputChange}
                    name="role"
                    value={formData.role}
                    className="w-full pr-2 pl-3 py-2 mt-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  >
                    {dataRole &&
                      dataRole.length > 0 &&
                      dataRole.map((item) => {
                        return (
                          <option key={item.codeName} value={item.codeName}>
                            {item.name}
                          </option>
                        );
                      })}
                  </select>
                </div>

                <div>
                  <label className="text-gray-600">Số dư</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="balance"
                      value={formData.balance}
                      className="w-full pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">IP</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="ip"
                      value={formData.ip}
                      className="w-full pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Kiểu đăng nhập</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="typeLogin"
                      value={formData.typeLogin}
                      className="w-full pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Trạng thái</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="status"
                      value={formData.status ? "active" : "inactive"}
                      className="w-full pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Đăng nhập cuối</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="lastLogin"
                      value={new Date(formData.lastLogin).toLocaleString()}
                      className="w-full pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
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
                      className="w-full pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Ngày cập nhật cuối</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="updatedAt"
                      value={new Date(formData.updatedAt).toLocaleString()}
                      className="w-full pr-2 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <label className="text-gray-600">Cung cấp mật khẩu</label>
                  <div className="relative max-w-xs mt-2">
                    <button
                      onClick={() => handleResetPassword()}
                      className="px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg duration-150 hover:bg-indigo-100 active:bg-indigo-200"
                    >
                      {isProcessing ? "Đang sử lý..." : "Cấp mật khẩu mới"}
                    </button>
                  </div>
                </div>
              </div>
            </Dialog.Description>
            <div className="flex justify-end items-center gap-3 p-4 border-t">
              <Dialog.Close asChild>
                <button
                  onClick={() => handleSubmitUpdate()}
                  className="px-3 py-1 t text-xl text-white bg-green-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2 "
                >
                  Cập nhật
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  className="px-3 py-1 text-xl text-gray-800 border rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
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

export default ModelEditAccount;
