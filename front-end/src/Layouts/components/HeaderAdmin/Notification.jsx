import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearDataNotificationUser,
  initDataNotificationUser,
  readNotificationUser,
  removeNotificationUser,
  setErrorNotificationUser,
} from "~/redux/features/Notifications/NotificationsUserSlice";
import {
  DeleteNotificationUerAPI,
  GetAllNotificationByUserAPI,
  ReadNotificationAPI,
} from "~/services/NotificationServer";
import { HandleApiError } from "~/Utils/HandleApiError";

export const Notification = () => {
  const dispatch = useDispatch();
  const [toggleNotification, setToggleNotification] = useState(false);
  const notificationData = useSelector((state) => state.notificationUser.data);
  const isLoading = useSelector((state) => state.notificationUser.loading);
  const isError = useSelector((state) => state.notificationUser.error);
  const total = useSelector((state) => state.notificationUser.total);
  const currentPage = useSelector(
    (state) => state.notificationUser.currentPage
  );
  const totalPage = useSelector((state) => state.notificationUser.totalPage);
  const limit = useSelector((state) => state.notificationUser.limit);

  const handleOpenNotification = () => {
    dispatch(clearDataNotificationUser());

    const fetchData = async () => {
      try {
        // API call here
        let queryParams = `limit=${100}&page=${1}&sortBy=createdAt&sortOrder=DESC`;
        const response = await GetAllNotificationByUserAPI(queryParams);
        if (response.status === 200 && response.data.data) {
          dispatch(initDataNotificationUser(response.data));
        }
      } catch (error) {
        const { message, status } = HandleApiError(error);
        if (status === "error") {
          dispatch(setErrorNotificationUser({ error: message }));
        }
      }
    };

    fetchData();
    dispatch(initDataNotificationUser());
    setToggleNotification(!toggleNotification);
  };

  const handleDeleteNotification = async (id) => {
    try {
      const response = await DeleteNotificationUerAPI(id);
      if (response && response.status === 200) {
        // Delete from local state
        dispatch(removeNotificationUser({ id }));
        toast.success("Xoá thông báo thành công.");
      }
    } catch (error) {
      const { message, status } = HandleApiError(error);
      if (status === "error") {
        dispatch(setErrorNotificationUser({ error: message }));
      }
    }
  };
  const handleIsReadNotification = async (item) => {
    if (item.isRead) {
      return;
    }
    try {
      const response = await ReadNotificationAPI(item.id);
      if (response && response.status === 200) {
        // Delete from local state
        dispatch(readNotificationUser({ id: item.id }));
      }
    } catch (error) {
      const { message, status } = HandleApiError(error);
      if (status === "error") {
        dispatch(setErrorNotificationUser({ error: message }));
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API call here
        let queryParams = `limit=${100}&page=${1}&sortBy=createdAt&sortOrder=DESC`;
        const response = await GetAllNotificationByUserAPI(queryParams);
        if (response.status === 200 && response.data.data) {
          dispatch(initDataNotificationUser(response.data));
        }
      } catch (error) {
        const { message, status } = HandleApiError(error);
        if (status === "error") {
          dispatch(setErrorNotificationUser({ error: message }));
        }
      }
    };

    dispatch(clearDataNotificationUser());

    if (!notificationData || notificationData.length === 0) {
      fetchData();
    }
  }, []);

  return (
    <div className="relative">
      <div className="inline-flex items-center overflow-hidden rounded-md border bg-white">
        <button
          onClick={() => handleOpenNotification()}
          className=" h-full p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 14 20"
          >
            <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
          </svg>

          <div className="absolute block w-3 h-3 bg-red-500 border-2 border-white rounded-full left-5 top-1 start-2.5 dark:border-gray-900"></div>
        </button>
      </div>
      {toggleNotification ? (
        <div
          className="absolute  end-0 z-10 mt-1 w-[500px] max-h-72 overflow-y-auto touch-pan-y divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
          role="menu"
        >
          <div className=" flow-root rounded-lg border border-gray-100 py-3 shadow-sm">
            <h3 className=" w-full text-center text-lg py-2 border-b-2 ">
              Thông báo
            </h3>
            <dl className=" divide-y divide-gray-100 text-sm my-2">
              {notificationData &&
                notificationData.map((item) => {
                  return (
                    <div
                      onClick={() => handleIsReadNotification(item)}
                      key={item.id}
                      className={`relative grid grid-cols-1 p-3  sm:grid-cols-3 
                        ${!item.isRead ? "bg-gray-50 cursor-pointer" : ""}`}
                    >
                      <dt className="font-medium text-gray-900">
                        {item.notification.title}:
                      </dt>
                      <dd className="text-gray-700 sm:col-span-2">
                        {item.notification.content}
                      </dd>

                      <dd className=" text-gray-700 sm:col-span-1">
                        {new Date(item.createdAt).toLocaleString()}
                      </dd>
                      <p
                        onClick={() => handleDeleteNotification(item.id)}
                        className="absolute right-3 top-1/4 text-red-500 cursor-pointer"
                      >
                        Xoá
                      </p>
                    </div>
                  );
                })}
            </dl>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
