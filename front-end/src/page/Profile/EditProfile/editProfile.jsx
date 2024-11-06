import classNames from "classnames/bind";
import styles from "./EditProfile.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

const cx = classNames.bind(styles);

function EditProfile() {
    const userInformation = useSelector((state) => state.userInfo.userInformation);
    const [name, setName] = useState(userInformation?.fullName || "")
    const [address, setAddress] = useState(userInformation?.address1 || userInformation?.address2 || "")
    const [phone, setPhone] = useState(userInformation?.phoneNumber || "")
    const [email, setEmail] = useState(userInformation?.email || "")
    const [pass, setPass] = useState(userInformation?.passWord || "")

    return (<div className={cx("content")}>
        <div className={cx("container")}>
                <Link to="/profile">
            <div className={cx("title")}>
                    <FontAwesomeIcon icon={faArrowLeft} className={cx("btn_gear")} />
                    <div className={cx("header_name")}>Personal info</div>
            </div>
                </Link>
            <ul className={cx("list_profile")}>
                <li className={cx("item")}>
                    <div className={cx("item_name")}>Full name</div>
                    <input type="text" className={cx("item_input")} name="item_name" value={name} onChange={(e) => setName(e.target.value)}/>
                </li>
                <li className={cx("item")}>
                    <div className={cx("item_name")}>Email</div>
                    <input type="email" className={cx("item_input")} name="item_name" value={email} onChange={(e) => setEmail(e.target.value)} />
                </li>
                <li className={cx("item")}>
                    <div className={cx("item_name")}>Address</div>
                    <input type="email" className={cx("item_input")} name="item_name" value={address} onChange={(e) => setAddress(e.target.value)} />
                </li>
                <li className={cx("item")}>
                    <div className={cx("item_name")}>Phone number</div>
                    <input type="phone" className={cx("item_input")} name="item_name" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </li>
                <li className={cx("item")}>
                    <div className={cx("item_name")}>Password</div>
                    <input type="password" className={cx("item_input")} name="item_name" value={pass} onChange={(e) => setPass(e.target.value)} />
                </li>
            </ul>
        </div>
        <div className={cx("save")}>
            <button className={cx("btn_cancel")}>Cancel</button>
            <button className={cx("btn_save")}>Save Edit</button>
        </div>
    </div>);
}

export default EditProfile;




