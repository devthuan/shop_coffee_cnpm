import classNames from "classnames/bind";
import styles from "./ProfileLayout.module.scss";
import Header from "~/Layouts/components/Header/Header";
import ProfileSidebar from "~/Layouts/ProfileLayout/ProfileSidebar/profileSidebar";
import { useEffect } from "react";
import { getAllInfoUser } from "~/services/UserCurrentService";
import { useDispatch, useSelector } from "react-redux";
import { clearDataUserInfo, initDataUserInfo } from "~/redux/features/UserInfor/User_InforSlice";
import { HandleApiError } from "~/Utils/HandleApiError";
import { toast } from "react-toastify";


const cx = classNames.bind(styles);

function ProfileLayout({ children }) {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.userInfo.id)
  const createdAt = useSelector((state) => state.userInfo.createdAt)
  const updatedAt = useSelector((state) => state.userInfo.updatedAt)
  const userName = useSelector((state) => state.userInfo.userName)
  const email = useSelector((state) => state.userInfo.email)
  const balance = useSelector((state) => state.userInfo.balance);
  const ip = useSelector((state) => state.userInfo.ip);
  const device = useSelector((state) => state.userInfo.device);
  const typeLogin = useSelector((state) => state.userInfo.typeLogin);
  const isActive = useSelector((state) => state.userInfo.isActive);
  const lastLogin = useSelector((state) => state.userInfo.lastLogin);
  const userInformation = useSelector((state) => state.userInfo.userInformation);
  const isError = useSelector((state) => state.userInfo.error);
  const isloading = useSelector((state) => state.userInfo.loading);

  useEffect(() => {
    const fetchDataUser = async () => {
      try {
        const reponse = await getAllInfoUser();
        dispatch(initDataUserInfo(reponse.data))

      } catch (error) {
        if (error.request) {
          dispatch(initDataUserInfo({ error: "không có phản hồi từ server..." }));
        }
        const result = HandleApiError(error);
        result ? toast.error(result) : toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    }
    dispatch(clearDataUserInfo());

    const timeoutId = setTimeout(() => {
      fetchDataUser();
    }, 800);
    return () => clearTimeout(timeoutId);

  }, [])

  return (
    <div className={cx("max-w-[1280px] mx-auto text-center")}>
      <div className={cx("mb-7")}><Header /></div>
      <div className={cx("md:hidden grid lg:grid-cols-1 my-5")}>search</div>

      <div
        className={cx(
          "w-11/12 mx-auto grid lg:grid-cols-12 max-sm:grid-cols-1 gap-7"
        )}
      >
        <div className="lg:col-span-3 grid gap-y-7">
          <ProfileSidebar />
        </div>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}

export default ProfileLayout;
