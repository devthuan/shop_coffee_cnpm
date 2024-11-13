import classNames from "classnames/bind";
import styles from "./ContentHome.module.scss";
import icon_under from "~/assets/images/icon_img_main.svg";
import icon_2 from "~/assets/images/icon_2.png";
import icon_3 from "~/assets/images/icon_3.png";
import img_product from "~/assets/images/img_product.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as love } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";
import { getALLProducts } from "~/services/ProductService";
import { useDispatch, useSelector } from "react-redux";
import { clearDataProduct, initDataProduct } from "~/redux/features/Product/PoductSlice";
import { HandleApiError } from "~/Utils/HandleApiError";
import { toast } from "react-toastify";
import { Pagination } from "~/components/Pagination/Pagination";
import Loading from "~/components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import { clearDataFavoriteUser, initDataFavoriteUser, addFavorite, clearFavorite } from "~/redux/features/FavoriteUser/favoriteUserSlice";
import { AddFavoriteUser, DelFavoriteUser, getFavoriteUser } from "~/services/FavoriteSevice";

const cx = classNames.bind(styles);

function ContentHome() {
  const dispatch = useDispatch();
  const FavoriteUserData = useSelector((state) => state.favoriteUser.data) || [];
  const ProductsData = useSelector((state) => state.products.data) || [];
  const total = useSelector((state) => state.products.total);
  const currentPage = useSelector((state) => state.products.currentPage);
  const totalPage = useSelector((state) => state.products.totalPage);
  const limit = useSelector((state) => state.products.limit);
  const isLoading = useSelector((state) => state.products.loading);
  const navigate = useNavigate();

  const [favoriteStatus, setFavoriteStatus] = useState(FavoriteUserData);
  
  const fetchData = async (type, queryParams, action, Callback) => {
    try {
      const response = await Callback(queryParams);
      dispatch(action(response.data));
    } catch (error) {
      if (error.request) {
        dispatch(action({ error: "không có phản hồi từ server..." }));
      }
      const result = HandleApiError(error);
      result ? toast.error(result) : toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };
  useEffect(() => {
    const queryParams = `limit=${limit}&page=${currentPage}`;
    dispatch(clearDataProduct());
    dispatch(clearDataFavoriteUser());
    fetchData("product", queryParams, initDataProduct, getALLProducts);
    fetchData("favorite", queryParams, initDataFavoriteUser, getFavoriteUser);
  }, [currentPage, limit, dispatch]);

  useEffect(() => {
    setFavoriteStatus(FavoriteUserData);
  }, [FavoriteUserData]);

  const handleFavoriteToggle = async (e, productId, isCurrentlyFavorite) => {
    e.stopPropagation();
    const idFavorite = FavoriteUserData[0]?.id;
    if (isCurrentlyFavorite) {
      try {
        await DelFavoriteUser(idFavorite, { productId });
        dispatch(clearFavorite(productId));
        setFavoriteStatus((prevStatus) =>
          prevStatus.filter((item) => item.products?.id !== productId)
        );
      } catch (error) {
        toast.error("Không thể xoá sản phẩm khỏi yêu thích");
      }
    } else {
      try {
        const response = await AddFavoriteUser({ productId: productId.toString() });
        dispatch(addFavorite({ productId, ...response.data }));
        setFavoriteStatus((prevStatus) => [
          ...prevStatus,
          { products: { id: productId } },
        ]);
      } catch (error) {
        toast.error("Không thể thêm sản phẩm vào danh sách yêu thích");
      }
    }
  };

const handlePageChange = (newPage) => {
  dispatch(initDataProduct({ currentPage: newPage }));
};

const handleLimitChange = (newLimit) => {
  dispatch(initDataProduct({ limit: newLimit, currentPage: 1 }));
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
      <ul className={cx("list_product")}>
        {ProductsData && ProductsData.map((item, i) => {
          const isFavorite = favoriteStatus.some((love) => love.products?.id === item.id);
          return (
            <li
              onClick={() => navigate(`/product/${item.id}`)}
              className={cx("item_product")}
              key={i}
            >
              <div className={cx("img_product")}>
                <img src={item.images[0]?.urlImage || img_product} className={cx("img")} alt="Product" />
              </div>
              <FontAwesomeIcon
                icon={isFavorite ? love : faHeart}
                className={cx("heart_icon")}
                style={isFavorite ? { color: "red" } : {}}
                onClick={(e) => handleFavoriteToggle(e, item.id, isFavorite)}
              />
              <div className={cx("name_product")}>{item.name}</div>
              <div className={cx("lazada")}>{item.description}</div>
              <div className={cx("img_price")}>
                {item.productAttributes[0]?.sellPrice || 0}
              </div>
            </li>
          );
        })}
      </ul>
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
    </div>
  );
}

export default ContentHome;
