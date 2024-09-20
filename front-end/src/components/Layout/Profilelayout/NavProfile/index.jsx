import classNames from "classnames/bind";
import styles from "./ContentNavProfile.module.scss";


const cx = classNames.bind(styles);
function NavProfile() {
  return (
    <div className={cx("Wrapper")}>
      <div className={cx("container")}>
        <div className="sidebar">
          <div className="profile">
            <div className="profile-header">
             
            </div>
            <div className="profile-info">
              <img src={"#"} alt="User Avatar" className="avatar" />
              <h3>Imran Khan</h3>
              <p>Registered: 17th May 2022</p>
            </div>
          </div>
          <div className="sidebar-items">
            <h4>Manage Account</h4>
            <ul>
              <li>Personal info</li>
              <li>Addresses</li>
              <li>Communications & privacy</li>
            </ul>

            <h4>My items</h4>
            <ul>
              <li>Reorder</li>
              <li>Lists</li>
              <li>Registries</li>
            </ul>

            <h4>Subscriptions & plans</h4>
            <ul>
              <li>Protection plans</li>
            </ul>
            <h4>Customer Service</h4>
            <ul>
              <li>Help</li>
              <li>Terms of Use</li>
            </ul>
          </div>
        </div>
      </div>  
    </div>
  );
}

export default NavProfile;
