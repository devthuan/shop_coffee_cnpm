import classNames from 'classnames/bind';
import styles from './Header.module.scss'

const cx = classNames.bind(styles)
function Header() {
    return ( <header className={cx('wrapper')}>

           
            <div className={cx('content')}>contentádasd</div>

     </header> );
}

export default Header;
