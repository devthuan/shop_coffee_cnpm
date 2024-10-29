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
const ModelEditBill = ({ data }) => {

  return (
    <Dialog.Root>
      <Dialog.Trigger className=" py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg">
        Edit
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />

        <Dialog.Content className=" fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between p-1 pl-4 border-b">
              <Dialog.Title className="text-lg font-medium text-gray-800 ">
                Edit account
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
              {/* <div className="grid grid-cols-3 gap-5">
                <div>
                  <label className="text-gray-600">ID</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="id"
                      value={formData.id}
                      className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
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
                      className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
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
                      className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-600 select ">Role</label>
                  <select
                    onChange={handleInputChange}
                    name="role"
                    defaultValue={formData.role}
                    className="w-full pr-12 pl-3 py-2 mt-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  >
                    {dataRole &&
                      dataRole.length > 0 &&
                      dataRole.map((item) => {
                        return <option value={item.name}>{item.name}</option>;
                      })}
                  </select>
                </div>

                <div>
                  <label className="text-gray-600">Balance</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="balance"
                      value={formData.balance}
                      className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
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
                      className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Type login</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="typeLogin"
                      value={formData.typeLogin}
                      className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Status</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="status"
                      value={formData.status ? "active" : "inactive"}
                      className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Last login</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="lastLogin"
                      value={new Date(formData.lastLogin).toLocaleString()}
                      className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Created At</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="createdAt"
                      value={new Date(formData.createdAt).toLocaleString()}
                      className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600">Updated At</label>
                  <div className="relative max-w-xs mt-2">
                    <input
                      readOnly="true"
                      type="text"
                      name="updatedAt"
                      value={new Date(formData.updatedAt).toLocaleString()}
                      className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <label className="text-gray-600">Provider password</label>
                  <div className="relative max-w-xs mt-2">
                    <button
                      onClick={() => handleResetPassword()}
                      className="px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg duration-150 hover:bg-indigo-100 active:bg-indigo-200"
                    >
                      {isProcessing ? "Processing..." : "Reset Password"}
                    </button>
                  </div>
                </div>
              </div> */}
            </Dialog.Description>
            <div className="flex justify-end items-center gap-3 p-4 border-t">
              <Dialog.Close asChild>
                <button
                //   onClick={() => handleSubmitUpdate()}
                  className="px-3 py-1 t text-xl text-white bg-green-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2 "
                >
                  Update
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  className="px-3 py-1 text-xl text-gray-800 border rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
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

export default ModelEditBill;
