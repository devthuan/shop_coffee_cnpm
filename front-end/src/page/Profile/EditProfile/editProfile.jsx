import classNames from "classnames/bind";
import styles from "./EditProfile.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function EditProfile() {
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
                    <input type="text" className={cx("item_input")} name="item_name" />
                </li>
                <li className={cx("item")}>
                    <div className={cx("item_name")}>Email address</div>
                    <input type="email" className={cx("item_input")} name="item_name" />
                </li>
                <li className={cx("item")}>
                    <div className={cx("item_name")}>Phone number</div>
                    <input type="phone" className={cx("item_input")} name="item_name" />
                </li>
                <li className={cx("item")}>
                    <div className={cx("item_name")}>Password</div>
                    <input type="password" className={cx("item_input")} name="item_name" />
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