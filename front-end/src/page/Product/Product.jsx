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
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { HandleApiError } from "~/Utils/HandleApiError";

const cx = classNames.bind(styles);
export const Product = () => {
  const navigate = useNavigate()
  const [product, setProduct] = useState({});
  const [statistical, setStatistical] = useState({})
  const [showDescription, setShowDescription] = useState(true);
  const [showFeedBack, setShowFeedBack] = useState(false)
  const [textDescription, setTextDescription] = useState('gray')
  const [textFeedBack, setTextFeedBack] = useState('black')
  const [selectedAttribute, setSelectedAttribute] = useState(null);

  const dispatch = useDispatch();
  const handleAddToCart = async (ProductAttributesId, quantity = 1) => {
    try {
      const response = await AddToCart({
        ProductAttributesId,
        quantity: quantity
      })
      console.log(response)
      if (response && response.status === 201) {
        toast.success("Thêm vào giỏ hàng thành công")
      }
     

    }
    catch (error) {
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
        const response = await DetailProduct();
        console.log(response.data.product)
        setProduct(response.data.product)
        setStatistical(response.data.statistical)
      }
      catch (error) {
        console.log("Error when get detail product : ", error);
      }
    }
    fetchDetailProduct()
  }, [])

  // select attribute of product 
  const handleAttributeChange = (event) => {
    const selectedAttribute = product.productAttributes.find(
      (attr) => attr.id === event.target.value
    );
    setSelectedAttribute(selectedAttribute);
  };

  // click description 
  const clickDescription = () => {
    setShowFeedBack(false)
    setShowDescription(true)
    setTextDescription('gray')
    setTextFeedBack('black')
  }

  // click feedback 
  const clickFeedBack = () => {
    setShowFeedBack(true)
    setShowDescription(false)
    setTextDescription('black')
    setTextFeedBack('gray')
  }


  return (
    <div className="">
      <p onClick={() => navigate('../cart')}>Vào giỏ hàng</p>

      <div className={cx("mb-7")}>

        {product && statistical && product.images ? (
          <div className={cx("rounded-s-xl grid lg:grid-cols-11 max-sm:gap-7 border border-gray-200 mb-16")}>
            <div className={cx("lg:col-span-5")}>

              {product.images.length > 1 ? (
                <Slider style={{ width: '400px' }} {...settings}>
                  {product.images.map((image, index) => (
                    <img key={index} src={image.urlImage} alt="" />
                  ))}
                </Slider>
              ) : (
                product.images.length === 1 && (
                  <img key={0} src={product.images[0].urlImage} alt="" />
                )
              )}


            </div>

            <div className={cx("lg:col-span-6 bg-gray-100")}>

              <p class="text-[#1a162e] pt-2 text-[26px] font-semiblod font-['Gordita'] leading-9">{product.name}</p>
              <div className={cx("flex px-4 mt-4")}>
                <div className={cx("w-1/2 mr-10")}>
                  <div className={cx("w-full flex items-center")}>
                    <div className="flex items-center">
                      <FontAwesomeIcon className={cx("text-yellow-300 pr-2 text-[17px]")} icon={faStar} />
                      <p class="text-[#323134] text-[17px] font-semibold font-['Gordita'] leading-relaxed pr-2">({statistical.averageRating})</p>
                    </div>
                    <div className="flex items-center">
                      <p class="text-[#323134] text-[17px] font-normal font-['Gordita'] leading-relaxed pr-2">{statistical.totalReview}</p>
                      <p style={{ fontSize: '17px' }}>Customer Reviews</p>
                    </div>
                  </div>
                  <p class="w-full text-start text-[#000000] pt-6 text-[23px] font-semiblod font-['Gordita'] leading-9">Size/Weight</p>
                  <div class="flex justify-start mt-5">
                    <select value={selectedAttribute ? selectedAttribute.id : ""} onChange={handleAttributeChange} class=" w-[120px] text-[#000000] text-[17px] font-medium font-['Gordita'] leading-snug border border-gray-200 rounded-tr rounded-br px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Chọn</option>
                      {product.productAttributes.map((item, index) => (
                        <option key={index} value={item.id}>{item.attributes.name}</option>
                      ))}
                    </select>
                  </div>

                  {selectedAttribute && (
                    <div className={cx("w-full flex flex-wrap pt-4 ")}>
                      <p class="text-[#323134] text-2xl text-start font-normal font-['Gordita'] leading-relaxed pr-1">
                        {selectedAttribute.attributes.description}
                      </p>
                    </div>
                  )}

                </div>

                <div className={cx("w-1/2 pb-3")}>
                  <div className={cx("flex items-center")}>
                    <p className="text-[19px]">Thể loại: </p>
                    <p class="text-[#232325] text-[19px] font-semibold font-['Gordita'] leading-relaxed pl-3">{product.category.name}</p>
                  </div>

                  {selectedAttribute && (
                    <div className={cx("flex items-center")}>
                      <p className="text-[19px]">Số lượng</p>
                      <p class="text-[#232325] text-[19px]   font-semibold font-['Gordita'] leading-relaxed pl-3">{selectedAttribute.quantity}</p>
                    </div>
                  )}

                  <div style={{ border: '1px solid #ccc' }} class=" w-full flex-col justify-start items-start gap-5 flex p-3 mt-5 ">
                    <div class="flex-col justify-start items-start gap-5 flex">
                      <div class="justify-start items-start gap-2.5 inline-flex">

                        {selectedAttribute && (
                          <div class={`text-black text-[21px] font-medium font-['Gordita'] leading-normal ${product?.productDiscount.length > 0 ? "line-through" : ""}`}>
                            {(selectedAttribute.sellPrice).toLocaleString('vi-VN')} đ
                          </div>
                        )}

                        {product.productDiscount.length > 0 && (
                          <div class="px-2 py-0.5 bg-white/80 justify-start items-start gap-2.5 flex">
                            <div class="w-[30px] text-[21px] h-[17px] text-[#67b044] font-medium font-['Gordita'] leading-tight">{product.productDiscount[0].value}%</div>
                          </div>
                        )}
                      </div>

                      {selectedAttribute && (
                        <div class="text-black text-[21px] font-medium font-['Gordita'] leading-9 ">
                          {(selectedAttribute.sellPrice - (product?.productDiscount.length > 0 ? product.productDiscount[0].value : 0)  / 100 * (selectedAttribute.sellPrice)).toLocaleString('vi-VN')} đ
                        </div>
                      )}
                    </div>
                    <div class="w-full justify-start items-start gap-[19px] inline-flex">
                      <div style={{ width: '100%', height: '40px' }} class=" bg-[#ffb700] rounded-md justify-center items-center gap-2.5 inline-flex">
                        <div 
                          onClick={() => selectedAttribute ? handleAddToCart(selectedAttribute.id) : toast.error("Vui lòng chọn loại sản phẩm cần thêm vào giỏ hàng")} 
                          class=" text-[#1a162e] text-[16px] font-medium font-['Gordita'] leading-relaxed cursor-pointer">
                          Add to cart
                        </div>
                      </div>
                      <div class="p-[10px] rounded-md border border-[#d2d1d6] justify-center items-center gap-2.5 flex">
                        <div class="w-6 h-6 px-[2.50px] py-[3px] justify-center items-center flex">
                          <FontAwesomeIcon icon={faHeart} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) :
          <div className="loading">
            <div className="spinner"></div>
          </div>}
      </div>
      <div className={cx("review mt-7")}>
        <div
          className={cx("text-start grid lg:grid-cols-9 max-sm:grid-cols-4 grid-rows-1")}
        >

          <p onClick={() => clickDescription()} className={cx(`text-[20px] cursor-pointer text-${textDescription === 'gray' ? 'gray' : 'black'}-500`)}>Description</p>
          {/* <div className={cx("")}>Features</div> */}
          <div onClick={() => clickFeedBack()} className={cx(`text-[20px] flex items-center cursor-pointer text-${textFeedBack === 'gray' ? 'gray' : 'black'}-500`)}>
            <p>Review</p>
            <p>(1000)</p>
          </div>
          {/* <div className={cx("")}>Similar</div> */}
        </div>


        <DescriptionProduct show={showDescription} content={product?.description} />
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
    </div >
  );
};
