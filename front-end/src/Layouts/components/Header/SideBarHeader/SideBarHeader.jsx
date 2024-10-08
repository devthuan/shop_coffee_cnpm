import classNames from "classnames/bind";
import styles from "./SideBarHeader.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ThemeToggle from "~/Layouts/components/ThemeToggle";
const cx = classNames.bind(styles)

function SideBarHeader({handleClickToggle}) {
    return (<div>
        <div  className={cx("wrapper")} onClick={handleClickToggle}/>
        <div className={cx("container")}>
            <FontAwesomeIcon icon={faArrowLeft} onClick={handleClickToggle} className={cx("color_icon")}/>
            <input type="text" className={cx("search")} placeholder="search"/>
            <Link to={'/cart'} className={cx("btn_cart")}>
              <FontAwesomeIcon icon={faCartShopping} className={cx("color_icon")}/>
              <div className={cx("text_card")}>Card</div>
            </Link>

            <div className={cx("btn_cart")}>
                <ThemeToggle />
                <div className={cx("text_card")}>mode dark/light</div>
            </div>
        </div>

    </div> );
}

export default SideBarHeader;