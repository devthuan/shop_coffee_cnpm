import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { EvaluateProduct } from "~/services/ReviewService";
import { useSelector, useDispatch } from "react-redux";
import { initDataReview } from "~/redux/features/Reviews/reviewsSlice";

const cx = classNames.bind(styles);
export default function FeedBackProduc({ idProduct, show }) {
    const dispatch = useDispatch();
    const reviews = useSelector((state) => state.reviews.data);
    console.log(reviews)
    const total = useSelector((state) => state.reviews.total);
    const totalPage = useSelector((state) => state.reviews.totalPage);
    const currentPage = useSelector((state) => state.reviews.currentPage);
    const limit = useSelector((state) => state.reviews.limit);
    const isLoading = useSelector((state) => state.reviews.isLoading);
    const [optionLimit, setOptionLimit] = useState({
        currentPage: 1,
        limit: 10,
    });
    useEffect(() => {
        const fetchEvaluateProduct = async () => {
            try {
                // let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
                const response = await EvaluateProduct(idProduct);
                if (response && response.status === 200) {
                    dispatch(initDataReview(response.data));
                }

            }
            catch (error) {
                console.log("Error when get evaluate product : ", error);
            }
        }
        fetchEvaluateProduct()
    }, [])

    return (
        <div className={cx(`d-none ${show ? 'block' : 'hidden'}`)}>
            <p className={cx("text-start mt-7 mb-7 text-[20px] text-[#1a162e] font-bold hover:text-blue-700")}>
                What our customers are saying
            </p>
            {reviews && reviews.length > 0 ? (
                <div className={cx("flex flex-col gap-7")}>
                    {reviews.map((review, index) => (
                        review.reviews.map((item, index) => (
                            <div
                                key={index}
                                className="w-full p-[30px] bg-[#fafafd] rounded-2xl flex flex-col"
                            >
                                <div className="flex items-start gap-5">
                                    <img
                                        width="45px"
                                        className="rounded-full"
                                        src="https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
                                        alt="Avatar"
                                        style = {{ marginTop : '6px' }}
                                    />
                                    <div className="flex items-center flex-col relative">
                                        <div className="flex items-center gap-2 ">
                                            <span className="text-[#1a162e] text-[18px] font-medium font-['Gordita']">
                                                {item.accounts.userName}
                                            </span>
                                            <div className="flex items-center">
                                                {Array.from({ length: 5 }, (_, starIndex) => (
                                                    <FontAwesomeIcon
                                                        key={starIndex}
                                                        className={cx("text-yellow-400")}
                                                        icon={faStar}
                                                        style={{ fontSize: '14px', opacity: starIndex < item.rating ? 1 : 0.3 }}
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-[#1a162e] flex justify-start ">
                                                ({item.rating} star) 
                                            </div>
                                        </div>
                                        <div className="absolute left-0 top-full">
                                            {item.comment}
                                        </div>
                                    </div>

                                </div>

                            </div>
                        ))
                    ))}
                </div>
            ) : (
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            )}
        </div>

    )
}