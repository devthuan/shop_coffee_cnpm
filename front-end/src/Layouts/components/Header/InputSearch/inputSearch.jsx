import classNames from "classnames/bind";
import styles from "./InputSearch.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Tippy from '@tippyjs/react/headless';
import item_cf from "src/assets/images/item_cf.png";
import { getALLProducts, getALLProductsForClientAPI } from "~/services/ProductService";
import { Navigate, useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function InputSearch({ handleCLickSearch }) {
    const [valueSearch, setValueSearch] = useState(""); 
    const [resultSearch, setResultSearch] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        if (!valueSearch) {
            setResultSearch([]); 
            return;
        }
        const fetchDataProduct = async () => {
            try {
                let queryParams = `search=${valueSearch}`;
                const response = await getALLProductsForClientAPI(queryParams);
                console.log(response.data.data)
                setResultSearch(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchDataProduct();
        }, 500); 

        return () => clearTimeout(timeoutId); 
    }, [valueSearch]);

    const handleChangInput = (e) => {
        setValueSearch(e.target.value.trim()); 
    };
    const handleCLickProduct = (id) => {
        navigate(`/product/${id}`)
    } 
    
    return (
        <div>
            <div className={cx("wrapper")} onClick={handleCLickSearch} />
            <div className={cx('toggle_search')}>
                <Tippy
                    visible={resultSearch.length > 0}
                    interactive
                    placement="bottom"
                    popperOptions={{
                        modifiers: [
                            {
                                name: 'preventOverflow',
                                options: {
                                    boundary: 'viewport',
                                },
                            },
                        ],
                    }}
                    render={attrs => (
                        <div className={cx("resultSearch")} tabIndex="-1" {...attrs}>
                            <ul className={cx("container")}>
                                {resultSearch.map((item, index) => (
                                    <li className={cx("item")} key={index} onClick={()=>handleCLickProduct(item.id)}>
                                        <img src={item.images[0]?.urlImage} className={cx("img_item")} alt="Item" />
                                        <div className={cx("name_item")}>{item.name}</div>
                                        <div className={cx("name_item")}>{item.productAttributes[0]?.sellPrice}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                >
                    <div className={cx('search')}>
                        <input
                            type="text"
                            id="input_search"
                            name="input_search"
                            className={cx('input_search')}
                            onChange={handleChangInput}
                            value={valueSearch}
                            autoComplete="off"
                        />
                        <FontAwesomeIcon icon={faMagnifyingGlass} className={cx("icon_search")} />
                    </div>
                </Tippy>
            </div>
        </div>
    );
}

export default InputSearch;
