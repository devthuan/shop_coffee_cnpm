import Header from "../components/Header";
import NavProfile from "./NavProfile";
import classNames from "classnames/bind";
import styles from './Profilelayout.module.scss'



const cx = classNames.bind(styles)

function Profilelayout() {
  return <div className={cx("wrapper")}>
    <Header />
    <div className={cx("container")}>
      <div className={cx("sidebar")}><NavProfile /></div>
      <div className={cx("content")}></div>

    </div>
  </div>
}

export default Profilelayout;