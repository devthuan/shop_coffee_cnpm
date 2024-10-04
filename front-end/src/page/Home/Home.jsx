import classNames from "classnames";
import styles from "./Home.module.scss";
import ContentHome from "~/Layouts/DefaultLayout/ContentHome/contentHome";

const cx = classNames.bind(styles);
export const Home = () => {
  return <div className={cx("wrapper")}>
    <ContentHome/>
  </div>;
};
