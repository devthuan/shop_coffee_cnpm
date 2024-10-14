import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faWpforms } from "@fortawesome/free-brands-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { DetailProduct } from "~/services/ProductService";
import FeedBackProduct from "./FeedBackProduct";
import DescriptionProduct from "./DescriptionProduct";
const cx = classNames.bind(styles);
export const Product = () => {
  const [product, setProduct] = useState({});
  const [showDescription, setShowDescription] = useState(true);
  const [showFeedBack, setShowFeedBack] = useState(false)
  const [textDescription, setTextDescription] = useState('gray')
  const [textFeedBack, setTextFeedBack] = useState('black')
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [countReview, setCountReview] = useState(0)
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
        console.log(response)
        setProduct(response)
        if (response.productAttributes.length > 0) {
          // setSelectedAttribute(response.productAttributes[0]);
        }
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

  const handleReviewCountChange = (count) => {
    setCountReview(count);
  };

  return (
    <div className="">
      <div className={cx("mb-7")}>
        {product && product.images ? (
          <div className={cx("rounded-s-xl grid lg:grid-cols-11 max-sm:gap-7 border border-gray-200 mb-16")}>
            <div className={cx("lg:col-span-5")}>

              {product.images.length > 1 ? (
                <Slider style={{ width: '430px' }} {...settings}>
                  {product.images.map((image, index) => (
                    <img key={index} src={image.urlImage} alt="" />
                  ))}
                </Slider>
              ) : (
                product.images.length === 1 && (
                  <img  key={0} src={product.images[0].urlImage} alt="" />
                )
              )}


            </div>

            <div className={cx("lg:col-span-6 bg-gray-100")}>

              <p class="text-[#1a162e] pt-16 text-[26px] font-semiblod font-['Gordita'] leading-9">{product.name}</p>
              <div className={cx("flex px-16 mt-6")}>
                <div className={cx("w-1/2 mr-10")}>
                  <div className={cx("w-full flex items-center")}>
                    <FontAwesomeIcon className={cx("text-yellow-300 pr-4")} icon={faStar} />
                    <p class="text-[#323134] text-2xl font-semibold font-['Gordita'] leading-relaxed pr-2">(3.5)</p>
                    <p class="text-[#323134] text-2xl font-normal font-['Gordita'] leading-relaxed pr-2">{countReview}</p>
                    <p>Customer Reviews</p>
                  </div>
                  <p class="w-full text-start text-[#000000] pt-6 text-[23px] font-semiblod font-['Gordita'] leading-9">Size/Weight</p>
                  <div class="flex justify-start mt-5">
                    {/* <select class="w-[100px] h-[30px] text-[#010101]  text-[15px] font-medium font-['Gordita'] leading-snug border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Hạt</option>
                      <option value="">Xay</option>
                    </select> */}
                    <select value={selectedAttribute ? selectedAttribute.id : ""} onChange={handleAttributeChange} class="w-[120px] text-[#000000] text-[15px] font-medium font-['Gordita'] leading-snug border border-gray-200 rounded-tr rounded-br px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Chọn</option>
                      {product.productAttributes.map((item, index) => (
                        <option key={index} value={item.id}>{item.attributes.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* <div class="h-[34px] justify-start items-start gap-5 flex mt-4 ">
                    <div class="px-3 py-1.5 bg-[#e3e0e0] rounded-md justify-start items-start gap-2.5 flex">
                      <div class="text-[#9e9da8] text-[15px] font-medium font-['Gordita'] leading-snug">Small</div>
                    </div>
                    <div class="px-3 py-1.5 bg-[#e3e0e0] rounded-md justify-start items-start gap-2.5 flex">
                      <div class="text-[#9e9da8] text-[15px] font-medium font-['Gordita'] leading-snug">Medium</div>
                    </div>
                    <div class="px-3 py-1.5 bg-[#e3e0e0] rounded-md justify-start items-start gap-2.5 flex">
                      <div class="text-[#9e9da8] text-[15px] font-medium font-['Gordita'] leading-snug">Large</div>
                    </div>
                  </div> */}
                  {selectedAttribute && (
                    <div className={cx("w-full flex flex-wrap pt-4")}>
                      <p class="text-[#323134] text-2xl text-start font-normal font-['Gordita'] leading-relaxed pr-1">
                        {selectedAttribute.attributes.description}
                      </p>
                    </div>
                  )}

                </div>

                <div className={cx("w-1/2 ")}>
                  <div className={cx("flex items-center")}>
                    <p className="text-2xl">Thể loại: </p>
                    <p class="text-[#232325] text-2xl font-semibold font-['Gordita'] leading-relaxed pl-3">{product.category.name}</p>
                  </div>
                  {/* <div class="h-[50px] flex flex-col justify-start items-start gap-1 pt-6">
                    <div className={cx("flex items-center")}>
                      <FontAwesomeIcon className={cx("text-gray-500")} icon={faCartShopping} />
                      <p class="pl-3 text-[#1a162e] text-xl font-semibold font-['Gordita'] leading-relaxed">Delivery</p>
                    </div>
                    <p class="pl-10 text-[#1a162e] text-lg font-normal font-['Gordita'] leading-tight">From $6 for 1-3 days</p>
                  </div> */}

                  {/* <div class="h-[50px] flex flex-col justify-start items-start gap-1 pt-6">
                    <div className={cx("flex items-center")}>
                      <FontAwesomeIcon icon={faLock} />
                      <p class="pl-3 text-[#1a162e] text-xl font-semibold font-['Gordita'] leading-relaxed">Delivery</p>
                    </div>
                    <p class="pl-10 text-[#1a162e] text-lg font-normal font-['Gordita'] leading-tight">From $6 for 1-3 days</p>
                  </div> */}

                  <div style={{ border: '1px solid #ccc' }} class="h-[146px] w-full flex-col justify-start items-start gap-5 flex p-6 mt-5 ">
                    <div class="flex-col justify-start items-start gap-5 flex">
                      <div class="justify-start items-start gap-2.5 inline-flex">

                        {selectedAttribute && (
                          <div class="text-black font-medium font-['Gordita'] leading-normal">
                            {(selectedAttribute.sellPrice).toLocaleString('vi-VN')}đ
                          </div>
                        )}

                        <div class="px-2 py-0.5 bg-white/80 justify-start items-start gap-2.5 flex">
                          <div class="w-[30px] h-[17px] text-[#67b044] font-medium font-['Gordita'] leading-tight">10%</div>
                        </div>
                      </div>

                      {selectedAttribute && (
                        <div class="text-black text-[26px] font-medium font-['Gordita'] leading-9">
                          {(selectedAttribute.sellPrice - 10 / 100 * (selectedAttribute.sellPrice)).toLocaleString('vi-VN')}đ
                        </div>
                      )}
                    </div>
                    <div class="w-full justify-start items-start gap-[19px] inline-flex">
                      <div style={{ width: '100%', height: '40px' }} class=" bg-[#ffb700] rounded-md justify-center items-center gap-2.5 inline-flex">
                        <div class=" text-[#1a162e] text-[16px] font-medium font-['Gordita'] leading-relaxed">Add to cart</div>
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
          <p onClick={() => clickDescription()} className={cx(`cursor-pointer text-${textDescription === 'gray' ? 'gray' : 'black'}-500`)}>Description</p>
          {/* <div className={cx("")}>Features</div> */}
          <div onClick={() => clickFeedBack()} className={cx(` flex items-center cursor-pointer text-${textFeedBack === 'gray' ? 'gray' : 'black'}-500`)}>
            <p>Review</p>
            <p>(1000)</p>
          </div>
          {/* <div className={cx("")}>Similar</div> */}
        </div>


        <DescriptionProduct show={showDescription} content={product.description} />
        <FeedBackProduct show={showFeedBack} countReviewer={handleReviewCountChange} />


      </div>
    </div >
  );
};
