import React, { useState } from 'react';

import group92Image from '~/assets/images/imagemainregis.png';
import '~/page/Cart';
import classNames from "classnames/bind";
import styles from "./register.module.scss";
import Sign from '../SignLayout';

import {
    BrowserRouter,

    Route,

    Routes,
    Link

} from 'react-router-dom';


const cx = classNames.bind(styles);


const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termAccept, setConfirmtTermAccept] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }

        console.log({ email, password });
        setPassword('');
        setConfirmPassword('');
        setError('');
        setConfirmtTermAccept('')
    };

    return (
        

           
            <div className={cx('container')}>
                <div className={cx('show-logo')}> <img src={group92Image} alt="A beautiful sunset" />
                    <p> The best of luxury brand values, high quality products, and innovative services </p>
                </div>

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
                        <div className={cx('input-confirmPassword')}>
                            <label htmlFor="confirmPassword" ></label>
                            <i className={cx('icon-pws2')}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
                                <path d="M13.4228 7.44804V5.30104C13.4228 2.78804 11.3848 0.750045 8.87176 0.750045C6.35876 0.739045 4.31276 2.76704 4.30176 5.28104V5.30104V7.44804" stroke="#9E9DA8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M12.683 19.2498H5.042C2.948 19.2498 1.25 17.5528 1.25 15.4578V11.1688C1.25 9.07383 2.948 7.37683 5.042 7.37683H12.683C14.777 7.37683 16.475 9.07383 16.475 11.1688V15.4578C16.475 17.5528 14.777 19.2498 12.683 19.2498Z" stroke="#9E9DA8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.8623 12.2031V14.4241" stroke="#9E9DA8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg></i>
                            <input
                                type="password"
                                placeholder='confirmPassword'
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                            <button className={cx("but-sign")} type='submit'>Sign in with <></> Gmail
                                
                            </button>
                        </div>
                        <div className={cx("bot-content")}>Do you have an account? <Link to="/sign">Sign in</Link>
                        <Routes>
                <Route path='/sign' element={<Sign />} />  {/* Đường dẫn đến trang Sign */}
            </Routes>

                        </div>
                    </form>
                </div>

            </div >
       
    );
};

export default Register;


