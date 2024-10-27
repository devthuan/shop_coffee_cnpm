import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { EvaluateProduct } from "~/services/ProductService";
const cx = classNames.bind(styles);
export default function FeedBackProduc({ show }) {
    const [evaluates, setEvaluates] = useState({})

    useEffect(() => {
        const fetchEvaluateProduct = async () => {
            try {
                const response = await EvaluateProduct();
                console.log(response)
                setEvaluates(response.data)
                
            }
            catch (error) {
                console.log("Error when get evaluate product : ", error);
            }
        }
        fetchEvaluateProduct()
    }, [])

    return (
        <div className={cx(`d-none ${show ? 'block' : 'hidden'}`)} >
            <p className={cx("text-start mt-7 mb-7 text-[20px] text-[#1a162e] font-bold hover:text-blue-700")}>What our customers are saying</p>
            {evaluates && evaluates.data ? (
                <div className={cx("grid lg:grid-cols-3 gap-7 max-sm:grid-cols-1 ")}>
                    {evaluates.data.map((evalute, index) => (
                        evalute.reviews.map((item, index) => (
                            <div key = {index} class="h-[196px] p-[30px] bg-[#fafafd] rounded-2xl flex-col justify-start items-start gap-2.5 inline-flex">
                                <div class="flex-col justify-start items-start gap-5 flex">
                                    <div class="justify-start items-start gap-5 inline-flex">
                                        <img width="60px" class="rounded-full" src="https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg" />
                                        <div class="flex-col justify-start items-start gap-2.5 inline-flex">
                                            <div class="text-[#1a162e] text-[22px] font-medium font-['Gordita'] leading-loose">{item.accounts.userName}</div>
                                            <div class="w-[267px] text-start text-[#1a162e] text-xl font-normal font-['Gordita'] leading-normal">{item.comment}</div>
                                        </div>
                                    </div>
                                    <div class="justify-start items-center gap-5 inline-flex">
                                        <div class="justify-start items-start gap-2 flex">
                                            {Array.from({ length: 5 }, (_, index) => (
                                                <FontAwesomeIcon
                                                    key={index}
                                                    className={cx("text-yellow-400 pr-2")}
                                                    icon={faStar}
                                                    style={{fontSize : '16px', opacity: index < item.rating ? 1 : 0.3 }} // Tô sáng sao dựa trên rating
                                                />
                                            ))}

                                        </div>
                                        <div class="text-[#1a162e] font-bold text-xl font-['Gordita'] leading-relaxed">({item.rating}) Star</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ))}
                </div>
            ) :
                <div className="loading">
                    <div className="spinner"></div>
                </div>}
        </div  >
    )
}