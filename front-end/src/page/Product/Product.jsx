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
import { useState } from "react";
import Slider from "react-slick";
const cx = classNames.bind(styles);
export const Product = () => {

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


  return (
    <div className="">
      <div className={cx("mb-7")}>
        <div className={cx("rounded-s-xl grid lg:grid-cols-11 max-sm:gap-7 border border-gray-200 mb-16")}>
          <div className={cx("lg:col-span-5")}>
            <Slider style={{ width: '430px' }} {...settings}>
              <img src="https://s3-alpha-sig.figma.com/img/395c/d281/7ca95beb2edb8cc3886eea18b0158b34?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=F7UwXIMYz-vmHW8Q88wMPMqraWXc7O7wStcnl8p9lpxRCv0wNJ3~tEh12z773oSfylZGxQUEt1o17jIkIht6q7PDUcFNB3DtlaaNAbviwxR9NLC~7NOk6eS2CrwUJplUniFujKQxkbqlAOS7qXZe-NGdHBSAQZfscAppPq6Oney9c-GbtqVqZG8qJ8-JFK5jxEFH9vtUepfMfekUnFvfM4wgQT3QLZmKvjUWzWiACJujFp3z30CksuwaT1P0OfpD6xvetp9EGV7P47D55L2w52neRNCVcSrBX9vnnggaTcVEA0yndgDXikXYIgYxY15q6syKrDVt4aOYbF8BVhEaSQ__" alt="" />
              <img src="https://s3-alpha-sig.figma.com/img/0dc9/8023/1b3301cf80ceeab9071bd437ced0c257?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I~jcd4t0EE23rSBlLXCW1tDzOF8l5E~ChHwVS103C6Sm0zAl5828VwZOiQt8nL3D7srt4wTFpKrhq5CWerVkPjC9uP-JFZ1LU-5wSQdewV4zL1QpWJBzMkCRQrF1ae7AtHvGNDrTVYSEMhyZV6FqIqDm~Kd5IwpLZGD3U-3ycoygemSoY2-5Pa2JefNEtAlhMM1DV9RzSFLlAYKM1UWMO91idp4kX3cl1oxyKkxHpQU3OFbP1HCWZbvT6JWs~jarV86P~CSoZByjH3LCsnvs9ovgG29iCyS1NqFM7RCMGSwGh38hMWLc~sebuP5tVNJSFAFPSBOm7j6hjwZIHJlGag__" alt="" />
              <img src="https://s3-alpha-sig.figma.com/img/2693/c42f/9cf50fcf995e64ab4472edd43af10c70?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Ijn~XBiKwaDRP-LmG~e9odklqzthZ14hqCPEPiAlpYt6mp4b3Fr7WueIzbq-TqCLp8os8OADZjWf2iNxUUDQK7jmENQjGJyCqzPVAwbMFEw6AOGkvzEjxnZiH7hwZH6G8MVA8iAyrOqa2MBY-JHfCF~1O6FB4iCqUap0~OXSizzRBS5IHF09c341tskF4Ya2HjUGLnr2Vl7LSN5~lrEm7eeJjN13swblPjmeRGctDgkdoy8ym7G2hoGFbhvr8vFph7eWbqSQR7F0nJXDkqf3-ZqHh6FVEnI4X59SwTGCfDeu2uMddvTBIhL29d4FI~84xV75ryTkSwY4mvK7Y5iD7w__" alt="" />
            </Slider>
          </div>

          <div className={cx("lg:col-span-6 bg-gray-100")}>
            <p class="text-[#1a162e] pt-16 text-[26px] font-semiblod font-['Gordita'] leading-9">Coffee Beans - Espresso Arabica and Robusta Beans</p>
            <div className={cx("flex px-16 mt-6")}>
              <div className={cx("w-1/2 mr-10")}>
                <div className={cx("w-full flex")}>
                  <FontAwesomeIcon className={cx("text-yellow-300 pr-4")} icon={faStar} />
                  <p class="text-[#323134] text-xl font-semibold font-['Gordita'] leading-relaxed pr-1">(3.5)</p>
                  <p class="text-[#323134] text-xl font-semibold font-['Gordita'] leading-relaxed">1000 reviews</p>
                </div>
                <p class="w-full text-start text-[#000000] pt-6 text-[23px] font-semiblod font-['Gordita'] leading-9">Size/Weight</p>
                <div class="flex justify-start mt-5">
                  <select class="w-[100px] h-[30px] text-[#010101]  text-[15px] font-medium font-['Gordita'] leading-snug border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">200g</option>
                    <option value="">500g</option>
                  </select>
                  <select class="w-[90px] text-[#000000] text-[15px] font-medium font-['Gordita'] leading-snug border border-gray-200 rounded-tr rounded-br px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Gam</option>
                    <option value="">Kilogram</option>
                  </select>
                </div>

                <div class="h-[34px] justify-start items-start gap-5 flex mt-4 ">
                  <div class="px-3 py-1.5 bg-[#e3e0e0] rounded-md justify-start items-start gap-2.5 flex">
                    <div class="text-[#9e9da8] text-[15px] font-medium font-['Gordita'] leading-snug">Small</div>
                  </div>
                  <div class="px-3 py-1.5 bg-[#e3e0e0] rounded-md justify-start items-start gap-2.5 flex">
                    <div class="text-[#9e9da8] text-[15px] font-medium font-['Gordita'] leading-snug">Medium</div>
                  </div>
                  <div class="px-3 py-1.5 bg-[#e3e0e0] rounded-md justify-start items-start gap-2.5 flex">
                    <div class="text-[#9e9da8] text-[15px] font-medium font-['Gordita'] leading-snug">Large</div>
                  </div>
                </div>

              </div>

              <div className={cx("w-1/2 ")}>
                <div className={cx("flex items-center")}>
                  <FontAwesomeIcon icon={faWpforms} />
                  <p class="text-[#232325] text-xl font-semibold font-['Gordita'] leading-relaxed pl-3">Compare</p>
                </div>
                <div class="h-[50px] flex flex-col justify-start items-start gap-1 pt-6">
                  <div className={cx("flex items-center")}>
                    <FontAwesomeIcon className={cx("text-gray-500")} icon={faCartShopping} />
                    <p class="pl-3 text-[#1a162e] text-xl font-semibold font-['Gordita'] leading-relaxed">Delivery</p>
                  </div>
                  <p class="pl-10 text-[#1a162e] text-lg font-normal font-['Gordita'] leading-tight">From $6 for 1-3 days</p>
                </div>

                <div class="h-[50px] flex flex-col justify-start items-start gap-1 pt-6">
                  <div className={cx("flex items-center")}>
                    <FontAwesomeIcon icon={faLock} />
                    <p class="pl-3 text-[#1a162e] text-xl font-semibold font-['Gordita'] leading-relaxed">Delivery</p>
                  </div>
                  <p class="pl-10 text-[#1a162e] text-lg font-normal font-['Gordita'] leading-tight">From $6 for 1-3 days</p>
                </div>

                <div style={{ border: '1px solid #ccc' }} class="h-[146px] w-full flex-col justify-start items-start gap-5 flex p-6 mt-5 ">
                  <div class="flex-col justify-start items-start gap-5 flex">
                    <div class="justify-start items-start gap-2.5 inline-flex">
                      <div class="text-black font-medium font-['Gordita'] leading-normal">$500.00</div>
                      <div class="px-2 py-0.5 bg-white/80 justify-start items-start gap-2.5 flex">
                        <div class="w-[30px] h-[17px] text-[#67b044] font-medium font-['Gordita'] leading-tight">10%</div>
                      </div>
                    </div>
                    <div class="text-black text-[26px] font-medium font-['Gordita'] leading-9">$540.00</div>
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
      </div>
      <div className={cx("review mt-7")}>
        <div
          className={cx("text-start grid lg:grid-cols-9 max-sm:grid-cols-4 grid-rows-1")}
        >
          <div className={cx("")}>Description</div>
          <div className={cx("")}>Features</div>
          <div className={cx("flex items-center")}>
            <p>Review</p>
            <p>(1000)</p>
          </div>
          <div className={cx("")}>Similar</div>
        </div>
        <div className={cx("text-start mt-7 mb-7 text-[#1a162e] font-bold hover:text-blue-700")}>What our customers are saying</div>
        <div className={cx("grid lg:grid-cols-3 gap-7 max-sm:grid-cols-1 ")}>
          <div class="h-[196px] p-[30px] bg-[#fafafd] rounded-2xl flex-col justify-start items-start gap-2.5 inline-flex">
            <div class="flex-col justify-start items-start gap-5 flex">
              <div class="justify-start items-start gap-5 inline-flex">
                <img width="60px" class="rounded-full" src="https://s3-alpha-sig.figma.com/img/95c5/419c/93b6e1ba851c23a36bf98ea43e117e1c?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YTOwbSpr9N92MQCbnMkKAuTnfpLD-1gx2vvSIDo1nryBecyDKaezz0bDJ0TBPo~aP6LdqtLAHfaHS4Fsf22BZkUHAE20xEx8hE4B7o4cbsQuajAKIY8rIs1hUw38P0eUwAMVLkBeq8F0K9MVMsUx4RpoFy8ro91XCn760WSC-xCLq~SAFjNmdRufkZE~9-nM2EDSQSPzkkyOBQ1fR1x6qPZly3E0I19qdeRIAOpcBQhFAy4JHX70bV5PckjY2BrASdQNSXyTxGLBDodjmHlPNs89aIyK7W5Sr1QAYIFf-vZF-90yab7pbbbfahX-QpS4a8vVKAXoKfD4gadqZwSKYQ__" />
                <div class="flex-col justify-start items-start gap-2.5 inline-flex">
                  <div class="text-[#1a162e] text-[22px] font-medium font-['Gordita'] leading-loose">Jakir Hussen</div>
                  <div class="w-[267px] text-start text-[#1a162e] text-xl font-normal font-['Gordita'] leading-normal">Great product, I love this Coffee Beans </div>
                </div>
              </div>
              <div class="justify-start items-center gap-5 inline-flex">
                <div class="justify-start items-start gap-2 flex">
                  <FontAwesomeIcon className={cx("text-yellow-400 pr-4")} icon={faStar} />
                  <FontAwesomeIcon className={cx("text-yellow-400 pr-4")} icon={faStar} />
                  <FontAwesomeIcon className={cx("text-yellow-400 pr-4")} icon={faStar} />
                  <FontAwesomeIcon className={cx("text-yellow-400 pr-4")} icon={faStar} />

                  <div class="w-6 h-6 px-[3px] py-[3.50px] justify-center items-center flex">
                    <div class="w-[18px] h-[17px] relative">
                    </div>
                  </div>
                  <div class="w-6 h-6 px-[3px] py-[3.50px] justify-center items-center flex"></div>
                </div>
                <div class="text-[#1a162e] font-bold text-2xl font-medium font-['Gordita'] leading-relaxed">(3.5) Review</div>
              </div>
            </div>
          </div>
          <div class="h-[196px] p-[30px] bg-[#fafafd] rounded-2xl flex-col justify-start items-start gap-2.5 inline-flex">
            <div class="flex-col justify-start items-start gap-5 flex">
              <div class="justify-start items-start gap-5 inline-flex">
                <img width="60px" class="rounded-full" src="https://s3-alpha-sig.figma.com/img/95c5/419c/93b6e1ba851c23a36bf98ea43e117e1c?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YTOwbSpr9N92MQCbnMkKAuTnfpLD-1gx2vvSIDo1nryBecyDKaezz0bDJ0TBPo~aP6LdqtLAHfaHS4Fsf22BZkUHAE20xEx8hE4B7o4cbsQuajAKIY8rIs1hUw38P0eUwAMVLkBeq8F0K9MVMsUx4RpoFy8ro91XCn760WSC-xCLq~SAFjNmdRufkZE~9-nM2EDSQSPzkkyOBQ1fR1x6qPZly3E0I19qdeRIAOpcBQhFAy4JHX70bV5PckjY2BrASdQNSXyTxGLBDodjmHlPNs89aIyK7W5Sr1QAYIFf-vZF-90yab7pbbbfahX-QpS4a8vVKAXoKfD4gadqZwSKYQ__" />
                <div class="flex-col justify-start items-start gap-2.5 inline-flex">
                  <div class="text-[#1a162e] text-[22px] font-medium font-['Gordita'] leading-loose">Jakir Hussen</div>
                  <div class="w-[267px] text-start text-[#1a162e] text-xl font-normal font-['Gordita'] leading-normal">Great product, I love this Coffee Beans </div>
                </div>
              </div>
              <div class="justify-start items-center gap-5 inline-flex">
                <div class="justify-start items-start gap-2 flex">
                  <FontAwesomeIcon className={cx("text-yellow-400 pr-4")} icon={faStar} />
                  <FontAwesomeIcon className={cx("text-yellow-400 pr-4")} icon={faStar} />
                  <FontAwesomeIcon className={cx("text-yellow-400 pr-4")} icon={faStar} />
                  <FontAwesomeIcon className={cx("text-yellow-400 pr-4")} icon={faStar} />

                  <div class="w-6 h-6 px-[3px] py-[3.50px] justify-center items-center flex">
                    <div class="w-[18px] h-[17px] relative">
                    </div>
                  </div>
                  <div class="w-6 h-6 px-[3px] py-[3.50px] justify-center items-center flex"></div>
                </div>
                <div class="text-[#1a162e] font-bold text-2xl font-medium font-['Gordita'] leading-relaxed">(3.5) Review</div>
              </div>
            </div>
          </div>
          <div class="h-[196px] p-[30px] bg-[#fafafd] rounded-2xl flex-col justify-start items-start gap-2.5 inline-flex">
            <div class="flex-col justify-start items-start gap-5 flex">
              <div class="justify-start items-start gap-5 inline-flex">
                <img width="60px" class="rounded-full" src="https://s3-alpha-sig.figma.com/img/95c5/419c/93b6e1ba851c23a36bf98ea43e117e1c?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YTOwbSpr9N92MQCbnMkKAuTnfpLD-1gx2vvSIDo1nryBecyDKaezz0bDJ0TBPo~aP6LdqtLAHfaHS4Fsf22BZkUHAE20xEx8hE4B7o4cbsQuajAKIY8rIs1hUw38P0eUwAMVLkBeq8F0K9MVMsUx4RpoFy8ro91XCn760WSC-xCLq~SAFjNmdRufkZE~9-nM2EDSQSPzkkyOBQ1fR1x6qPZly3E0I19qdeRIAOpcBQhFAy4JHX70bV5PckjY2BrASdQNSXyTxGLBDodjmHlPNs89aIyK7W5Sr1QAYIFf-vZF-90yab7pbbbfahX-QpS4a8vVKAXoKfD4gadqZwSKYQ__" />
                <div class="flex-col justify-start items-start gap-2.5 inline-flex">
                  <div class="text-[#1a162e] text-[22px] font-medium font-['Gordita'] leading-loose">Jakir Hussen</div>
                  <div class="w-[267px] text-start text-[#1a162e] text-xl font-normal font-['Gordita'] leading-normal">Great product, I love this Coffee Beans </div>
                </div>
              </div>
              <div class="justify-start items-center gap-5 inline-flex">
                <div class="justify-start items-start gap-2 flex">
                  <FontAwesomeIcon className={cx("text-yellow-400 pr-4")} icon={faStar} />
                  <FontAwesomeIcon className={cx("text-yellow-400 pr-4")} icon={faStar} />
                  <FontAwesomeIcon className={cx("text-yellow-400 pr-4")} icon={faStar} />
                  <FontAwesomeIcon className={cx("text-yellow-400 pr-4")} icon={faStar} />

                  <div class="w-6 h-6 px-[3px] py-[3.50px] justify-center items-center flex">
                    <div class="w-[18px] h-[17px] relative">
                    </div>
                  </div>
                  <div class="w-6 h-6 px-[3px] py-[3.50px] justify-center items-center flex"></div>
                </div>
                <div class="text-[#1a162e] font-bold text-2xl font-medium font-['Gordita'] leading-relaxed">(3.5) Review</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
