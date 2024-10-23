import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import ContentHome from "~/Layouts/DefaultLayout/ContentHome/contentHome";

const cx = classNames.bind(styles);
export const Home = () => {
  return <div className={cx("wrapper")}>
    <ContentHome/>
  </div>;
};
