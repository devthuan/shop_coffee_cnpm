import classNames from "classnames/bind";
import styles from "./Cart.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import {
  GetCartOfUser,
  IncreaseQuantityCart,
  DecreaseQuantityCart,
  DeleteCart,
} from "~/services/CartService";
import { useState, useEffect, useReducer, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  initCart,
  increaseCart,
  decreaseCart,
  deleteCart,
} from "~/redux/features/cart/cartSlice";
import iconDelete from "~/assets/icon/iconDelete.svg";
import { HandleApiError } from "~/Utils/HandleApiError";
import { GetAllVoucher } from "~/services/VoucherService";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import IconPlus from "~/assets/icon/Plus.svg";
import IconMinus from "~/assets/icon/Minus.svg";

const cx = classNames.bind(styles);
export const Cart = () => {
  const navigate = useNavigate();
  const carts = useSelector((state) => state.cart.data);
  const dispatch = useDispatch();
  const [cartsCheck, setCartsCheck] = useState([]);
  const [addVoucher, setAddVoucher] = useState(false);
  const [codeVoucher, setCodeVoucher] = useState("");
  const [isValidVoucher, setIsValidVoucher] = useState(false);
  const [voucher, setVoucher] = useState({});
  const refVoucher = useRef();

  console.log(cartsCheck);
  // handle increase cart
  const handleIncreaseQuantityCart = async (id) => {
    try {
      const response = await IncreaseQuantityCart(id);
      console.log(response);
      if (response && response.status === 200) {
        dispatch(increaseCart({ id }));

        setCartsCheck((prev) => {
          // Find the item to update
          const updatedCart = prev.map((item) => {
            if (item.id === id) {
              // Decrease the quantity properly (without mutation)
              return { ...item, quantity: item.quantity + 1 };
            }
            return item;
          });

          return updatedCart;
        });
      }
    } catch (error) {
      const result = HandleApiError(error);
      if (result) {
        toast.error(result);
      }
    }
  };

  const handleDecreaseQuantityCart = async (id) => {
    try {
      const response = await DecreaseQuantityCart(id);
      if (response && response.status === 200) {
        dispatch(decreaseCart({ id }));

        setCartsCheck((prev) => {
          // Find the item to update
          const updatedCart = prev.map((item) => {
            if (item.id === id) {
              // Decrease the quantity properly (without mutation)
              return { ...item, quantity: item.quantity - 1 };
            }
            return item;
          });

          return updatedCart;
        });
      }
    } catch (error) {
      const result = HandleApiError(error);
      if (result) {
        toast.error(result);
      }
    }
  };

  const handleDeleteCart = async (id) => {
    const response = await DeleteCart(id);
    if (response) {
      dispatch(deleteCart({ id }));
      setCartsCheck((prev) => {
        return prev.filter((item) => item.id !== id);
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetCartOfUser();
        console.log(response.data);
        if (response.status === 200 && response.data) {
          dispatch(initCart(response.data));
        }
      } catch (error) {
        if (error.request) {
          dispatch(initCart({ error: "Không có phản hồi từ server..." }));
        }
        const result = HandleApiError(error);
        result
          ? toast.error(result)
          : toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    };
    fetchData();
  }, [dispatch]);

  // select cart check
  const handleChangeCheckInput = async (cart) => {
    setCartsCheck((prev) => {
      const isCheck = prev.some((item) => item.id === cart.id);
      if (isCheck) {
        return prev.filter((item) => item.id !== cart.id);
      } else {
        return [...prev, cart];
      }
    });
  };

  const handleToggleVoucher = () => {
    setAddVoucher((prev) => !prev);
    if (isValidVoucher) {
      setAddVoucher(false);
      setIsValidVoucher(false);
      setCodeVoucher("");
      setVoucher({});
    }
  };

  const checkVoucher = async () => {
    try {
      const response = await GetAllVoucher();
      console.log(response.data.data);
      const isVoucher = response.data.data.find(
        (voucher) => voucher.code === codeVoucher
      );
      console.log("isVoucher", isVoucher);
      console.log("codevoucher", codeVoucher);
      if (addVoucher) {
        if (isVoucher) {
          setIsValidVoucher(true);
          setVoucher(isVoucher);
          // toast.success("Voucher hợp lệ");
        } else {
          // toast.error("Mã voucher không hợp lệ!");
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

  const switchPaynment = () => {
    let totalEstimate =
      cartsCheck.reduce((total, cart) => {
        var sellPrice;
        if (cart.productAttributes.products.productDiscount.length > 0) {
          sellPrice =
            cart.productAttributes.sellPrice -
            (cart.productAttributes.products.productDiscount[0].value / 100) *
              cart.productAttributes.sellPrice;
        } else {
          sellPrice = cart.productAttributes.sellPrice;
        }
        return total + (sellPrice || 0) * (cart.quantity || 0);
      }, 0) - (voucher.value || 0);
    if (!addVoucher && cartsCheck.length > 0) {
      navigate("../paynment", { state: { cartsCheck, totalEstimate } });
    } else if (addVoucher && isValidVoucher) {
      navigate("../paynment", {
        state: { cartsCheck, codeVoucher, totalEstimate, voucher },
      });
    } else if (addVoucher && !isValidVoucher) {
      toast.error("Vui lòng nhập mã voucher");
      if (refVoucher.current) {
        refVoucher.current.focus();
      }
    } else if (cartsCheck.length < 1) {
      toast.error("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán");
      return;
    }
  };

  console.log(cartsCheck);
  return (
    <div
      className={cx("grid lg:grid-cols-12 lg:gap-x-[30px] max-sm:gap-y-[20px]")}
    >
      <div
        className={cx(
          "lg:col-span-8 flex flex-wrap gap-y-3 p-4  shadow rounded-[20px]"
        )}
      >
        {carts &&
          carts?.map((cart, index) => (
            <>
              <div className="w-full h-[120px] justify-start items-center gap-[20px] inline-flex  ">
                <input
                  className="w-[15px] mr-2"
                  type="checkbox"
                  checked={cartsCheck.some((item) => item.id === cart.id)}
                  onChange={() => handleChangeCheckInput(cart)}
                />
                <img
                  className="w-auto h-[120px]"
                  src={cart.productAttributes.products.images[0]?.urlImage}
                />
                <div className="w-full h-full flex-col justify-start items-start  inline-flex ">
                  <div className="w-full justify-between items-start inline-flex">
                    <div className=" text-[#1a162e] text-lg font-medium font-['Gordita'] leading-relaxed">
                      {cart.productAttributes.products.name}
                    </div>
                    <div className="text-right text-[#1a162e] text-[22px] font-bold font-['Gordita'] leading-loose">
                      {/* $47.00 */}
                      {cart.productAttributes.products.productDiscount.length >
                      0
                        ? ((cart.productAttributes.sellPrice -
                            (cart.productAttributes.products.productDiscount[0]
                              .value /
                              100) *
                              cart.productAttributes.sellPrice) *
                            cart.quantity <
                          0
                            ? 0
                            : (cart.productAttributes.sellPrice -
                                (cart.productAttributes.products
                                  .productDiscount[0].value /
                                  100) *
                                  cart.productAttributes.sellPrice) *
                              cart.quantity
                          ).toLocaleString("vi-VN")
                        : (
                            cart.productAttributes.sellPrice * cart.quantity
                          ).toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </div>
                  </div>
                  <div>
                    <span
                      className={`  text-lg font-medium font-['Gordita'] leading-relaxed
                    ${
                      cart.productAttributes.products.productDiscount.length > 0
                        ? "line-through text-red-500"
                        : ""
                    }
                    `}
                    >
                      {cart.productAttributes.sellPrice.toLocaleString("vi-VN")}{" "}
                      VNĐ
                      {" | "}
                    </span>
                    {cart.productAttributes.products.productDiscount.length >
                    0 ? (
                      <span className=" text-lg font-medium font-['Gordita'] leading-relaxed">
                        {" | "}
                        {cart.productAttributes.sellPrice -
                          (cart.productAttributes.products.productDiscount[0]
                            .value /
                            100) *
                            cart.productAttributes.sellPrice <
                        0
                          ? 0
                          : cart.productAttributes.sellPrice -
                            (cart.productAttributes.products.productDiscount[0]
                              .value /
                              100) *
                              cart.productAttributes.sellPrice.toLocaleString(
                                "vi-VN"
                              )}{" "}
                        VNĐ
                        {" | "}
                      </span>
                    ) : (
                      ""
                    )}

                    <span
                      className={`${
                        cart.productAttributes.quantity > 0
                          ? "text-[#67b044]"
                          : "text-red-500"
                      } text-lg font-medium font-['Gordita'] leading-relaxed`}
                    >
                      {"  "}
                      {cart.productAttributes.quantity > 0
                        ? "Còn hàng"
                        : "Hết hàng"}
                    </span>
                  </div>
                  <div className="w-full justify-between items-center inline-flex">
                    <div className="justify-start items-start gap-5 flex">
                      <div className="px-5 py-2.5 rounded-[10px] border border-[#d2d1d6] justify-center items-center gap-2.5 flex">
                        <div className="text-[#1a162e] text-[15px] font-medium font-['Gordita'] leading-snug text-center">
                          {/* LavAzza */}
                          {cart.productAttributes?.attributes?.name}
                        </div>
                        <div className="w-6 h-6 justify-center items-center flex">
                          <div className="w-6 h-6 px-[5px] justify-center items-center inline-flex" />
                        </div>
                      </div>
                      <div className="px-5 py-2.5 rounded-[10px] border border-[#d2d1d6] justify-center items-center gap-2.5 flex">
                        <div className="w-6 h-6 p-0.5 justify-center items-center flex">
                          <div
                            onClick={() => handleDecreaseQuantityCart(cart.id)}
                            className="w-5 h-5 relative"
                          >
                            <img src={IconMinus} alt="" srcset="" />
                          </div>
                        </div>
                        <div className="text-[#1a162e] text-[15px] font-medium font-['Gordita'] leading-snug">
                          {cart.quantity}
                        </div>
                        <div className="w-6 h-6 p-0.5 justify-center items-center flex">
                          <div
                            onClick={() => handleIncreaseQuantityCart(cart.id)}
                            className="w-5 h-5 relative"
                          >
                            <img src={IconPlus} alt="" srcset="" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="justify-start items-start gap-[30px] flex">
                      <div
                        onClick={() => handleDeleteCart(cart.id)}
                        className=" cursor-pointer justify-start items-start gap-2.5 flex"
                      >
                        <div className="w-6 h-6 pl-[3.75px] pr-[3.29px] py-[2.75px] justify-center items-center flex">
                          <div className="w-[16.96px] h-[18.50px] relative">
                            <img src={iconDelete} alt="" srcset="" />
                          </div>
                        </div>
                        <div className="hover:text-red-600  text-base font-medium font-['Gordita'] leading-normal">
                          Xoá
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[859px] h-px bg-[#d2d1d6]" />
            </>
          ))}

        <div
          className={cx(
            "lg:col-span-12 flex justify-between items-center w-full px-4"
          )}
        >
          <div className="flex items-center">
            <FontAwesomeIcon style={{ opacity: 0.5 }} icon={faAngleLeft} />
            <p
              style={{
                paddingLeft: "6px",
                color: "#1A162E",
                fontSize: 18,
                fontFamily: "Gordita",
                fontWeight: "500",
                wordWrap: "break-word",
              }}
            >
              Continue Shopping
            </p>
          </div>
          {/* <div>
            <div
              className={cx("pb-4")}
              style={{ borderBottom: "1px solid #ccc" }}
            >
              <div className="flex items-center p-2 justify-between">
                <p
                  style={{
                    color: "#1A162E",
                    fontSize: 18,
                    fontFamily: "Gordita",
                    fontWeight: "500",
                  }}
                  className={cx("pr-20 ")}
                >
                  Tạm tính
                </p>
                <p
                  style={{
                    color: "#1A162E",
                    fontSize: 18,
                    fontFamily: "Gordita",
                    fontWeight: "500",
                  }}
                  className={cx()}
                >
                  {carts &&
                    carts.data &&
                    carts.data
                      .reduce((total, cart) => {
                        var sellPrice;
                        if (
                          cart.productAttributes.products.productDiscount
                            .length > 0
                        ) {
                          sellPrice =
                            cart.productAttributes.sellPrice -
                            (cart.productAttributes.products.productDiscount[0]
                              .value /
                              100) *
                              cart.productAttributes.sellPrice;
                        } else {
                          sellPrice = cart.productAttributes.sellPrice;
                        }
                        const quantity = cart.quantity || 0;
                        return total + sellPrice * quantity;
                      }, 0)
                      .toLocaleString("vi-VN") + " đ"}
                </p>
              </div>

              <div className="flex items-center justify-between p-2">
                <p
                  style={{
                    color: "#1A162E",
                    fontSize: 18,
                    fontFamily: "Gordita",
                    fontWeight: "500",
                  }}
                  className={cx("pr-20")}
                >
                  Shipping
                </p>
                <p
                  style={{
                    color: "#1A162E",
                    fontSize: 18,
                    fontFamily: "Gordita",
                    fontWeight: "500",
                  }}
                  className={cx()}
                >
                  10%
                </p>
              </div>
            </div>
            <div className="flex items-center p-2 justify-between mt-6">
              <p
                style={{
                  color: "#1A162E",
                  fontSize: 18,
                  fontFamily: "Gordita",
                  fontWeight: "500",
                }}
                className={cx("pr-20")}
              >
                Total
              </p>
              <p
                style={{
                  color: "rgb(255, 66, 78)",
                  fontSize: 18,
                  fontFamily: "Gordita",
                  fontWeight: "500",
                }}
              >
                {carts &&
                  carts &&
                  (
                    carts.data.reduce((total, cart) => {
                      var sellPrice;
                      if (
                        cart.productAttributes.products.productDiscount.length >
                        0
                      ) {
                        sellPrice =
                          cart.productAttributes.sellPrice -
                          (cart.productAttributes.products.productDiscount[0]
                            .value /
                            100) *
                            cart.productAttributes.sellPrice;
                      } else {
                        sellPrice = cart.productAttributes.sellPrice;
                      }
                      const quantity = cart.quantity || 0;
                      return total + sellPrice * quantity;
                    }, 0) * 1.1
                  ).toLocaleString("vi-VN") + " đ"}
              </p>
            </div>
          </div> */}
        </div>
      </div>

      <div
        className={cx(
          "lg:col-span-4 p-5 flex flex-col  gap-y-5  shadow rounded-[20px]"
        )}
      >
        <div className={cx("w-full flex justify-between")}>
          <div className={cx("flex items-center")}>
            <p
              style={{
                color: "#1A162E",
                fontSize: 18,
                fontFamily: "Garamond, serif",
                fontWeight: "500",
              }}
              className={cx("text-lg font-medium")}
            >
              Subtotal
            </p>
            <p style={{ fontSize: 17, paddingLeft: "3px" }}>(items)</p>
          </div>
          {cartsCheck.length > 0 ? (
            <p
              style={{ fontFamily: "Gordita, sans-serif", fontSize: "20px" }}
              className={cx("text-2xl")}
            >
              {cartsCheck.length}
            </p>
          ) : (
            <p
              style={{ fontFamily: "Gordita, sans-serif", fontSize: "20px" }}
              className={cx("text-2xl")}
            >
              0
            </p>
          )}
        </div>

        <div className={cx("w-full flex justify-between")}>
          <div className={cx("flex items-center")}>
            <p
              style={{
                color: "#1A162E",
                fontSize: 18,
                fontFamily: "Garamond, serif",
                fontWeight: "500",
              }}
              className={cx("text-lg font-medium")}
            >
              Tạm tính
            </p>
            {/* <p style={{ fontSize: 16, paddingLeft: '3px' }}>(Total)</p> */}
          </div>
          <p
            style={{ fontFamily: "Gordita, sans-serif", fontSize: "20px" }}
            className={cx("text-2xl")}
          >
            {cartsCheck &&
              cartsCheck
                .reduce((total, cart) => {
                  var sellPrice;
                  if (
                    cart.productAttributes.products.productDiscount.length > 0
                  ) {
                    sellPrice =
                      cart.productAttributes.sellPrice -
                      (cart.productAttributes.products.productDiscount[0]
                        .value /
                        100) *
                        cart.productAttributes.sellPrice;
                  } else {
                    sellPrice = cart.productAttributes.sellPrice;
                  }
                  const quantity = cart.quantity || 0;
                  return total + (sellPrice || 0) * quantity < 0
                    ? 0
                    : total + (sellPrice || 0) * quantity;
                }, 0)
                .toLocaleString("vi-VN") + " VNĐ"}
          </p>
        </div>

        <div className={cx("w-full flex justify-between")}>
          <div className={cx("flex items-center")}>
            <p
              style={{
                color: "#1A162E",
                fontSize: 18,
                fontFamily: "Garamond, serif",
                fontWeight: "500",
              }}
              className={cx("text-lg font-medium")}
            >
              Giảm giá từ Deal
            </p>
          </div>
          <p
            style={{ fontFamily: "Gordita, sans-serif" }}
            className={cx("text-xl")}
          ></p>
        </div>

        <div className={cx("w-full flex justify-between")}>
          <div className={cx("w-1/2 flex items-center")}>
            <p
              style={{
                color: "#1A162E",
                fontSize: 18,
                fontFamily: "Garamond, serif",
                fontWeight: "500",
              }}
              className={cx("text-lg font-medium mr-2")}
            >
              Voucher
            </p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                onClick={handleToggleVoucher}
                type="checkbox"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600"></div>
              <div className="absolute w-5 h-5 bg-white border border-gray-300 rounded-full transition-all peer-checked:translate-x-5 peer-checked:border-white"></div>
            </label>
          </div>

          {addVoucher &&
            (!isValidVoucher ? (
              <div className="w-1/2 flex flex-col">
                <div className="flex mb-2">
                  {" "}
                  {/* Thêm div này để chứa input */}
                  <input
                    ref={refVoucher}
                    onChange={(e) => setCodeVoucher(e.target.value)}
                    value={codeVoucher}
                    className="w-full border border-gray-300 rounded outline-none text-[20px] mr-2" // Thêm margin phải để tạo khoảng cách với button
                    type="text"
                  />
                </div>
                <button
                  onClick={() => checkVoucher()}
                  className="p-2 bg-blue-500 text-[17px] text-white rounded-md shadow hover:bg-blue-600"
                >
                  Xác nhận Voucher
                </button>
              </div>
            ) : (
              <div className={cx("w-full flex justify-end")}>
                <p
                  style={{ fontFamily: "Gordita, sans-serif" }}
                  className={cx("text-xl")}
                >
                  {voucher.value}
                </p>
              </div>
            ))}
        </div>

        <div className={cx("w-full flex justify-between")}></div>
        <div className={cx("border-t border-gray-300 pt-4")}>
          <div className={cx("w-full flex justify-between")}>
            <div className={cx("flex items-center")}>
              <p
                style={{
                  color: "#1A162E",
                  fontSize: 18,
                  fontFamily: "Garamond, serif",
                  fontWeight: "600",
                }}
                className={cx("text-lg font-medium")}
              >
                Tổng tiền ước tính
              </p>
            </div>
            <p
              style={{
                fontFamily: "Gordita, sans-serif",
                color: "rgb(255, 66, 78)",
              }}
              className={cx("text-xl font-semibold")}
            >
              {/* {cartsCheck.length > 0
                ? `${(
                    cartsCheck.reduce((total, cart) => {
                      var sellPrice;
                      if (
                        cart.productAttributes.products.productDiscount.length >
                        0
                      ) {
                        sellPrice =
                          cart.productAttributes.sellPrice -
                          (cart.productAttributes.products.productDiscount[0]
                            .value /
                            100) *
                            cart.productAttributes.sellPrice;
                      } else {
                        sellPrice = cart.productAttributes.sellPrice;
                      }
                      return total + (sellPrice || 0) * (cart.quantity || 0) < 0
                        ? 0
                        : total + (sellPrice || 0) * (cart.quantity || 0);
                    }, 0) - (voucher.value || 0)
                  ).toLocaleString("vi-VN")} VNĐ`
                : 0} */}

              {cartsCheck &&
                cartsCheck
                  .reduce((total, cart) => {
                    var sellPrice;
                    if (
                      cart.productAttributes.products.productDiscount.length > 0
                    ) {
                      sellPrice =
                        cart.productAttributes.sellPrice -
                        (cart.productAttributes.products.productDiscount[0]
                          .value /
                          100) *
                          cart.productAttributes.sellPrice;
                    } else {
                      sellPrice = cart.productAttributes.sellPrice;
                    }
                    const quantity = cart.quantity || 0;
                    return total + (sellPrice || 0) * quantity < 0
                      ? 0
                      : total + (sellPrice || 0) * quantity;
                  }, 0)
                  .toLocaleString("vi-VN") + " VNĐ"}
            </p>
          </div>
        </div>
        <div className={cx("pt-4")}>
          <button
            onClick={switchPaynment}
            className={cx(
              "text-xl w-full h-[50px] bg-blue-500 text-white py-2 px-4 rounded-full"
            )}
          >
            Continue to checkout
          </button>
        </div>
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
};
