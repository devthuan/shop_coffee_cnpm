import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import React from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { HandleApiError } from "~/Utils/HandleApiError";
import { clearDataRole, initDataRole } from "~/redux/features/Roles/rolesSilce";
import {
  ChangeStatusPermissionAPI,
  GetAllPermissionByRoleAPI,
  GetAllRole,
} from "~/services/PermissionService";
import {
  clearDataPermission,
  initDataPermission,
} from "~/redux/features/Permissions/permissionsSilce";
const ModelEditRole = ({ data }) => {
  // const dataPermission = useSelector((item) => item.permissions.data);
  const dispatch = useDispatch();
  const dataRole = useSelector((item) => item.roles.data);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckBox, setIsCheckBox] = useState(false);
  const [dataPermission, setDataPermission] = useState([]);

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  const handleSubmitUpdate = async () => {
    // try {
    // const findRole = dataRole.filter(
    //     (role) => role.codeName === formData.role
    //   );
    //   const response = await UpdateAccountAPI(formData.id, {
    //     userName: formData.userName,
    //     role: formData.role,
    //   });
    //   if (response && response.data) {
    //     const { statusCode, status, message } = response.data;
    //     if (statusCode === 200 && status === "success") {
    //       dispatch(
    //         updateAccount({
    //           id: formData.id,
    //           userName: formData.userName,
    //           role: findRole[0],
    //         })
    //       );
    //       toast.success(message);
    //     }
    //   }
    // } catch (err) {
    //   const result = HandleApiError(err);
    //   result
    //     ? toast.error(result)
    //     : toast.error("Có lỗi xảy ra, vui lòng thử lại");
    // }
  };

  const handleCheckbox = async (idPermission, isChecked) => {
    console.log(idPermission);
    console.log(isChecked);
    const updatedDataPermission = dataPermission.map((item) =>
      item.id === idPermission ? { ...item, isActive: isChecked } : item
    );

    try {
      const response = await ChangeStatusPermissionAPI(idPermission);
      if (response && response.data && response.status === 200) {
        const { statusCode, status, message } = response.data;
        toast.success(message);
        setDataPermission(updatedDataPermission); // Cập nhật state
      }
    } catch (error) {
      const result = HandleApiError(error);
      result
        ? toast.error(result)
        : toast.error("Có lỗi ngoài mong muốn xảy ra, vui lòng thử lại");
    }
  };

  useEffect(() => {
    const fetchAPI = async () => {
      dispatch(clearDataRole());
      try {
        const response = await GetAllRole();
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

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const roleCodeName = data?.codeName;
        const response = await GetAllPermissionByRoleAPI(roleCodeName);
        if (response && response.data && response.status === 200) {
          const { statusCode, status, data } = response.data;
          setDataPermission(data);
        }
      } catch (error) {
        const result = HandleApiError(error);
        result
          ? toast.error(result)
          : toast.error("Có lỗi ngoài mong muốn xảy ra.");
      }
    };
    // dispatch(clearDataPermission());
    if (dataPermission.length === 0) {
      fetchAPI();
    }
  }, [data]);

  return (
    <Dialog.Root>
      <Dialog.Trigger className=" py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg">
        Chi tiết
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />

        <Dialog.Content className=" fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-6xl  mx-auto px-4">
          <div className="bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between p-1 pl-4 border-b">
              <Dialog.Title className="text-lg font-medium text-gray-800 ">
                Cập nhật danh sách quyền
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
            <Dialog.Description className="space-y-2 p-4 mt-3 text-[15.5px] leading-relaxed text-gray-500 max-h-[600px] overflow-y-auto">
              <div className="max-h-svh">
                {dataPermission &&
                  dataPermission.length > 0 &&
                  // Group dataPermission by module
                  (() => {
                    const groupedData = dataPermission.reduce((acc, item) => {
                      const moduleName = item.functions.module;

                      if (!acc[moduleName]) {
                        acc[moduleName] = [];
                      }

                      acc[moduleName].push(item);
                      return acc;
                    }, {});

                  
                    return Object.keys(groupedData).map((module, index) => (
                      <div className="">
                        <h3 className="text-black text-lg mt-2">{module}</h3>
                        <div
                          key={index}
                          className="module-group  grid grid-cols-3 gap-2  "
                        >
                          {groupedData[module].map((item, idx) => (
                            <div
                              key={idx}
                              className="w-full px-4 mx-auto border rounded-md flex justify-start items-center py-2"
                            >
                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  onChange={(e) =>
                                    handleCheckbox(item.id, e.target.checked)
                                  }
                                  type="checkbox"
                                  name={item.id}
                                  value={item.isActive}
                                  checked={item.isActive}
                                  className="sr-only peer"
                                />
                                <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                  {item.functions.name}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ));
                  })()}
              </div>
            </Dialog.Description>
            <div className="flex justify-end items-center gap-3 p-4 border-t">
              <Dialog.Close asChild>
                {/* <button
                  onClick={() => handleSubmitUpdate()}
                  className="px-3 py-1 t text-xl text-white bg-green-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2 "
                >
                  Cập nhật
                </button> */}
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

export default ModelEditRole;
