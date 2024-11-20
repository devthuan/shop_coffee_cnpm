import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { DetailProduct } from "~/services/ProductService";
import FeedBackProduct from "./FeedBackProduct";
import DescriptionProduct from "./DescriptionProduct";
import CommentProduct from "./CommentProduct";
import { useDispatch, useSelector } from "react-redux"; // Import các hook của Redux
import { AddToCartAPI, GetCartOfUser } from "~/services/CartService";
import { addToCart, initCart } from "~/redux/features/cart/cartSlice";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { HandleApiError } from "~/Utils/HandleApiError";
import img_product from "~/assets/images/img_product.png";
import { initProductDetail } from "~/redux/features/Product/PoductSlice";
import StartIcon from "~/assets/icon/start_icon.svg";

const cx = classNames.bind(styles);
export const Product = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const productDetail = useSelector((state) => state.products.productDetail);
  const [product, setProduct] = useState({});
  const [statistical, setStatistical] = useState({});
  const [showDescription, setShowDescription] = useState(true);
  const [showFeedBack, setShowFeedBack] = useState(false);
  const [showCommemt, setShowComment] = useState(false);
  const [textDescription, setTextDescription] = useState("gray");
  const [textFeedBack, setTextFeedBack] = useState("black");
  const [textComment, setTextComment] = useState("black");

  const [selectedAttribute, setSelectedAttribute] = useState(null);

  const dispatch = useDispatch();

  const handleAddToCart = async (ProductAttributesId, quantity = 1) => {
    try {
      const response = await AddToCartAPI({
        ProductAttributesId,
        quantity: quantity,
      });
      console.log(response);
      if (response && response.status === 201) {
        toast.success("Thêm vào giỏ hàng thành công");
        const response = await GetCartOfUser();
        console.log(response.data);
        if (response.status === 200 && response.data) {
          dispatch(initCart(response.data));
        }
      }
    } catch (error) {
      const result = HandleApiError(error);
      if (result) {
        toast.error(result);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    }
  };

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };

  useEffect(() => {
    const fetchDetailProduct = async () => {
      try {
        const response = await DetailProduct(id);
        console.log(response.data.product);
        setProduct(response.data.product);
        dispatch(initProductDetail(response.data));
        setSelectedAttribute(response.data.product.productAttributes[0]);
      } catch (error) {
        console.log("Error when get detail product : ", error);
      }
    };
    fetchDetailProduct();
  }, []);

  // select attribute of product
  const handleAttributeChange = (value) => {
    const selectedAttribute = productDetail?.product.productAttributes.find(
      (attr) => attr.id === value
    );
    setSelectedAttribute(selectedAttribute);
  };

  // click description
  const clickDescription = () => {
    setShowFeedBack(false);
    setShowComment(false);
    setShowDescription(true);
    setTextDescription("gray");
    setTextComment("black");
    setTextFeedBack("black");
  };

  // click feedback
  const clickFeedBack = () => {
    setShowFeedBack(true);
    setShowComment(false);
    setShowDescription(false);
    setTextDescription("black");
    setTextComment("black");
    setTextFeedBack("gray");
  };

  const clickComment = () => {
    setShowFeedBack(false);
    setShowDescription(false);
    setShowComment(true);
    setTextComment("gray");
    setTextDescription("black");
    setTextFeedBack("black");
  };

  return (
    <div className="">
      <div className={cx("mb-7")}>
        {productDetail && statistical && productDetail?.product ? (
          <div
            className={cx(
              "h-[610px] rounded-s-xl grid lg:grid-cols-11 max-sm:gap-7 border border-gray-200 mb-16"
            )}
          >
            <div
              className={cx(" flex justify-center items-center lg:col-span-5")}
            >
              {productDetail?.product?.images.length > 1 ? (
                <Slider className="" {...settings}>
                  {productDetail?.product.images.map((image, index) => (
                    <img
                      className="w-auto h-96"
                      key={index}
                      src={image.urlImage}
                      alt=""
                    />
                  ))}
                </Slider>
              ) : (
                productDetail?.product.images.length === 1 && (
                  <img
                    className="w-auto h-96"
                    key={0}
                    src={productDetail?.product.images[0].urlImage}
                    alt=""
                  />
                )
              )}
            </div>

            <div className={cx("p-[30px] lg:col-span-6 bg-gray-100")}>
              <p className=" text-[#1a162e] pt-2 text-[30px] font-semiblod font-['Gordita'] leading-9">
                {productDetail?.product.name}
              </p>

              <div className={cx("flex px-4 mt-7")}>
                <div className={cx("w-1/2 mr-10")}>
                  <div className={cx("w-full flex items-center")}>
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        className={cx("text-yellow-300 pr-2 text-[17px]")}
                        icon={faStar}
                      />
                      <p className="text-[#323134] text-[17px] font-semibold font-['Gordita'] leading-relaxed pr-2">
                        ({statistical.averageRating})
                      </p>
                    </div>
                    <div className="flex items-end gap-x-2">
                      <p className="text-[#323134] text-[17px] font-normal font-['Gordita'] leading-relaxed pr-2">
                        {statistical.totalReview}
                      </p>
                      <p className="text-[20px] mt-1">
                        |{" "}
                        {productDetail?.product.reviews.length
                          ? productDetail?.product.reviews.length
                          : 0}
                      </p>
                      <p className="text-[20px] mt-1">Đánh giá</p>
                    </div>
                  </div>
                </div>

                <div className={cx("w-1/2 pb-3")}>
                  <div className={cx("flex items-center")}>
                    <p className="text-[19px]">Thể loại: </p>
                    <p className="text-[#232325] text-[19px] font-semibold font-['Gordita'] leading-relaxed pl-3">
                      {productDetail?.product.category.name}
                    </p>
                  </div>

                  <div className={cx("flex items-center gap-y-4")}>
                    <p className="text-[19px]">Số lượng</p>
                    <p className="text-[#232325] text-[19px]   font-semibold font-['Gordita'] leading-relaxed pl-3">
                      {selectedAttribute?.quantity
                        ? selectedAttribute.quantity
                        : 0}
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{ border: "1px solid #ccc" }}
                className=" w-full  p-3 mt-5 "
              >
                <div className="flex justify-start items-start gap-5 ">
                  {selectedAttribute && (
                    <div className="text-black text-[26px] font-medium font-['Gordita'] leading-9">
                      {selectedAttribute.sellPrice -
                        ((productDetail?.product?.productDiscount.length > 0
                          ? productDetail?.product.productDiscount[0].value
                          : 0) /
                          100) *
                          selectedAttribute.sellPrice <
                      0
                        ? 0
                        : selectedAttribute.sellPrice -
                          ((productDetail?.product?.productDiscount.length > 0
                            ? productDetail?.product.productDiscount[0].value
                            : 0) /
                            100) *
                            selectedAttribute.sellPrice.toLocaleString(
                              "vi-VN"
                            )}{" "}
                      VNĐ
                    </div>
                  )}
                  <div className="justify-start items-start gap-2.5 inline-flex">
                    {productDetail?.product.productDiscount.length > 0 && (
                      <>
                        <div
                          className={`xt-black text-[20px] font-medium font-['Gordita'] leading-normal ${
                            productDetail?.product?.productDiscount.length > 0
                              ? "line-through"
                              : ""
                          }`}
                        >
                          {selectedAttribute?.sellPrice
                            ? selectedAttribute?.sellPrice.toLocaleString(
                                "vi-VN"
                              )
                            : 0}{" "}
                          vnđ
                        </div>
                        <div className=" justify-start items-start gap-2.5 flex">
                          <div className="w-[30px] text-[21px] h-[17px] text-[#67b044] font-medium font-['Gordita'] leading-tight">
                            {productDetail?.product.productDiscount[0].value}%
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <p className="w-full text-start text-[#000000] pt-6 text-[23px] font-semiblod font-['Gordita'] leading-9">
                Size/Weight
              </p>
              <div className="flex justify-center gap-5 mt-5">
                {/* <select
                  value={selectedAttribute ? selectedAttribute.id : ""}
                  onChange={handleAttributeChange}
                  className=" w-[150px] h-14  text-[20px] font-['Gordita'] leading-snug border border-gray-200 rounded-tr rounded-br px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn</option>
                  {productDetail?.product.productAttributes.map(
                    (item, index) => (
                      <option className="w-6 h-6" key={index} value={item.id}>
                        {item.attributes.name}
                      </option>
                    )
                  )}
                </select> */}
                {productDetail?.product.productAttributes.map((item, index) => (
                  <div
                    key={index}
                    value={selectedAttribute ? selectedAttribute.id : ""}
                    onClick={() => handleAttributeChange(item.id)}
                    className={`cursor-pointer flex justify-center items-center bg-white w-[150px] h-14  text-[20px] font-['Gordita'] leading-snug border border-gray-200 rounded-tr rounded-br px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      
                      ${
                        selectedAttribute?.id === item.id
                          ? "border-green-500 text-green-500"
                          : ""
                      }
                      
                      `}
                  >
                    {item.attributes.name}
                  </div>
                ))}
              </div>

              {/* {selectedAttribute && (
                <div className={cx("w-full flex flex-wrap pt-4 ")}>
                  <p className="text-[#323134] text-2xl text-start font-normal font-['Gordita'] leading-relaxed pr-1">
                    {selectedAttribute.attributes.description}
                  </p>
                </div>
              )} */}

              <div className="w-full min-h-24 justify-start items-end gap-[19px] flex">
                <div className=" w-full px-4 py-2 mb-5 bg-[#ffb700] rounded-md gap-2.5 flex justify-center items-center">
                  <div
                    onClick={() =>
                      selectedAttribute
                        ? handleAddToCart(selectedAttribute.id)
                        : toast.error(
                            "Vui lòng chọn loại sản phẩm cần thêm vào giỏ hàng"
                          )
                    }
                    className=" cursor-pointer text-[#1a162e] text-lg font-medium font-['Gordita'] leading-relaxed"
                  >
                    Thêm vào giỏ hàng
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}
      </div>
      <div className={cx("review mt-7")}>
        <div
          className={cx(
            "text-start grid lg:grid-cols-9 max-sm:grid-cols-4 grid-rows-1"
          )}
        >
          <p
            onClick={() => clickDescription()}
            className={cx(
              `text-[20px] cursor-pointer text-${
                textDescription === "gray" ? "gray" : "black"
              }-500`
            )}
          >
            Description
          </p>
          {/* <div className={cx("")}>Features</div> */}
          <div
            onClick={() => clickFeedBack()}
            className={cx(
              `text-[20px] flex items-center cursor-pointer text-${
                textFeedBack === "gray" ? "gray" : "black"
              }-500`
            )}
          >
            <p>Review</p>
            <p>(1000)</p>
          </div>

          <p
            onClick={() => clickComment()}
            className={cx(
              `text-[20px] cursor-pointer text-${
                textComment === "gray" ? "gray" : "black"
              }-500`
            )}
          >
            Comment
          </p>
        </div>

        <DescriptionProduct
          show={showDescription}
          content={productDetail.product?.description}
        />
        <FeedBackProduct idProduct={id} show={showFeedBack} />
        <CommentProduct idProduct={id} show={showCommemt} />
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
    </div>
  );
};
