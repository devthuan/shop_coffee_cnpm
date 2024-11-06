import classNames from "classnames/bind";
import styles from "./ProfileSidebar.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCircleExclamation, faCircleInfo, faDownload, faEnvelope, faGift, faHeart, faInfo, faLocation, faLocationDot, faSchoolCircleExclamation, faShield, faShieldHalved, faUser } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const cx = classNames.bind(styles)

function ProfileSidebar() {

    const [imgUser, setImgUser] = []
    const id = useSelector((state) => state.userInfo.id)
    const createdAt = useSelector((state) => state.userInfo.createdAt)
    const updatedAt = useSelector((state) => state.userInfo.updatedAt)
    const userName = useSelector((state) => state.userInfo.userName)
    const email = useSelector((state) => state.userInfo.email)
    const balance = useSelector((state) => state.userInfo.balance);
    const ip = useSelector((state) => state.userInfo.ip);
    const device = useSelector((state) => state.userInfo.device);
    const typeLogin = useSelector((state) => state.userInfo.typeLogin);
    const isActive = useSelector((state) => state.userInfo.isActive);
    const lastLogin = useSelector((state) => state.userInfo.lastLogin);
    const userInformation = useSelector((state) => state.userInfo.userInformation);
    const isError = useSelector((state) => state.userInfo.error);
    const isloading = useSelector((state) => state.userInfo.loading);

    return (<div className={cx("wrapper")}>
        <div className={cx("avatar")}>
            <div className={cx("avatar_content")}>
                {imgUser ? <img src={imgUser} className={cx("img_user")} /> : <FontAwesomeIcon icon={faUser} className={cx("img_user")} />}
                <div className={cx("name_user")}>{userName}</div>
                <div className={cx("register_login")}>
                    <div className={cx("register_login_text")}>Registered:</div>
                    <div className={cx("register_login_date")}>{createdAt}</div>
                </div>
            </div>
        </div>
        <div className={cx("list")}>
            <ul className={cx("list_container")}>
                <li className={cx("list_item")}>
                    <ul className={cx("list_item_container")}>
                        Manage Account
                        <li className={cx("list_item_item")}>
                            <FontAwesomeIcon icon={faUser} className={cx("item_icon")} />
                            <div className={cx("item_text")}>Personal info</div>
                        </li>
                        <li className={cx("list_item_item")}>
                            <FontAwesomeIcon icon={faLocationDot} className={cx("item_icon")} />
                            <div className={cx("item_text")}>Addresses</div>
                        </li>
                        <li className={cx("list_item_item")}>
                            <FontAwesomeIcon icon={faEnvelope} className={cx("item_icon")} />
                            <div className={cx("item_text")}>Communications & privacy</div>
                        </li>
                    </ul>
                </li>

                <li className={cx("list_item")}>
                    <ul className={cx("list_item_container")}>
                        My items
                        <li className={cx("list_item_item")}>
                            <FontAwesomeIcon icon={faDownload} className={cx("item_icon")} />
                            <div className={cx("item_text")}>Personal info</div>
                        </li>
                        <li className={cx("list_item_item")}>
                            <FontAwesomeIcon icon={faHeart} className={cx("item_icon")} />
                            <div className={cx("item_text")}> Lists</div>
                        </li>
                        <li className={cx("list_item_item")}>
                            <FontAwesomeIcon icon={faGift} className={cx("item_icon")} />
                            <div className={cx("item_text")}>Registries</div>
                        </li>
                    </ul>
                </li>

                <li className={cx("list_item")}>
                    <ul className={cx("list_item_container")}>
                        Subscriptions & plans
                        <li className={cx("list_item_item")}>
                            <FontAwesomeIcon icon={faShieldHalved} className={cx("item_icon")} />
                            <div className={cx("item_text")}>Protection plans</div>
                        </li>
                    </ul>
                </li>

                <li className={cx("list_item")}>
                    <ul className={cx("list_item_container")}>
                        Customer Service
                        <li className={cx("list_item_item")}>
                            <FontAwesomeIcon icon={faCircleInfo} className={cx("item_icon")} />
                            <div className={cx("item_text")}>Help</div>
                        </li>
                        <li className={cx("list_item_item")}>
                            <FontAwesomeIcon icon={faCircleExclamation} className={cx("item_icon")} />
                            <div className={cx("item_text")}>Terms of Use</div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>);
}

export default ProfileSidebar;