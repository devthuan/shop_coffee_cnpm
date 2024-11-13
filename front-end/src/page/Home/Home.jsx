import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import ContentHome from "~/Layouts/DefaultLayout/ContentHome/contentHome";
import Loading from "~/components/Loading/Loading";
import { useSelector } from "react-redux";


const cx = classNames.bind(styles);
export const Home = () => {
  const loadingSideBar = useSelector((state) => state.catagories.loading);
  const loaddingProduct = useSelector((state) => state.products.loading);

  return <div className={cx("wrapper")}>
    {(loadingSideBar && loaddingProduct) ? (<div className="h-full w-full flex justify-center items-center">
      <Loading />
    </div>) : (
      <ContentHome />
    )}
  </div>;
};
