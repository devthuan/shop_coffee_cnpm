import * as Dialog from "@radix-ui/react-dialog";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Optional for showing success/error messages
import { CreateAccountAPI } from "~/services/AccountService";
import { useDispatch, useSelector } from "react-redux";
import { addAccount } from "~/redux/features/Accounts/accountsSilce";
import HalfRingLoading from "~/components/Loading/HalfRingLoading";
import { HandleApiError } from "~/Utils/HandleApiError";
import { GetAllRole } from "~/services/PermissionService";
import { clearDataRole, initDataRole } from "~/redux/features/Roles/rolesSilce";
const ModelAddAccount = () => {
  const dataRole = useSelector((item) => item.roles.data);
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const listInput = [
    {
      title: "Email",
      typeInput: "text",
      placeholder: "Enter your email address",
      fieldName: "email",
    },
    {
      title: "Username",
      typeInput: "text",
      placeholder: "Enter your username",
      fieldName: "username",
    },
    {
      title: "Password",
      typeInput: "password",
      placeholder: "Enter your password",
      fieldName: "password",
    },
    {
      title: "Confirm password",
      typeInput: "password",
      placeholder: "Confirm your password",
      fieldName: "confirmPassword",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const response = await CreateAccountAPI({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
      });

      if (response && response.data) {
        const { statusCode, status, message, data } = response.data;
        if (statusCode === 201 && status === "success") {
          dispatch(addAccount(data));
          toast.success(message);
          setFormData({
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            role: "client",
          });
          setIsProcessing(false);
        } else if (statusCode === 400 && status === "error") {
          toast.error(message);
        } else {
          toast.error(message);
        }
      }
      setIsProcessing(false);
    } catch (err) {
      console.log(err);
      const result = HandleApiError(err);
      result
        ? toast.error(result)
        : toast.error("Có lỗi xảy ra, vui lòng thử lại");

      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const fetchAPI = async () => {
      dispatch(clearDataRole());
      try {
        let queryParams = "";
        const response = await GetAllRole(queryParams);
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

    if (dataRole.length === 0) {
      fetchAPI();
    }
  }, [dispatch]);

  return (
    <Dialog.Root>
      <Dialog.Trigger className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm">
        Tạo mới tài khoản 
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />

        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between p-1 pl-4 border-b">
              <Dialog.Title className="text-lg font-medium text-gray-800">
               Tạo mới tài khoản 
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
              <div className="grid grid-cols-2 gap-y-5">
                {listInput.map((item) => (
                  <div key={item.title}>
                    <label className="text-gray-600">{item.title}</label>
                    <div className="relative max-w-xs mt-2">
                      <input
                        type={item.typeInput}
                        name={item.fieldName}
                        value={formData[item.fieldName]}
                        placeholder={item.placeholder}
                        onChange={handleChange}
                        className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                      />
                    </div>
                  </div>
                ))}
                <div className="relative max-w-xs mt-2">
                  <label className="text-gray-600">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pr-12 pl-3 py-2 mt-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
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
              </div>
            </Dialog.Description>

            <div className="flex justify-end items-center gap-3 p-4 border-t">
              <button
                className="px-3 py-1 text-xl flex justify-center items-center gap-x-5 text-white bg-green-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
                onClick={handleSubmit}
              >
                {isProcessing ? (
                  <div className="py-3 px-5">
                    <HalfRingLoading />
                  </div>
                ) : (
                  "Tạo mới"
                )}
              </button>
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

export default ModelAddAccount;
