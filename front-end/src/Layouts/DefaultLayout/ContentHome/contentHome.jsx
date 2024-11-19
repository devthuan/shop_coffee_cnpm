import classNames from "classnames/bind";
import styles from "./ContentHome.module.scss";
import icon_under from "~/assets/images/icon_img_main.svg";
import icon_2 from "~/assets/images/icon_2.png";
import icon_3 from "~/assets/images/icon_3.png";
import img_product from "~/assets/images/img_product.png";
import { useEffect, useState } from "react";
import {
  getALLProducts,
  getALLProductsForClientAPI,
} from "~/services/ProductService";
import { useDispatch, useSelector } from "react-redux";
import {
  clearDataProduct,
  initDataProduct,
} from "~/redux/features/Product/PoductSlice";
import { HandleApiError } from "~/Utils/HandleApiError";
import { toast, ToastContainer } from "react-toastify";
import { Pagination } from "~/components/Pagination/Pagination";
import Loading from "~/components/Loading/Loading";
import { NavLink, useNavigate } from "react-router-dom";
import {
  clearDataFavoriteUser,
  initDataFavoriteUser,
  addFavorite,
  deleteFavorite,
} from "~/redux/features/FavoriteUser/favoriteUserSlice";
import {
  AddFavoriteUser,
  DelFavoriteUser,
  getFavoriteUser,
} from "~/services/FavoriteSevice";
import StartIcon from "~/assets/icon/start_icon.svg";
import HeartIconRed from "~/assets/icon/heart_red.svg";
import HeartIcon from "~/assets/icon/heart.svg";

const cx = classNames.bind(styles);

function ContentHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const FavoriteUserData = useSelector((state) => state.favoriteUser.data);
  const ProductsData = useSelector((state) => state.products.data) || [];

  const total = useSelector((state) => state.products.total);
  const currentPage = useSelector((state) => state.products.currentPage);
  const totalPage = useSelector((state) => state.products.totalPage);
  const limit = useSelector((state) => state.products.limit);
  const isLoading = useSelector((state) => state.products.loading);
  const [optionLimit, setOptionLimit] = useState({
    currentPage: 1,
    limit: 10,
  });

  // const [favoriteStatus, setFavoriteStatus] = useState(FavoriteUserData);

  const fetchData = async (type, queryParams, action, Callback) => {
    try {
      const response = await Callback(queryParams);
      dispatch(action(response.data));
    } catch (error) {
      if (error.request) {
        dispatch(action({ error: "không có phản hồi từ server..." }));
      }
      const result = HandleApiError(error);
      result
        ? toast.error(result)
        : toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  useEffect(() => {
    let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
    // dispatch(clearDataProduct());
    // dispatch(clearDataFavoriteUser());
    fetchData(
      "product",
      queryParams,
      initDataProduct,
      getALLProductsForClientAPI
    );
    fetchData("favorite", queryParams, initDataFavoriteUser, getFavoriteUser);
  }, [optionLimit.limit, optionLimit.currentPage]);

  const handleFavoriteToggle = async (
    e,
    productId,
    statusFavorite,
    favoriteId
  ) => {
    e.stopPropagation();
    if (statusFavorite) {
      try {
        const response = await DelFavoriteUser(favoriteId);
        if (response) {
          dispatch(deleteFavorite({ id: favoriteId }));

          toast.success("Đã xoá sản phẩm khỏi yêu thích");
        }
      } catch (error) {
        const { message, status } = HandleApiError(error);
      }
    } else {
      try {
        const response = await AddFavoriteUser({
          productId: productId,
        });
        if (response) {
          console.log(response);
          toast.success("Đã thêm sản phẩm vào danh sách yêu thích");

          dispatch(addFavorite({ data: response.data }));
        }
      } catch (error) {
        const { message, status } = HandleApiError(error);
        if (status === "error") {
          toast.warning(message);
        }
      }
    }
  };

  const handlePageChange = (newPage) => {
    setOptionLimit((prevData) => ({
      ...prevData,
      currentPage: newPage,
    }));
  };

  const handleLimitChange = (newLimit) => {
    setOptionLimit((prevData) => ({
      ...prevData,
      limit: newLimit,
      currentPage: 1,
    }));
  };
  return (
    <div className={cx("wrapper")}>
      <div className={cx("background")}>
        <div className={cx("title")}>ORDER YOUR FAVORITE COFFEE</div>
        <div className={cx("photo")}>
          <div className={cx("photo_1")}>
            <img src={icon_under} alt="Icon" />
          </div>
          <div className={cx("photo_2")}>
            <img src={icon_2} alt="Icon" />
          </div>
          <div className={cx("photo_3")}>
            <img src={icon_3} alt="Icon" />
          </div>
        </div>
      </div>
      <div className={cx("info_product")}>
        <div className={cx("info_product_title")}>Total LavAzza 1320</div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {ProductsData &&
          ProductsData.map((item, i) => {
            const isFavorite = FavoriteUserData?.some(
              (love) => love.products?.id === item.id
            );
            const favoriteId = FavoriteUserData?.filter(
              (love) => love.products?.id === item.id
            );
            return (
              <div className="w-full h-auto max-h-96 p-4 bg-white rounded-2xl shadow justify-start items-start gap-2.5 inline-flex">
                <div className="w-full flex-col justify-start items-start gap-4 inline-flex">
                  <div className="w-full h-56 justify-center items-center gap-2.5 inline-flex">
                    <div className="w-full h-56 bg-white rounded-2xl flex-col justify-center items-center gap-2.5 inline-flex">
                      <div className="relative w-full h-56 py-2.5 flex-col justify-center items-center flex">
                        <NavLink to={`/product/${item.id}`}>
                          <img
                            className="w-auto h-auto max-h-56" //h-56 w-60
                            src={item.images[0]?.urlImage || img_product}
                          />
                        </NavLink>
                        <div className="w-12 h-12 ">
                          <div
                            onClick={(e) =>
                              handleFavoriteToggle(
                                e,
                                item?.id,
                                isFavorite,
                                favoriteId?.id
                              )
                            }
                            className=" cursor-pointer w-12 h-12 -right-1 bottom-0 absolute bg-white rounded-full shadow flex justify-center items-center "
                          >
                            <img
                              className={isFavorite ? "mt-2" : ""}
                              src={isFavorite ? HeartIconRed : HeartIcon}
                            />
                          </div>
                          <div className="w-6 h-6 px-0.5 py-0.5 left-[13px] top-[13px] absolute justify-center items-center inline-flex">
                            <div className="w-5 h-4 relative"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <NavLink
                    className="w-full max-h-32"
                    to={`/product/${item.id}`}
                  >
                    <div className="w-full max-h-32 flex-col justify-start items-start gap-1 flex">
                      <div className="w-full text-[#1a162e] text-base font-medium font-['Gordita'] leading-normal">
                        {/* Coffee Beans - Espresso Arabica and Robusta Beans */}
                        {item.name}
                      </div>
                      <div className="w-full text-[#9e9da8] text-base font-normal font-['Gordita'] leading-snug">
                        {/* Lavazza */}
                        {item.category.name}
                      </div>
                      <div className="w-full flex justify-between ">
                        <div className="text-[#1a162e] text- font-medium font-['Gordita'] leading-normal">
                          {/* $47.00 */}$
                          {item.productAttributes[0]?.sellPrice || 0}
                        </div>
                        <div className="justify-end items-center gap-1 flex">
                          <div className="w-6 h-6 px-0.5 py-1 justify-center items-center flex">
                            <img src={StartIcon} />
                          </div>
                          <div className="w-7 h-5 text-right text-[#1a162e] text-base font-medium font-['Gordita'] leading-normal">
                            4.3
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavLink>
                </div>
              </div>
            );
          })}
      </div>
      <div className={cx("footer")}>
        <Pagination
          totalItems={total}
          current={currentPage}
          totalPage={totalPage}
          limit={limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>

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
  );
}

export default ContentHome;
