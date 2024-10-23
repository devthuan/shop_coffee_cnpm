import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import quangcao from "~/assets/images/quangcao.png"
import grocery from "~/assets/icon/grocerymart.svg"
import google from "~/assets/icon/google.svg"
import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {LoginAPI}  from "~/services/AuthService";
import { setItemWithExpiration } from "~/services/localStorage";

const cx = classNames.bind(styles);
export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setAsDefaultCard, setSetAsDefaultCard] = useState(false);
  // const navigate = useNavigate(); // Sử dụng hook để chuyển trang
  const [message,setMessage] = useState('');
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (setAsDefaultCard === false) {
      alert("please check")
    }
    try {
      // Gọi API đăng ký
      console.log(email, password)
      const response = await LoginAPI( email, password )
      setError(null)
      setMessage()
      if(response.data.statusCode === 401){
        setMessage(response.data.message)
      }
      if(response.status === 201 && response.data.data.accessToken)  {
        setItemWithExpiration('token', response.data.data.accessToken, 1);
      }
      // else {
      //   console.log(response.data.data)
      // // if(response.status === 201) {  
      // //   setError(response.data.data.message);
      // //   setMessage(null)
      // // }
      // }
      // if (response.data && response.data.token) {
      //   setItemWithExpiration('token', response.data.token, 1);
      // navigate('/');
      // }
      
      
    } catch (err) {
   
      if(err.status === 400){
      setError(err.response.data.message[0]);
      setMessage(null)
      }
      
    }
  };
  return (
    <div className={cx("grid lg:grid-cols-11 max-sm:grid-cols-1  min-h-screen ")}>
      
      <div className={cx("lg:col-span-5 flex items-center justify-center   ")}>
        <div className={cx("title-2")}>
        
          <img src={quangcao} alt="Illustration" className={cx("w-full max-w-[422px] max-h-[261]   ")} />
          <h2>The best of luxury brand values, high quality products, and innovative services</h2>
        </div>

      </div>
      <div className={cx("lg:col-span-6 flex flex-col items-center justify-center  ")}>
        <div className={cx("container justify-center")}>
          <div className={cx("max-w-[400px]  w-full mx-auto text-center left ")}>
            <div className={cx("top-name")}>
              <h1><img src={grocery} alt="Logo" className={cx("mb-6")} />grocerymart</h1>
            </div>
            <div className={cx("title-1")}>
              <h1 className={cx(" font-bold mb-6")}>Sign Up</h1>
              <h3>Let’s create your account and  Shop like a pro and save money.</h3>
            </div>
            <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{color:'red'}}>{message}</p>}
              <input type="email"
                placeholder="Email"
                className={cx("w-full mb-6 p-4 border rounded-md")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input type="password"
                placeholder="Password"
                className={cx("w-full mb-6 p-4 border rounded-md")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className={cx("flex justify-between items-center mb-6")}>
                <label className={cx("flex items-center")}>
                  <input
                    type="checkbox"
                    className={cx("mr-2 ")}

                    checked={setAsDefaultCard}
                    onChange={(e) => setSetAsDefaultCard(e.target.checked)}
                  />
                  Set as default card

                </label>
                <a href="https://chatgpt.com/c/66fdfaf9-cb74-8011-89ff-236369702781" className={cx("text-blue-500")}>Recovery Password</a>
              </div>
              <button className={cx("w-full bg-yellow-500 text-white py-4 rounded-md mb-6")}>Sign Up</button>
              <button className={cx("w-full border py-4 rounded-md mb-6 flex justify-center items-center")}>
                <img src={google} alt="Gmail" className={cx("mr-2")} />
                Sign in with Gmail
              </button>
            </form>
            <div className={cx("bot-title")}>
              <p className={cx("text-sm mt-6  ")}>
                <span>You have an account yet?</span>
                <Link to="/register" className={cx("text-blue-500")}>Sign In</Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div >


  );
};

