import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import ContentProfile from "~/page/Profile/ContentProfile/contentProfile";


const cx = classNames.bind(styles);
export const Profile = () => {
  return <div className={cx("")}>
    <ContentProfile/>
  </div>;
};
