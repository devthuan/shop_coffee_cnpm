import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useState } from "react";
import { AddReview } from "~/services/ReviewService";
import { toast, ToastContainer } from "react-toastify";
import { HandleApiError } from "~/Utils/HandleApiError";
const cx = classNames.bind(styles);
export default function CommentProduct({ idProduct, show }) {
    const [content, setCotent] = useState("")
    const [comment, setComment] = useState("")
    const [rating, setRating] = useState(0);
    console.log(rating)
    const handleClick = (index) => {
        setRating(rating === index ? 0 : index);
    };

    const handleAddComment = async () => {
        const plainTextComment = comment.replace(/<[^>]*>/g, '').trim();
        try {
            const data = {
                productsId: idProduct,
                rating: rating,
                comment: plainTextComment
            }
            const response = await AddReview(data)
            if (response && response.status === 201) {
                toast.success("Thêm bình luận thành công")
            }
        }
        catch (error) {
            const result = HandleApiError(error);
            console.log(result);
            if (result) {
                toast.error(result.message);
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại");
            }
        }
    }
    return (
        <div className={cx(
            `grid lg:grid-cols-1 gap-7 max-sm:grid-cols-1 ${show ? "block" : "hidden"
            }`
        )}>
            <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setComment(data);
                }}
            />
            <div className="flex">
                {Array.from({ length: 5 }, (_, index) => (
                    <svg
                        key={index}
                        onClick={() => handleClick(index + 1)}
                        className={`w-8 h-8 cursor-pointer ${rating >= index + 1 ? "text-yellow-500" : "text-gray-300"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12 17.75l5.14 3.03-1.37-5.92 4.55-3.85-5.93-.48L12 2.75 9.11 11.53l-5.93.48 4.55 3.85-1.37 5.92L12 17.75z"
                            clipRule="evenodd"
                        />
                    </svg>
                ))}
            </div>
            <button
                onClick={() => handleAddComment()}
                class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                Gửi
            </button>
        </div>
    )
}