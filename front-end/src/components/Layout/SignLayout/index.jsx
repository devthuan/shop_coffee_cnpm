import React, { useState } from 'react';

import Image9 from '~/assets/images/imagemainregis.png';

import '~/page/Cart';
import classNames from "classnames/bind";
import styles from "./sign.module.scss";
const cx = classNames.bind(styles);


const Sign = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [termAccept, setConfirmtTermAccept] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log({ email, password });
        setPassword('');
        setError('');
        setConfirmtTermAccept('')
    };

    return (
        <div className={cx('container')}>
            <div className={cx('show-logo')}> <img src={Image9} alt="A beautiful sunset" />
                The best of luxury brand values, high quality products, and innovative services </div>
            <div className={cx('ar-register')}>
                <div className={cx("register")}>
                    <div className={cx('name-shop')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.79999 0H27.2L32 8V30.4C32 31.2837 31.2837 32 30.4 32H1.6C0.716344 32 0 31.2837 0 30.4V8L4.79999 0ZM2.79886 8H29.2011L25.8411 2.4H6.15888L2.79886 8ZM8 12.4C8.66272 12.4 9.2 12.9373 9.2 13.6C9.2 17.3555 12.2445 20.4 16 20.4C19.7555 20.4 22.8 17.3555 22.8 13.6C22.8 12.9373 23.3373 12.4 24 12.4C24.6627 12.4 25.2 12.9373 25.2 13.6C25.2 18.681 21.081 22.8 16 22.8C10.919 22.8 6.8 18.681 6.8 13.6C6.8 12.9373 7.33728 12.4 8 12.4Z" fill="#77DAE6" />
                        </svg>
                        <h3>grocerymart</h3>
                    </div>
                    <div className={cx('title')}>

                        <h2>Register</h2>
                        <p>Let’s create your account and  Shop like a pro and save money.</p>
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className={cx('input-email')}>
                            <label htmlFor='email'></label>
                            <i className={cx('icon-email')}><svg xmlns="http://www.w3.org/2000/svg" width="17" height="20" viewBox="0 0 22 20" fill="none">
                                <path d="M16.9024 6.85156L12.4591 10.4646C11.6196 11.1306 10.4384 11.1306 9.59895 10.4646L5.11816 6.85156" stroke="#9E9DA8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M15.9089 19C18.9502 19.0084 21 16.5095 21 13.4384V6.57001C21 3.49883 18.9502 1 15.9089 1H6.09114C3.04979 1 1 3.49883 1 6.57001V13.4384C1 16.5095 3.04979 19.0084 6.09114 19H15.9089Z" stroke="#9E9DA8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg></i>

                            <input
                                type="email"
                                placeholder='Email'
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={cx('input-pass')}>
                            <label htmlFor="password" ></label>
                            <i className={cx('icon-pws')}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
                                <path d="M13.4228 7.44804V5.30104C13.4228 2.78804 11.3848 0.750045 8.87176 0.750045C6.35876 0.739045 4.31276 2.76704 4.30176 5.28104V5.30104V7.44804" stroke="#9E9DA8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M12.683 19.2498H5.042C2.948 19.2498 1.25 17.5528 1.25 15.4578V11.1688C1.25 9.07383 2.948 7.37683 5.042 7.37683H12.683C14.777 7.37683 16.475 9.07383 16.475 11.1688V15.4578C16.475 17.5528 14.777 19.2498 12.683 19.2498Z" stroke="#9E9DA8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.8623 12.2031V14.4241" stroke="#9E9DA8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg></i>
                            <input

                                type="password"
                                placeholder='Password'
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                        </div>

                        <div className={cx('checkbox-container')}>

                            <input
                                type="checkbox"
                                id="term"
                                checked={termAccept}
                                onChange={(e) => setConfirmtTermAccept(e.target.checked)}
                                required
                            ></input>
                            <ul className={cx('title-bot')}>
                                <li><label htmlFor="checkbox" >Set as default card</label></li>
                                <li><a href='https://www.google.com/search?client=firefox-b-d&q=dich'>Recovery password</a></li>
                            </ul>
                        </div>



                        <div className={cx('but-bot')}>
                            <button className={cx("but-regis")} type="submit">Sig Up</button>
                            <button className={cx("but-sign")} type='submit'>Sign in with Gmail
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <g clipPath="url(#clip0_60_246)">
                                        <path d="M12.2045 11.0183H20.9315C20.9765 11.4041 21 11.8 21 12.205C21 14.9452 19.9977 17.2525 18.2611 18.82C16.7424 20.1942 14.6632 21 12.1841 21C10.978 21.0005 9.78353 20.7681 8.66909 20.316C7.55465 19.864 6.54204 19.2011 5.68912 18.3653C4.83621 17.5296 4.15971 16.5373 3.6983 15.4452C3.23688 14.353 2.9996 13.1825 3 12.0005C2.99946 10.8184 3.23665 9.64776 3.698 8.55554C4.15936 7.46331 4.83583 6.47089 5.68876 5.63501C6.54169 4.79913 7.55435 4.13618 8.66886 3.68405C9.78336 3.23192 10.9779 2.99947 12.1841 3C14.6591 3 16.7383 3.89203 18.3286 5.34434L16.8334 6.80868C15.6491 5.68712 14.0485 5.00457 12.2045 5.00457C11.2644 5.00457 10.3335 5.18604 9.46488 5.53863C8.5963 5.89121 7.80709 6.40801 7.1423 7.0595C6.47752 7.71099 5.95019 8.48443 5.59041 9.33565C5.23063 10.1869 5.04546 11.0992 5.04546 12.0205C5.04546 12.9419 5.23063 13.8542 5.59041 14.7054C5.95019 15.5567 6.47752 16.3301 7.1423 16.9816C7.80709 17.6331 8.5963 18.1499 9.46488 18.5025C10.3335 18.8551 11.2644 19.0365 12.2045 19.0365C15.8107 19.0365 18.4882 16.4226 18.931 13.0228H12.2045V11.0183Z" fill="#1A162E" />
                                    </g>

                                </svg>
                            </button>
                        </div>
                        <div className={cx("bot-content")}>Do you have an account? <a href="https://www.google.com/search?client=firefox-b-d&q=dich">Sign in</a>

                        </div>
                    </form>
                </div>
            </div>
        </div >
    );
};

export default Sign;


