import classNames from "classnames";
import styles from "./Profile.module.scss";
import ContentProfile from "~/Layouts/ProfileLayout/ContentProfile/contentProfile";

const cx = classNames.bind(styles);
export const Profile = () => {
  return <div className={cx("")}><ContentProfile/></div>;
};
