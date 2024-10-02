import classNames from "classnames/bind";
import styles from "./ContentNavProfile.module.scss";



const cx = classNames.bind(styles);
function NavProfile() {


  return (
    <div className={cx("Wrapper")}>
      <div className={cx("container")}>
        <div className={cx("sidebar-1")}>
          <div className={cx("profile")}>
            <div className={cx("profile-info")}>
              <img className={cx("avatar")} src={"#"} alt="User Avatar" />
              <h3>Imran Khan</h3>
              <p>Registered: 17th May 2022</p>
            </div>
          </div>
          <div className={cx("sidebar-items")}>
            <h4>Manage Account</h4>
            <ul>
              <li ><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 20" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M7.98468 13.3457C4.11707 13.3457 0.814209 13.9305 0.814209 16.2724C0.814209 18.6143 4.09611 19.22 7.98468 19.22C11.8523 19.22 15.1542 18.6343 15.1542 16.2933C15.1542 13.9524 11.8733 13.3457 7.98468 13.3457Z" stroke="#1A162E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path fillRule="evenodd" clipRule="evenodd" d="M7.98464 10.0059C10.5227 10.0059 12.5799 7.94779 12.5799 5.40969C12.5799 2.8716 10.5227 0.814453 7.98464 0.814453C5.44655 0.814453 3.38845 2.8716 3.38845 5.40969C3.37988 7.93922 5.42369 9.99731 7.95226 10.0059H7.98464Z" stroke="#1A162E" strokeWidth="1.42857" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

                Personal info</li>
              <li><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 20" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M11.5 8.50051C11.5 7.11924 10.3808 6 9.00051 6C7.61924 6 6.5 7.11924 6.5 8.50051C6.5 9.88076 7.61924 11 9.00051 11C10.3808 11 11.5 9.88076 11.5 8.50051Z" stroke="#1A162E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path fillRule="evenodd" clipRule="evenodd" d="M8.99951 19C7.80104 19 1.5 13.8984 1.5 8.56329C1.5 4.38664 4.8571 1 8.99951 1C13.1419 1 16.5 4.38664 16.5 8.56329C16.5 13.8984 10.198 19 8.99951 19Z" stroke="#1A162E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
                Addresses</li>
              <li><svg className={cx("icon-comu")} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 22 20" fill="none">
                <path d="M16.9024 6.85156L12.4591 10.4646C11.6196 11.1306 10.4384 11.1306 9.59895 10.4646L5.11816 6.85156" stroke="#1A162E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path fillRule="evenodd" clipRule="evenodd" d="M15.9089 19C18.9502 19.0084 21 16.5095 21 13.4384V6.57001C21 3.49883 18.9502 1 15.9089 1H6.09114C3.04979 1 1 3.49883 1 6.57001V13.4384C1 16.5095 3.04979 19.0084 6.09114 19H15.9089Z" stroke="#1A162E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
                Communications & privacy</li>
            </ul>

            <h4>My items</h4>
            <ul>
              <li><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 21 20" fill="none">
                <path d="M10.1223 13.4365L10.1223 1.39551" stroke="#1A162E" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                <path d="M13.0383 10.5088L10.1223 13.4368L7.20633 10.5088" stroke="#1A162E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.7551 6.12793H15.6881C17.7231 6.12793 19.3721 7.77693 19.3721 9.81293V14.6969C19.3721 16.7269 17.7271 18.3719 15.6971 18.3719L4.55707 18.3719C2.52207 18.3719 0.87207 16.7219 0.87207 14.6869V9.80193C0.87207 7.77293 2.51807 6.12793 4.54707 6.12793H5.48907" stroke="#1A162E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
                Reorder</li>
              <li><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 22 20" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M1.87187 9.59832C0.798865 6.24832 2.05287 2.41932 5.56987 1.28632C7.41987 0.689322 9.46187 1.04132 10.9999 2.19832C12.4549 1.07332 14.5719 0.693322 16.4199 1.28632C19.9369 2.41932 21.1989 6.24832 20.1269 9.59832C18.4569 14.9083 10.9999 18.9983 10.9999 18.9983C10.9999 18.9983 3.59787 14.9703 1.87187 9.59832Z" stroke="#1A162E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 4.70001C16.07 5.04601 16.826 6.00101 16.917 7.12201" stroke="#1A162E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
                Lists</li>
              <li><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M19 12V21H5V12" stroke="#1A162E" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 8H3V12H21V8Z" stroke="#1A162E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 21V8" stroke="#1A162E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 8H8.14286C7.57454 8 7.02949 7.73661 6.62763 7.26777C6.22576 6.79893 6 6.16304 6 5.5C6 4.83696 6.22576 4.20107 6.62763 3.73223C7.02949 3.26339 7.57454 3 8.14286 3C11.1429 3 12 8 12 8Z" stroke="#1A162E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 8H15.8571C16.4255 8 16.9705 7.73661 17.3724 7.26777C17.7742 6.79893 18 6.16304 18 5.5C18 4.83696 17.7742 4.20107 17.3724 3.73223C16.9705 3.26339 16.4255 3 15.8571 3C12.8571 3 12 8 12 8Z" stroke="#1A162E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
                Registries</li>
            </ul>

            <h4>Subscriptions & plans</h4>
            <ul>
              <li><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 21" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.98457 19.606C8.98457 19.606 16.6566 17.283 16.6566 10.879C16.6566 4.474 16.9346 3.974 16.3196 3.358C15.7036 2.742 9.99057 0.75 8.98457 0.75C7.97857 0.75 2.26557 2.742 1.65057 3.358C1.03457 3.974 1.31257 4.474 1.31257 10.879C1.31257 17.283 8.98457 19.606 8.98457 19.606Z" stroke="#1A162E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6.38574 9.87414L8.27774 11.7691L12.1757 7.86914" stroke="#1A162E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
                Protection plans</li>
            </ul>
            <h4>Customer Service</h4>
            <ul>
              <li><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M14.334 0.750092H5.665C2.644 0.750092 0.75 2.88909 0.75 5.91609V14.0841C0.75 17.1111 2.635 19.2501 5.665 19.2501H14.333C17.364 19.2501 19.25 17.1111 19.25 14.0841V5.91609C19.25 2.88909 17.364 0.750092 14.334 0.750092Z" stroke="#1A162E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M9.99414 14.0001V10.0001" stroke="#1A162E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.99012 6.20419H10.0001" stroke="#1A162E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
                Help</li>
              <li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M10 0.750092C15.108 0.750092 19.25 4.89109 19.25 10.0001C19.25 15.1081 15.108 19.2501 10 19.2501C4.891 19.2501 0.75 15.1081 0.75 10.0001C0.75 4.89109 4.891 0.750092 10 0.750092Z" stroke="#1A162E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.99512 6.20419V10.6232" stroke="#1A162E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.995 13.7961H10.005" stroke="#1A162E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
                Terms of Use</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};






export default NavProfile;
