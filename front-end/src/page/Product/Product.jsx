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
import { useDispatch, useSelector } from "react-redux"; // Import các hook của Redux
import { AddToCart } from "~/services/CartService";
import { addToCart } from "~/redux/features/cart/cartSlice";
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
  const [textDescription, setTextDescription] = useState("gray");
  const [textFeedBack, setTextFeedBack] = useState("black");
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  console.log(product);
  const dispatch = useDispatch();
  const handleAddToCart = async (ProductAttributesId, quantity = 1) => {
    try {
      const response = await AddToCart({
        ProductAttributesId,
        quantity: quantity,
      });
      console.log(response);
      if (response && response.status === 201) {
        toast.success("Thêm vào giỏ hàng thành công");
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
      } catch (error) {
        console.log("Error when get detail product : ", error);
      }
    };
    fetchDetailProduct();
  }, []);

  // select attribute of product
  const handleAttributeChange = (event) => {
    const selectedAttribute = product.productAttributes.find(
      (attr) => attr.id === event.target.value
    );
    setSelectedAttribute(selectedAttribute);
  };

  // click description
  const clickDescription = () => {
    setShowFeedBack(false);
    setShowDescription(true);
    setTextDescription("gray");
    setTextFeedBack("black");
  };

  // click feedback
  const clickFeedBack = () => {
    setShowFeedBack(true);
    setShowDescription(false);
    setTextDescription("black");
    setTextFeedBack("gray");
  };

  return (
    <div className="">
      <div className={cx("mb-7")}>
        {product && statistical && product.images ? (
          <div
            className={cx(
              "h-[610px] rounded-s-xl grid lg:grid-cols-11 max-sm:gap-7 border border-gray-200 mb-16"
            )}
          >
            <div
              className={cx(" flex justify-center items-center lg:col-span-5")}
            >
              {productDetail.images ? (
                <Slider className="" {...settings}>
                  {product?.images?.map((image, index) => (
                    <img
                      className="w-auto h-96"
                      key={index}
                      src={image.urlImage}
                      alt=""
                    />
                  ))}
                </Slider>
              ) : (
                product.images.length === 1 && (
                  <img
                    className="w-auto h-96"
                    key={0}
                    src={product.images[0].urlImage}
                    alt=""
                  />
                )
              )}
            </div>

            <div className={cx("p-[50px] lg:col-span-6 bg-gray-100")}>
              <p className=" text-[#1a162e] pt-2 text-[26px] font-semiblod font-['Gordita'] leading-9">
                {productDetail.name}
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
                    <div className="flex items-center">
                      <p className="text-[#323134] text-[17px] font-normal font-['Gordita'] leading-relaxed pr-2">
                        {statistical.totalReview}
                      </p>
                      <p style={{ fontSize: "17px" }}>Đánh giá</p>
                    </div>
                  </div>
                  <p className="w-full text-start text-[#000000] pt-6 text-[23px] font-semiblod font-['Gordita'] leading-9">
                    Size/Weight
                  </p>
                  <div className="flex justify-start mt-5">
                    <select
                      value={selectedAttribute ? selectedAttribute.id : ""}
                      onChange={handleAttributeChange}
                      className=" w-[150px] h-14  text-[20px] font-['Gordita'] leading-snug border border-gray-200 rounded-tr rounded-br px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Chọn</option>
                      {product.productAttributes.map((item, index) => (
                        <option className="w-6 h-6" key={index} value={item.id}>
                          {item.attributes.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedAttribute && (
                    <div className={cx("w-full flex flex-wrap pt-4 ")}>
                      <p className="text-[#323134] text-2xl text-start font-normal font-['Gordita'] leading-relaxed pr-1">
                        {selectedAttribute.attributes.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className={cx("w-1/2 pb-3")}>
                  <div className={cx("flex items-center")}>
                    <p className="text-[19px]">Thể loại: </p>
                    <p className="text-[#232325] text-[19px] font-semibold font-['Gordita'] leading-relaxed pl-3">
                      {product.category.name}
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

                  <div
                    style={{ border: "1px solid #ccc" }}
                    className=" w-full flex-col justify-start items-start gap-5 flex p-3 mt-5 "
                  >
                    <div className="flex-col justify-start items-start gap-5 flex">
                      <div className="justify-start items-start gap-2.5 inline-flex">
                        {product.productDiscount.length > 0 && (
                          <>
                            <div
                              className={`xt-black text-base font-medium font-['Gordita'] leading-normal ${
                                product?.productDiscount.length > 0
                                  ? "line-through"
                                  : ""
                              }`}
                            >
                              {selectedAttribute?.sellPrice
                                ? selectedAttribute?.sellPrice.toLocaleString(
                                    "vi-VN"
                                  )
                                : 0}{" "}
                              đ
                            </div>
                            <div className="px-2 py-0.5 bg-white/80 justify-start items-start gap-2.5 flex">
                              <div className="w-[30px] text-[21px] h-[17px] text-[#67b044] font-medium font-['Gordita'] leading-tight">
                                {product.productDiscount[0].value}%
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {selectedAttribute && (
                        <div className="text-black text-[26px] font-medium font-['Gordita'] leading-9">
                          {selectedAttribute.sellPrice -
                            ((product?.productDiscount.length > 0
                              ? product.productDiscount[0].value
                              : 0) /
                              100) *
                              selectedAttribute.sellPrice <
                          0
                            ? 0
                            : selectedAttribute.sellPrice -
                              ((product?.productDiscount.length > 0
                                ? product.productDiscount[0].value
                                : 0) /
                                100) *
                                selectedAttribute.sellPrice.toLocaleString(
                                  "vi-VN"
                                )}{" "}
                          VNĐ
                        </div>
                      )}
                    </div>
                    <div className="w-60 min-h-24 justify-start items-end gap-[19px] flex">
                      <div className=" w-full px-4 py-2 mb-5 bg-[#ffb700] rounded-md gap-2.5 flex justify-center items-center">
                        <div
                          onClick={() =>
                            selectedAttribute
                              ? handleAddToCart(selectedAttribute.id)
                              : toast.error(
                                  "Vui lòng chọn loại sản phẩm cần thêm vào giỏ hàng"
                                )
                          }
                          className="text-[#1a162e] text-lg font-medium font-['Gordita'] leading-relaxed"
                        >
                          Thêm vào giỏ hàng
                        </div>
                      </div>
                      <div className="mb-5 p-[10px] rounded-md border border-[#d2d1d6] justify-center items-center gap-2.5 flex">
                        <div className="w-6 h-6 px-[2.50px] py-[3px] justify-center items-center flex">
                          <FontAwesomeIcon icon={faHeart} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="h-[186px] p-5 rounded-md border border-[#b9babe] flex-col justify-start items-start gap-2.5 inline-flex">
                    <div className="flex-col justify-start items-start gap-5 flex">
                      <div className="flex-col justify-start items-start gap-5 flex">
                        <div className="justify-start items-start gap-2.5 inline-flex">
                          <div className="text-black text-base font-medium font-['Gordita'] leading-normal">
                            $500.00
                          </div>
                          <div className="px-2 py-0.5 bg-white/80 justify-start items-start gap-2.5 flex">
                            <div className="w-[30px] h-[17px] text-[#67b044] text-sm font-medium font-['Gordita'] leading-tight">
                              10%
                            </div>
                          </div>
                        </div>
                        <div className="text-black text-[26px] font-medium font-['Gordita'] leading-9">
                          $540.00
                        </div>
                      </div>
                      <div className="justify-start items-start gap-[19px] inline-flex">
                        <div className="px-[55px] py-2.5 bg-[#ffb700] rounded-md justify-center items-center gap-2.5 flex">
                          <div className="text-[#1a162e] text-lg font-medium font-['Gordita'] leading-relaxed">
                            Add to cart
                          </div>
                        </div>
                        <div className="p-[11px] rounded-md border border-[#d2d1d6] justify-center items-center gap-2.5 flex">
                          <div className="w-6 h-6 relative">
                            <div className="w-[19px] h-[18px] left-[2.50px] top-[3px] absolute"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                   */}
                </div>
              </div>

              {/* <div className="h-96 p-14 bg-[#f6f6f6] flex-col justify-start items-start gap-2.5 inline-flex">
                <div className="flex-col justify-start items-start gap-7 flex">
                  <div className="w-full text-[#1a162e] text-2xl font-medium font-['Gordita'] leading-9">
                    Coffee Beans - Espresso Arabica and Robusta Beans
                  </div>
                  <div className="justify-start items-start gap-14 inline-flex">
                    <div className="flex-col justify-start items-start gap-7 inline-flex">
                      <div className="justify-start items-center gap-1 inline-flex">
                        <div className="justify-start items-start flex">
                          <div className="w-6 h-6 px-0.5 py-1 justify-center items-center flex">
                            <img src={StartIcon} />
                          </div>
                        </div>
                        <div className="text-[#1a162e] text-lg font-medium font-['Gordita'] leading-relaxed">
                          (3.5) 1100 reviews
                        </div>
                      </div>
                      <div className="flex-col justify-start items-start gap-5 flex">
                        <div className="text-[#1a162e] text-xl font-medium font-['Gordita'] leading-loose">
                          Size/Weight
                        </div>
                        <div className="h-11 px-3.5 py-1 rounded-md border border-[#d2d1d6] flex-col justify-start items-start gap-2.5 flex">
                          <div className="justify-start items-center gap-3.5 inline-flex">
                            <div className="justify-start items-end gap-14 flex">
                              <div className="text-[#1a162e] text-base font-medium font-['Gordita'] leading-snug">
                                500g
                              </div>
                              <div className="w-6 h-6 justify-center items-center flex">
                                <div className="w-6 h-6 px-1 justify-center items-center inline-flex" />
                              </div>
                            </div>
                          </div>

                          <select
                            value={
                              selectedAttribute ? selectedAttribute.id : ""
                            }
                            onChange={handleAttributeChange}
                            className=" w-[150px] h-14  text-[17px] font-['Gordita'] leading-snug border border-gray-200 rounded-tr rounded-br px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Chọn</option>
                            {product.productAttributes.map((item, index) => (
                              <option
                                className="w-6 h-6"
                                key={index}
                                value={item.id}
                              >
                                {item.attributes.name}
                              </option>
                            ))}
                          </select>
                        </div>
                       
                      </div>
                    </div>
                    <div className="flex-col justify-start items-start gap-7 inline-flex">
                      <div className="justify-start items-center gap-2.5 inline-flex">
                        <div className="w-6 h-6 px-1 py-0.5 justify-center items-center flex">
                          <div className="w-4 h-5 relative"></div>
                        </div>
                      </div>
                      <div className="justify-start items-start gap-5 inline-flex">
                        <div className="w-6 h-6 px-0.5 pt-1 pb-0.5 justify-center items-center flex">
                          <div className="w-5 h-5 relative"></div>
                        </div>
                        <div className="flex-col justify-start items-start gap-1 inline-flex">
                          <div className="text-[#1a162e] text-lg font-medium font-['Gordita'] leading-relaxed">
                            Delivery
                          </div>
                          <div className="text-[#1a162e] text-sm font-normal font-['Gordita'] leading-tight">
                            From $6 for 1-3 days
                          </div>
                        </div>
                      </div>
                      <div className="justify-start items-start gap-5 inline-flex">
                        <div className="w-6 h-6 pl-1 pr-0.5 py-0.5 justify-center items-center flex">
                          <div className="w-5 h-5 relative"></div>
                        </div>
                        <div className="flex-col justify-start items-start gap-1 inline-flex">
                          <div className="text-[#1a162e] text-lg font-medium font-['Gordita'] leading-relaxed">
                            Pickup
                          </div>
                          <div className="text-[#1a162e] text-sm font-normal font-['Gordita'] leading-tight">
                            Out of 2 store, today
                          </div>
                        </div>
                      </div>
                      <div className="p-5 rounded-md border border-[#b9babe] flex-col justify-start items-start gap-2.5 flex">
                        <div className="flex-col justify-start items-start gap-5 flex">
                          <div className="flex-col justify-start items-start gap-5 flex">
                            <div className="justify-start items-start gap-2.5 inline-flex">
                              <div className="text-black text-base font-medium font-['Gordita'] leading-normal">
                                $500.00
                              </div>
                              <div className="px-2 py-0.5 bg-white/80 justify-start items-start gap-2.5 flex">
                                <div className="w-7 h-4 text-[#67b044] text-sm font-medium font-['Gordita'] leading-tight">
                                  10%
                                </div>
                              </div>
                            </div>
                            <div className="text-black text-2xl font-medium font-['Gordita'] leading-9">
                              $540.00
                            </div>
                          </div>
                          <div className="justify-start items-start gap-5 inline-flex">
                            <div className="px-14 py-2.5 bg-[#ffb700] rounded-md justify-center items-center gap-2.5 flex">
                              <div className="text-[#1a162e] text-lg font-medium font-['Gordita'] leading-relaxed">
                                Add to cart
                              </div>
                            </div>
                            <div className="p-2.5 rounded-md border border-[#d2d1d6] justify-center items-center gap-2.5 flex">
                              <div className="w-6 h-6 px-0.5 py-0.5 justify-center items-center flex">
                                <div className="w-5 h-4 relative"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
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
          {/* <div className={cx("")}>Similar</div> */}
        </div>

        <DescriptionProduct
          show={showDescription}
          content={productDetail.product?.description}
        />
        <FeedBackProduct show={showFeedBack} />

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
