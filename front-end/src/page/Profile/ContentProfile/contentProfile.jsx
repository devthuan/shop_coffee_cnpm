import classNames from "classnames/bind";
import styles from "./ContentProfile.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faGear,
  faLocationDot,
  faPhoneVolume,
} from "@fortawesome/free-solid-svg-icons";
import item_cf from "src/assets/images/item_cf.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const cx = classNames.bind(styles);

function ContentProfile() {
  const id = useSelector((state) => state.userInfo.id);
  const createdAt = useSelector((state) => state.userInfo.createdAt);
  const updatedAt = useSelector((state) => state.userInfo.updatedAt);
  const userName = useSelector((state) => state.userInfo.userName);
  const email = useSelector((state) => state.userInfo.email);
  const balance = useSelector((state) => state.userInfo.balance);
  const ip = useSelector((state) => state.userInfo.ip);
  const device = useSelector((state) => state.userInfo.device);
  const typeLogin = useSelector((state) => state.userInfo.typeLogin);
  const isActive = useSelector((state) => state.userInfo.isActive);
  const lastLogin = useSelector((state) => state.userInfo.lastLogin);
  const userInformation = useSelector(
    (state) => state.userInfo.userInformation
  );
  const isError = useSelector((state) => state.userInfo.error);
  const isloading = useSelector((state) => state.userInfo.loading);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("content")}>
        <div className={cx("container")}>
          <div className={cx("header")}>
            <div className={cx("header_title")}>
              <div className={cx("header_name")}>Account info</div>
              <div className={cx("header_disc")}>
                Addresses, contact information and password
              </div>
            </div>
            <Link to="/profile/editProfile">
              <FontAwesomeIcon icon={faGear} className={cx("btn_gear")} />
            </Link>
          </div>
          <ul className={cx("list_profile")}>
            <li className={cx("item_profile")}>
              <div className={cx("item_profile_icon")}>
                {" "}
                <FontAwesomeIcon icon={faEnvelope} />{" "}
              </div>
              <div className={cx("item_profile_info")}>
                <div className={cx("info_name")}>Email Address</div>
                <div className={cx("info_disc")}>{email}</div>
              </div>
            </li>
            <li className={cx("item_profile")}>
              <div className={cx("item_profile_icon")}>
                {" "}
                <FontAwesomeIcon icon={faPhoneVolume} />{" "}
              </div>
              <div className={cx("item_profile_info")}>
                <div className={cx("info_name")}>Phone number</div>
                <div className={cx("info_disc")}>+000 11122 2345 657</div>
              </div>
            </li>
            <li className={cx("item_profile")}>
              <div className={cx("item_profile_icon")}>
                {" "}
                <FontAwesomeIcon icon={faLocationDot} />{" "}
              </div>
              <div className={cx("item_profile_info")}>
                <div className={cx("info_name")}>Add an address</div>
                <div className={cx("info_disc")}>
                  Bangladesh Embassy, Washington, DC 20008
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div className={cx("container")}>
          <div className={cx("header_title")}>
            <div className={cx("header_name")}>Lists</div>
            <div className={cx("header_disc")}>2 items - Primary</div>
          </div>
          <ul className={cx("list_product")}>
            <li className={cx("item_product")}>
              <img src={item_cf} className={cx("item_img")} />
              <div className={cx("item_info")}>
                <div className={cx("info_name")}>
                  Coffee Beans - Espresso Arabica and Robusta Beans
                </div>
                <div className={cx("info_under")}>
                  <div className={cx("info_price")}>$47.00</div>
                  <button className={cx("add_to_card")}>Add to cart</button>
                </div>
              </div>
            </li>
            <li className={cx("item_product")}>
              <img src={item_cf} className={cx("item_img")} />
              <div className={cx("item_info")}>
                <div className={cx("info_name")}>
                  Coffee Beans - Espresso Arabica and Robusta Beans
                </div>
                <div className={cx("info_under")}>
                  <div className={cx("info_price")}>$47.00</div>
                  <button className={cx("add_to_card")}>Add to cart</button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ContentProfile;
