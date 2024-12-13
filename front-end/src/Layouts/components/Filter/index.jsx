import classNames from "classnames/bind";
import styles from "./Filter.module.scss";

const cx = classNames.bind(styles);
function Filter() {

  var url = window.location.pathname;
  console.log(url); 

  return (
    <div className={cx("wrapper")}>
     
    </div>
  );
}

export default Filter;
