import classNames from "classnames/bind";
import styles from "./ContentHome.module.scss"
import icon_under from '~/assets/images/icon_img_main.svg'
import icon_2 from '~/assets/images/icon_2.png'
import icon_3 from '~/assets/images/icon_3.png'
import img_product from '~/assets/images/img_product.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

const cx = classNames.bind(styles)
function ContentHome() {
    const [listProducts, setListProducts] = useState([])

    return (<div className={cx('wrapper')}>
        <div className={cx('background')}>
            <div className={cx('title')}>
                ORDER YOUR
                FAVORITE COFFEE
            </div>
            <div className={cx('photo')}>
                <div className={cx('photo_1')}> <img src={icon_under} /></div>
                <div className={cx('photo_2')}> <img src={icon_2} /></div>
                <div className={cx('photo_3')}> <img src={icon_3} /></div>
            </div>
        </div>
        <div className={cx('info_product')}>
            <div className={cx('info_product_title')}>Total LavAzza 1320</div>
            <div className={cx('info_product_filter')}>
                <p className={cx('info_product_filter_title')}>filter</p>
                <FontAwesomeIcon icon={faFilter} className={cx('filter')} />
            </div>
        </div>

        <ul className={cx('list_product')}>


            {listProducts.map(((item, i) => {
                return (
                    <li className={cx('item_product')}>
                        <div className={cx('img_product')}>
                            <img src={img_product} />
                        </div>
                        <div className={cx('name_product')}>
                            Coffee Beans - Espresso Arabica and Robusta Beans
                        </div>
                        <div className={cx('lazada')}>Lavazza</div>
                        <div className={cx('img_price')}>
                            $47.00
                        </div>
                    </li>)
            }))}
        </ul>
        <div className={cx('footer')}>
            <ul className={cx('list_pages')}>
                <li className={cx('number_page')}>
                    <button className={cx('btn_pages')}>1</button>
                </li>
                <li className={cx('number_page')}>
                    <button className={cx('btn_pages')}>2</button>
                </li>
            </ul>
        </div>
    </div>);
}

export default ContentHome;