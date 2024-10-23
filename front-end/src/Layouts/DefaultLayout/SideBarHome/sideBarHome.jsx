import classNames from "classnames/bind";
import style from "./SidebarHome.module.scss";
import item_cf from "src/assets/images/item_sp.svg"
import { useEffect, useState } from "react";
import { DetailProduct, ProductID } from "~/services/ProductService";
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, setLoading, setError } from 'src/redux/features/PoductSlice'; 
const cx = classNames.bind(style);

function SidebarHome() {
    const { data, loading, error } = useSelector((state) => state.products);
    
    // const [listProducts, setListProducts] = useState([]);

    const dispatch = useDispatch();
    useEffect(() => {
        const fetchProductId = async () => {
            dispatch(setLoading(true)); // Bật trạng thái loading
            try {
                // Lấy danh sách ID sản phẩm
                const response = await ProductID(); 
                const listProductID = response.data.map(item => item.id);  
                // Kiểm tra nếu danh sách ID không rỗng
                if (listProductID.length > 0) {
                    // Gọi API để lấy chi tiết sản phẩm
                    const detailsPromises = listProductID.map(id => DetailProduct(id)); 
                    const productsDetails = await Promise.all(detailsPromises);
                    // Kiểm tra nếu có chi tiết sản phẩm
                    if (productsDetails.length > 0) {
                        // Trích xuất dữ liệu sản phẩm (name, price, image, ...)
                        // console.log(productData)
                        const productData = productsDetails.map(item => {
                            const product = item.product;
                            return {
                                name: product?.name || 'N/A',
                                price: product?.productAttributes?.[0]?.buyPrice || 1,
                                imageUrl: product?.images?.[0]?.urlImage || 'No image',
                                description: product?.description || 'No description',
                                category: product?.category || 'No category'
                            };
                        });
                        // Lưu dữ liệu sản phẩm vào Redux
                        dispatch(setProducts(productData)); 
                    }
                } else {
                    dispatch(setError('Không tìm thấy sản phẩm nào.'));
                }
            } catch (error) {
                // Chi tiết hóa lỗi (có thể là lỗi API hoặc lỗi trong quá trình xử lý)
                dispatch(setError(error.response?.data?.message || 'Lỗi khi lấy danh sách và chi tiết sản phẩm.'));
            } finally {
                dispatch(setLoading(false)); // Tắt loading sau khi hoàn thành
            }
        };
    
        fetchProductId();
    }, [dispatch]);
    return (
        <div className={cx("wrapper")}>
            <div className={cx("title")}>Categories</div>
            <ul className={cx("list_product")}>
                {data && data.length > 0 && data.map((item, i) => (
                    <li key={i} className={cx("item")}>
                        <p className={cx("item_name")}>{item.name}</p>
                        <img src={item.imageUrl} className={cx("item_img")} alt={item.name} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default SidebarHome;
