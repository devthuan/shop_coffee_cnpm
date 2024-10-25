import classNames from "classnames/bind";
import styles from "./InputSearch.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";


const cx = classNames.bind(styles)

function InputSearch({handleCLickSearch}) {
    return (<div>
       <div  className={cx("wrapper")} onClick={handleCLickSearch}/>
        <div className={cx('toggle_search')} >
            <div className={cx('search')}>
                <input type="text" id="input_search" name="input_search" className={cx('input_search')} />
                <FontAwesomeIcon icon={faMagnifyingGlass} className={cx("icon_search")} />
            </div>
        </div>
    </div>);
}

export default InputSearch;