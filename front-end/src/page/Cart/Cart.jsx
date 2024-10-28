import classNames from "classnames/bind";
import styles from "./Cart.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { GetCartOfUser, IncreaseQuantityCart, DecreaseQuantityCart, DeleteCart } from "~/services/CartService";
import { useState, useEffect, useReducer, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initCart, increaseCart, decreaseCart, deleteCart } from "~/redux/features/cart/cartSlice";
import { HandleApiError } from "~/Utils/HandleApiError";
import { GetAllVoucher } from "~/services/VoucherService";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);
export const Cart = () => {
  const navigate = useNavigate()
  const carts = useSelector(state => state.cart)
  const dispatch = useDispatch()
  const [cartsCheck, setCartsCheck] = useState([])
  const [addVoucher, setAddVoucher] = useState(false)
  const [codeVoucher, setCodeVoucher] = useState('')
  const [isValidVoucher, setIsValidVoucher] = useState(false)
  const [voucher, setVoucher] = useState({})
  const refVoucher = useRef()
  // handle increase cart
  const handleIncreaseQuantityCart = async (id) => {
    try {
      const response = await IncreaseQuantityCart(id)
      console.log(response)
      if (response && response.status === 200) {
        dispatch(increaseCart({ id }))
      }
    } catch (error) {
      const result = HandleApiError(error)
      if (result) {
        toast.error(result)
      }
    }
  }

  const handleDecreaseQuantityCart = async (id) => {
    try {

      const response = await DecreaseQuantityCart(id)
      if (response && response.status === 200) {
        dispatch(decreaseCart({ id }))
      }
    } catch (error) {
      const result = HandleApiError(error)
      if (result) {
        toast.error(result)
      }
    }
  }

  const handleDeleteCart = async (id) => {
    const response = await DeleteCart(id)
    if (response) {
      dispatch(deleteCart({ id }))
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetCartOfUser();
        console.log(response.data)
        if (response.status === 200 && response.data) {
          dispatch(initCart(response.data));
        }
      } catch (error) {
        if (error.request) {
          dispatch(
            initCart({ error: "Không có phản hồi từ server..." })
          );
        }
        const result = HandleApiError(error);
        result
          ? toast.error(result)
          : toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    };
    fetchData()
  }, [dispatch])

  // select cart check 
  const handleChangeCheckInput = async (cart) => {
    setCartsCheck(prev => {
      const isCheck = prev.some(item => item.id === cart.id)
      if (isCheck) {
        return prev.filter(item => item.id !== cart.id)
      }
      else {
        return [...prev, cart]
      }
    })
  }


  const handleToggleVoucher = () => {
    setAddVoucher(prev => !prev);
    if (isValidVoucher) {
      setAddVoucher(false)
      setIsValidVoucher(false)
      setCodeVoucher('')
      setVoucher({})
    }
  };

  const checkVoucher = async () => {
    try {
      const response = await GetAllVoucher();
      const isVoucher = response.data.data.find(voucher => voucher.code === codeVoucher);
      if (addVoucher) {
        if (isVoucher) {
          toast.success("Voucher hợp lệ")
          setIsValidVoucher(true)
          setVoucher(isVoucher)
        } else {
          toast.error("Mã voucher không hợp lệ!");
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
    if (!addVoucher && cartsCheck.length > 0) {
      navigate('../paynment', { state: { cartsCheck } })
    }
    else if (addVoucher && isValidVoucher) {
      navigate('../paynment', { state: { cartsCheck, codeVoucher } })
    }
    else if (addVoucher && !isValidVoucher) {
      toast.error("Vui lòng nhập mã voucher")
      if (refVoucher.current) {
        refVoucher.current.focus()
      }
    }
    else if (cartsCheck.length < 1) {
      toast.error("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán")
      return
    }
  }


  console.log(cartsCheck)
  return (
    <div className={cx("grid lg:grid-cols-12 lg:gap-x-[30px] max-sm:gap-y-[20px]")}>
      <div className={cx("lg:col-span-8 flex flex-wrap ")}>

        {carts && carts.data.map((cart, index) => (

          <div key={index} className={cx("flex mt-2 w-full")}>
            <input className="w-[15px] mr-3" type="checkbox"
              checked={cartsCheck.some(item => item.id === cart.id)}
              onChange={() => handleChangeCheckInput(cart)}
            />
            <img className="w-[15%] h-[120px]" src={cart.productAttributes.products.images[0].urlImage} alt="" />
            <div className={cx("justify-start py-3 px-2 w-[80%] ")}>
              <div className={cx("flex justify-between")}>
                <p class="text-left text-[#1A162E] text-[20px] font-tahoma font-medium break-words">
                  {cart.productAttributes.products.name}
                </p>

                <p class="text-[#ff424e] text-[20px] font-arial font-medium break-words">
                  {cart.productAttributes.products.productDiscount.length > 0
                    ? ((cart.productAttributes.sellPrice - (cart.productAttributes.products.productDiscount[0].value) / 100 * cart.productAttributes.sellPrice) * cart.quantity).toLocaleString('vi-VN')
                    : (cart.productAttributes.sellPrice * cart.quantity).toLocaleString("vi-VN")}đ
                </p>

              </div>
              <div style={{ width: '100%' }} className={cx("flex justify-between items-center mt-2")}>
                <div className="flex">
                  {cart.productAttributes.products.productDiscount.length > 0 && (
                    <span className="line-through" style={{ paddingRight: '5px', color: '#9E9DA8', fontSize: 18, fontFamily: 'Gordita', fontWeight: '500', wordWrap: 'break-word' }} >{(cart.productAttributes.sellPrice).toLocaleString("vi-VN")}đ |</span>
                  )}
                  <span style={{ paddingRight: '5px', color: '#9E9DA8', fontSize: 18, fontFamily: 'Gordita', fontWeight: '500', wordWrap: 'break-word' }}  >{((cart.productAttributes.sellPrice) - (cart.productAttributes.products?.productDiscount.length > 0 ? cart.productAttributes.products?.productDiscount[0].value : 0) / 100 * cart.productAttributes.sellPrice).toLocaleString('vi-VN')}đ |</span>

                  <span style={{ paddingLeft: '5px', color: '#67B044', fontSize: 18, fontFamily: 'Gordita', fontWeight: '500', wordWrap: 'break-word' }}>In Stock</span>
                </div>
                <input value={cart.productAttributes?.attributes?.name} style={{ height: 32, width: 100, fontSize: '20px', paddingLeft: 10, alignItems: 'center', borderRadius: 10, border: '1px #D2D1D6 solid', display: 'flex' }} readOnly></input>
              </div>

              <div className={cx("flex items-center w-full")}>
                <div className={cx("flex items-center w-1/2 ")}>
                  <div style={{ width: '50%', height: 44, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 20, display: 'inline-flex' }}>
                    <div style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10, borderRadius: 10, border: '1px #D2D1D6 solid', justifyContent: 'center', gap: 10, display: 'flex' }}>
                      <div onClick={() => handleDecreaseQuantityCart(cart.id)} style={{ width: 24, height: 24, padding: 2, justifyContent: 'center', alignItems: 'center', display: 'flex', cursor: 'pointer' }}>
                        <div style={{ width: 20, height: 20, position: 'relative' }}>
                          <div style={{ width: 7.33, height: 0.95, left: 6.33, top: 9.51, position: 'absolute', border: '1.50px #1A162E solid' }}></div>
                          <div style={{ width: 20, height: 20, left: 0, top: 0, position: 'absolute', border: '1.50px #1A162E solid', borderRadius: '4px' }}></div>
                        </div>
                      </div>

                      <div style={{ color: '#1A162E', fontSize: 15, fontFamily: 'Gordita', fontWeight: '500', wordWrap: 'break-word' }}>{cart.quantity}</div>

                      <div onClick={() => handleIncreaseQuantityCart(cart.id)} style={{ width: 24, height: 24, padding: 2, justifyContent: 'center', alignItems: 'center', display: 'flex', cursor: 'pointer' }}>
                        <div style={{ width: 20, height: 20, position: 'relative' }}>
                          <div style={{ width: 0.95, height: 7.33, left: 9.52, top: 6.33, position: 'absolute', border: '1.50px #1A162E solid' }}></div>
                          <div style={{ width: 7.33, height: 0.95, left: 6.33, top: 9.51, position: 'absolute', border: '1.50px #1A162E solid' }}></div>
                          <div style={{ width: 20, height: 20, left: 0, top: 0, position: 'absolute', border: '1.50px #1A162E solid', borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={cx("flex items-center w-1/2 justify-end")}>
                  <div style={{ justifyContent: 'end', width: 191, height: 24, alignItems: 'flex-start', gap: 30, display: 'inline-flex' }}>
                    <div style={{ alignItems: 'center', gap: 10, display: 'flex', cursor: 'pointer' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 22 20" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.87187 9.59832C0.798865 6.24832 2.05287 2.41932 5.56987 1.28632C7.41987 0.689322 9.46187 1.04132 10.9999 2.19832C12.4549 1.07332 14.5719 0.693322 16.4199 1.28632C19.9369 2.41932 21.1989 6.24832 20.1269 9.59832C18.4569 14.9083 10.9999 18.9983 10.9999 18.9983C10.9999 18.9983 3.59787 14.9703 1.87187 9.59832Z" stroke="#9E9DA8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M15 4.69995C16.07 5.04595 16.826 6.00095 16.917 7.12195" stroke="#9E9DA8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <p style={{ color: '#9E9DA8', fontSize: 16, fontFamily: 'Gordita', fontWeight: '500', wordWrap: 'break-word' }}>Save</p>
                    </div>
                    <div onClick={() => handleDeleteCart(cart.id)} style={{ alignItems: 'center', gap: 10, display: 'flex', cursor: 'pointer' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                        <path d="M16.3248 7.46875C16.3248 7.46875 15.7818 14.2037 15.4668 17.0407C15.3168 18.3957 14.4798 19.1898 13.1088 19.2148C10.4998 19.2618 7.88779 19.2648 5.27979 19.2098C3.96079 19.1828 3.13779 18.3788 2.99079 17.0478C2.67379 14.1858 2.13379 7.46875 2.13379 7.46875" stroke="#9E9DA8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M17.708 4.24023H0.75" stroke="#9E9DA8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M14.4406 4.23998C13.6556 4.23998 12.9796 3.68498 12.8256 2.91598L12.5826 1.69998C12.4326 1.13898 11.9246 0.750977 11.3456 0.750977H7.11258C6.53358 0.750977 6.02558 1.13898 5.87558 1.69998L5.63258 2.91598C5.47858 3.68498 4.80258 4.23998 4.01758 4.23998" stroke="#9E9DA8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <div style={{ color: '#9E9DA8', fontSize: 16, fontFamily: 'Gordita', fontWeight: '500', wordWrap: 'break-word' }}>Delete</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className={cx("lg:col-span-12 flex justify-between items-center w-full px-4")}>
          <div className="flex items-center">
            <FontAwesomeIcon style={{ opacity: 0.5 }} icon={faAngleLeft} />
            <p style={{ paddingLeft: '6px', color: '#1A162E', fontSize: 18, fontFamily: 'Gordita', fontWeight: '500', wordWrap: 'break-word' }}>Continue Shopping</p>
          </div>
          <div>
            <div className={cx("pb-4")} style={{ borderBottom: '1px solid #ccc' }}>
              <div className="flex items-center p-2 justify-between">
                <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Gordita', fontWeight: '500', }} className={cx("pr-20 ")}>
                  Tạm tính
                </p>
                <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Gordita', fontWeight: '500', }} className={cx()}>
                  {carts && carts.data && (
                    carts.data.reduce((total, cart) => {
                      var sellPrice;
                      if (cart.productAttributes.products.productDiscount.length > 0) {
                        sellPrice = cart.productAttributes.sellPrice - (cart.productAttributes.products.productDiscount[0].value) / 100 * cart.productAttributes.sellPrice
                      }
                      else {
                        sellPrice = cart.productAttributes.sellPrice
                      }
                      const quantity = cart.quantity || 0;
                      return total + (sellPrice * quantity);
                    }, 0).toLocaleString('vi-VN') + ' đ'
                  )}

                </p>
              </div>

              <div className="flex items-center justify-between p-2">
                <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Gordita', fontWeight: '500', }} className={cx("pr-20")}>Shipping</p>
                <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Gordita', fontWeight: '500', }} className={cx()}>
                  10%
                </p>
              </div>
            </div>
            <div className="flex items-center p-2 justify-between mt-6">
              <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Gordita', fontWeight: '500', }} className={cx("pr-20")}>Total</p>
              <p style={{ color: 'rgb(255, 66, 78)', fontSize: 18, fontFamily: 'Gordita', fontWeight: '500', }} >
                {carts && carts && (
                  (carts.data.reduce((total, cart) => {
                    var sellPrice;
                    if (cart.productAttributes.products.productDiscount.length > 0) {
                      sellPrice = cart.productAttributes.sellPrice - (cart.productAttributes.products.productDiscount[0].value) / 100 * cart.productAttributes.sellPrice
                    }
                    else {
                      sellPrice = cart.productAttributes.sellPrice
                    }
                    const quantity = cart.quantity || 0;
                    return total + (sellPrice * quantity);
                  }, 0) * 1.1).toLocaleString('vi-VN') + ' đ'
                )}
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className={cx("lg:col-span-4 py-4 flex flex-col  gap-y-5")}>
        <div className={cx("w-full flex justify-between")}>
          <div className={cx('flex items-center')}>
            <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Garamond, serif', fontWeight: '500' }} className={cx("text-lg font-medium")}>Subtotal</p>
            <p style={{ fontSize: 17, paddingLeft: '3px' }}>(items)</p>
          </div>
          {cartsCheck.length > 0 ? (
            <p style={{ fontFamily: 'Gordita, sans-serif', fontSize: '20px' }} className={cx("text-2xl")}>{cartsCheck.length}</p>
          ) : <p style={{ fontFamily: 'Gordita, sans-serif', fontSize: '20px' }} className={cx("text-2xl")}>0</p>}
        </div>

        <div className={cx("w-full flex justify-between")}>
          <div className={cx('flex items-center')}>
            <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Garamond, serif', fontWeight: '500' }} className={cx("text-lg font-medium")}>Tạm tính</p>
            {/* <p style={{ fontSize: 16, paddingLeft: '3px' }}>(Total)</p> */}
          </div>
          <p style={{ fontFamily: 'Gordita, sans-serif', fontSize: '20px' }} className={cx("text-2xl")}>
            {cartsCheck.length > 0 ? (
              `${cartsCheck.reduce((total, cart) => {
                var sellPrice;
                if (cart.productAttributes.products.productDiscount.length > 0) {
                  sellPrice = cart.productAttributes.sellPrice - (cart.productAttributes.products.productDiscount[0].value) / 100 * cart.productAttributes.sellPrice
                }
                else {
                  sellPrice = cart.productAttributes.sellPrice
                }
                return total + (sellPrice || 0) * (cart.quantity || 0);
              }, 0).toLocaleString('vi-VN')} `
            ) : 0}
          </p>
        </div>

        <div className={cx("w-full flex justify-between")}>
          <div className={cx('flex items-center')}>
            <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Garamond, serif', fontWeight: '500' }} className={cx("text-lg font-medium")}>Giảm giá từ Deal</p>
          </div>
          <p style={{ fontFamily: 'Gordita, sans-serif' }} className={cx("text-xl")}>

          </p>
        </div>


        <div className={cx("w-full flex justify-between")}>
          <div className={cx('w-1/2 flex items-center')}>
            <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Garamond, serif', fontWeight: '500' }} className={cx("text-lg font-medium mr-2")}>Voucher</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input onClick={handleToggleVoucher} type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600"></div>
              <div className="absolute w-5 h-5 bg-white border border-gray-300 rounded-full transition-all peer-checked:translate-x-5 peer-checked:border-white"></div>
            </label>
          </div>

          {addVoucher && (
            !isValidVoucher ? (
              <div className="w-1/2 flex flex-col">
                <div className="flex mb-2"> {/* Thêm div này để chứa input */}
                  <input
                    ref={refVoucher}
                    onChange={(e) => setCodeVoucher(e.target.value)}
                    value={codeVoucher}
                    className="w-full border border-gray-300 rounded outline-none text-[20px] mr-2" // Thêm margin phải để tạo khoảng cách với button
                    type="text"
                  />
                </div>
                <button onClick={() => checkVoucher()} className="p-2 bg-blue-500 text-[17px] text-white rounded-md shadow hover:bg-blue-600">
                  Xác nhận Voucher
                </button>
              </div>
            ) :
              <div className={cx("w-full flex justify-end")}>
                <p style={{ fontFamily: 'Gordita, sans-serif' }} className={cx("text-xl")}>{voucher.value}</p>
              </div>
          )}
        </div>



        <div className={cx("w-full flex justify-between")}>
          <div className={cx('flex items-center')}>
            <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Garamond, serif', fontWeight: '500' }} className={cx("text-lg font-medium")}>Shipping</p>
          </div>
          <p style={{ fontFamily: 'Gordita, sans-serif' }} className={cx("text-xl")}>10%</p>
        </div>
        <div className={cx("border-t border-gray-300 pt-4")}>
          <div className={cx("w-full flex justify-between")}>
            <div className={cx('flex items-center')}>
              <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Garamond, serif', fontWeight: '600' }} className={cx("text-lg font-medium")}>Estimated Total</p>
            </div>
            <p style={{ fontFamily: 'Gordita, sans-serif', color: 'rgb(255, 66, 78)' }} className={cx("text-xl font-semibold")}>
              {cartsCheck.length > 0 ? (
                `${(cartsCheck.reduce((total, cart) => {
                  var sellPrice;
                  if (cart.productAttributes.products.productDiscount.length > 0) {
                    sellPrice = cart.productAttributes.sellPrice - (cart.productAttributes.products.productDiscount[0].value) / 100 * cart.productAttributes.sellPrice
                  }
                  else {
                    sellPrice = cart.productAttributes.sellPrice
                  }
                  return total + (sellPrice || 0) * (cart.quantity || 0);
                }, 0) * 1.1 - (voucher.value || 0)).toLocaleString('vi-VN')} đ`
              ) : 0}
            </p>
          </div>
        </div>
        <div className={cx("pt-4")}>
          <button onClick={switchPaynment} className={cx("text-xl w-full h-[50px] bg-blue-500 text-white py-2 px-4 rounded-full")}>Continue to checkout</button>
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
