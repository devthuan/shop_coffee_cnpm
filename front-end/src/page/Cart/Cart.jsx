import classNames from "classnames/bind";
import styles from "./Cart.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { GetCartOfUser, IncreaseQuantityCart, DecreaseQuantityCart, DeleteCart } from "~/services/CartService";
import { useState, useEffect } from "react";
const cx = classNames.bind(styles);
export const Cart = () => {
  const [carts, setCarts] = useState([])
  const [cartsCheck, setCartsCheck] = useState([])

  // handle increase cart
  const handleIncreaseQuantityCart = async (id) => {
    await IncreaseQuantityCart(id)
  }

  const handleDecreaseQuantityCart = async (id) => {
    await DecreaseQuantityCart(id)
  }

  const handleDeleteCart = async (id) => {
    await DeleteCart(id)
  }

  useEffect(() => {
    const fetchCartsData = async () => {
      try {
        const response = await GetCartOfUser();
        console.log(response.data.length)
        setCarts(response)
      }
      catch (error) {
        console.log("Error when get cart : ", error);
      }
    }
    fetchCartsData()
  }, [handleIncreaseQuantityCart, handleDecreaseQuantityCart, handleDeleteCart])

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


  return (
    <div className={cx("grid lg:grid-cols-12 lg:gap-x-[30px] max-sm:gap-y-[20px]")}>
      <div className={cx("lg:col-span-8 flex flex-wrap")}>

        {carts && carts.data && carts.data.map((cart, index) => (

          <div key={index} style={{ width: '100%' }} className={cx("flex mt-2")}>
            <input className="w-[15px] mr-3" type="checkbox"
              checked={cartsCheck.some(item => item.id === cart.id)}
              onChange={() => handleChangeCheckInput(cart)}
            />
            <img style={{ width: '18%', height: 150 }} src={cart.productAttributes.products.images[0].urlImage}  alt="" />
            <div style={{ width: '80%' }} className={cx("justify-start py-3 px-2 ")}>
              <div className={cx("flex justify-between")}>
                <p style={{ textAlign: 'start', color: '#1A162E', fontSize: '18px', fontStyle: 'normal', fontFamily: ' Tahoma, sans-serif', fontWeight: '500', wordWrap: 'break-word' }}>{cart.productAttributes.products.name}</p>
                <p style={{ color: '#1A162E', fontSize: '20px', fontFamily: 'Arial, sans-serif', fontWeight: '700', wordWrap: 'break-word' }}>{(cart.productAttributes.sellPrice * cart.quantity).toLocaleString("vi-VN")}đ</p>
              </div>
              <div style={{ width: '100%' }} className={cx("flex justify-between items-center mt-2")}>
                <div className="flex">
                  <span style={{ color: '#9E9DA8', fontSize: 18, fontFamily: 'Gordita', fontWeight: '500', wordWrap: 'break-word' }} >{(cart.productAttributes.sellPrice).toLocaleString("vi-VN")}đ |</span>
                  <span style={{ paddingLeft: '5px', color: '#67B044', fontSize: 18, fontFamily: 'Gordita', fontWeight: '500', wordWrap: 'break-word' }}>In Stock</span>
                </div>
                <select style={{ height: 32, fontSize: '20px', paddingLeft: 10, alignItems: 'center', borderRadius: 10, border: '1px #D2D1D6 solid', display: 'flex' }}>
                  <option value="">{cart.productAttributes.products.category.name}</option>
                </select>
              </div>

              <div className={cx("flex items-center w-full")}>
                <div className={cx("flex items-center w-1/2 ")}>
                  <div style={{ width: '50%', height: 44, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 20, display: 'inline-flex' }}>
                    <div style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10, borderRadius: 10, border: '1px #D2D1D6 solid', justifyContent: 'center', gap: 10, display: 'flex' }}>
                      <div onClick={() => handleDecreaseQuantityCart(cart.id)} style={{ width: 24, height: 24, padding: 2, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                        <div style={{ width: 20, height: 20, position: 'relative' }}>
                          <div style={{ width: 7.33, height: 0.95, left: 6.33, top: 9.51, position: 'absolute', border: '1.50px #1A162E solid' }}></div>
                          <div style={{ width: 20, height: 20, left: 0, top: 0, position: 'absolute', border: '1.50px #1A162E solid', borderRadius: '4px' }}></div>
                        </div>
                      </div>

                      <div style={{ color: '#1A162E', fontSize: 15, fontFamily: 'Gordita', fontWeight: '500', wordWrap: 'break-word' }}>{cart.quantity}</div>

                      <div onClick={() => handleIncreaseQuantityCart(cart.id)} style={{ width: 24, height: 24, padding: 2, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
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
                    <div style={{ alignItems: 'center', gap: 10, display: 'flex', }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 22 20" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.87187 9.59832C0.798865 6.24832 2.05287 2.41932 5.56987 1.28632C7.41987 0.689322 9.46187 1.04132 10.9999 2.19832C12.4549 1.07332 14.5719 0.693322 16.4199 1.28632C19.9369 2.41932 21.1989 6.24832 20.1269 9.59832C18.4569 14.9083 10.9999 18.9983 10.9999 18.9983C10.9999 18.9983 3.59787 14.9703 1.87187 9.59832Z" stroke="#9E9DA8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M15 4.69995C16.07 5.04595 16.826 6.00095 16.917 7.12195" stroke="#9E9DA8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <p style={{ color: '#9E9DA8', fontSize: 16, fontFamily: 'Gordita', fontWeight: '500', wordWrap: 'break-word' }}>Save</p>
                    </div>
                    <div style={{ alignItems: 'center', gap: 10, display: 'flex' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                        <path d="M16.3248 7.46875C16.3248 7.46875 15.7818 14.2037 15.4668 17.0407C15.3168 18.3957 14.4798 19.1898 13.1088 19.2148C10.4998 19.2618 7.88779 19.2648 5.27979 19.2098C3.96079 19.1828 3.13779 18.3788 2.99079 17.0478C2.67379 14.1858 2.13379 7.46875 2.13379 7.46875" stroke="#9E9DA8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M17.708 4.24023H0.75" stroke="#9E9DA8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M14.4406 4.23998C13.6556 4.23998 12.9796 3.68498 12.8256 2.91598L12.5826 1.69998C12.4326 1.13898 11.9246 0.750977 11.3456 0.750977H7.11258C6.53358 0.750977 6.02558 1.13898 5.87558 1.69998L5.63258 2.91598C5.47858 3.68498 4.80258 4.23998 4.01758 4.23998" stroke="#9E9DA8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <div onClick={() => DeleteCart(cart.id)} style={{ color: '#9E9DA8', fontSize: 16, fontFamily: 'Gordita', fontWeight: '500', wordWrap: 'break-word' }}>Delete</div>
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
                  Total
                </p>
                <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Gordita', fontWeight: '500', }} className={cx()}>
                  {carts && carts.data && (
                    carts.data.reduce((total, cart) => {
                      const sellPrice = cart.productAttributes.sellPrice || 0;
                      const quantity = cart.quantity || 0;
                      return total + (sellPrice * quantity);
                    }, 0).toLocaleString('vi-VN') + ' đ'
                  )}

                </p>
              </div>
              <div className="flex items-center justify-between p-2">
                <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Gordita', fontWeight: '500', }} className={cx("pr-20")}>Shipping</p>
                <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Gordita', fontWeight: '500', }} className={cx()}>$10:00</p>
              </div>
            </div>
            <div className="flex items-center p-2 justify-between mt-6">
              <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Gordita', fontWeight: '500', }} className={cx("pr-20")}>Total</p>
              <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Gordita', fontWeight: '500', }} >$10:00</p>
            </div>
          </div>

        </div>
      </div>

      <div className={cx("lg:col-span-4 py-4 flex flex-col  gap-y-5")}>
        <div className={cx("w-full flex justify-between")}>
          <div className={cx('flex items-center')}>
            <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Garamond, serif', fontWeight: '600' }} className={cx("text-lg font-medium")}>Subtotal</p>
            <p style={{ fontSize: 17, paddingLeft: '3px' }}>(items)</p>
          </div>
          {carts && carts.data && (
            <p style={{ fontFamily: 'Gordita, sans-serif' }} className={cx("text-2xl font-semibold")}>{carts.data.length}</p>
          )}
        </div>

        <div className={cx("w-full flex justify-between")}>
          <div className={cx('flex items-center')}>
            <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Garamond, serif', fontWeight: '600' }} className={cx("text-lg font-medium")}>Price</p>
            <p style={{ fontSize: 16, paddingLeft: '3px' }}>(Total)</p>
          </div>
          <p style={{ fontFamily: 'Gordita, sans-serif' }} className={cx("text-2xl font-semibold")}>
            {cartsCheck.length > 0 ? (
              `${cartsCheck.reduce((total, cart) => {
                return total + (cart.productAttributes.sellPrice || 0) * (cart.quantity || 0);
              }, 0).toLocaleString('vi-VN')} đ`
            ) : 0}
          </p>
        </div>

        <div className={cx("w-full flex justify-between")}>
          <div className={cx('flex items-center')}>
            <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Garamond, serif', fontWeight: '600' }} className={cx("text-lg font-medium")}>Shipping</p>
          </div>
          <p style={{ fontFamily: 'Gordita, sans-serif' }} className={cx("text-xl font-semibold")}>190000</p>
        </div>
        <div className={cx("border-t border-gray-300 pt-4")}>
          <div className={cx("w-full flex justify-between")}>
            <div className={cx('flex items-center')}>
              <p style={{ color: '#1A162E', fontSize: 18, fontFamily: 'Garamond, serif', fontWeight: '600' }} className={cx("text-lg font-medium")}>Estimated Total</p>
            </div>
            <p style={{ fontFamily: 'Gordita, sans-serif' }} className={cx("text-xl font-semibold")}>210000</p>
          </div>
        </div>
        <div className={cx("pt-4")}>
          <button className={cx("text-xl w-full h-[50px] bg-blue-500 text-white py-2 px-4 rounded-full")}>Continue to checkout</button>
        </div>
      </div>
    </div>
  );
};
