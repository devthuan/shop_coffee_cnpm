
import * as Dialog from "@radix-ui/react-dialog";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Review.module.scss";
import classNames from "classnames/bind";
import { useState, useEffect } from "react";
import { ReplyReview } from "~/services/ReviewService";
import { toast, ToastContainer } from "react-toastify";
const cx = classNames.bind(styles);

export const DetailReview = ({ data }) => {
    const [comment, setComment] = useState("");
    const handleReplyReview = async() => {
        const response = await ReplyReview(
            {
                comment : comment,
                parentId : data.id
            }
        )
        console.log(response)
        if(response)
        {
            toast.success("Phản hồi khách hàng thành công")
        }
    }
    return (
        <Dialog.Root>
            <Dialog.Trigger className="inline-block px-4 py-2 text-white duration-150 font-medium bg-yellow-500 rounded-lg hover:bg-yellow-500 active:bg-yellow-700 md:text-sm">
                Chưa phản hồi
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />

                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-md shadow-lg">
                        <div className="flex items-center justify-between p-1 pl-4 border-b">
                            <Dialog.Title className="text-lg font-medium text-gray-800">
                                Detail Review
                            </Dialog.Title>
                            <Dialog.Close className="p-2 text-gray-400 rounded-md hover:bg-gray-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 mx-auto"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Dialog.Close>
                        </div>

                        <Dialog.Description className="space-y-2 p-4 mt-3 text-[15.5px] leading-relaxed text-gray-500">
                            <div
                                className="w-full p-[30px] bg-[#fafafd] rounded-2xl flex flex-col"
                            >
                                <div className="flex items-start  gap-5 ">
                                    <img
                                        width="45px"
                                        className="rounded-full"
                                        src="https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
                                        alt="Avatar"
                                        style={{ marginTop: '6px' }}
                                    />
                                    <div className="flex items-center flex-col relative">
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center">
                                                {Array.from({ length: 5 }, (_, starIndex) => (
                                                    <FontAwesomeIcon
                                                        key={starIndex}
                                                        className={cx("text-yellow-400")}
                                                        icon={faStar}
                                                        style={{ fontSize: '14px', opacity: starIndex < data.rating ? 1 : 0.3 }}
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-[#1a162e] flex justify-start ">
                                                ({data.rating} star)
                                            </div>
                                            <div className="text-[#1a162e] flex justify-start ">
                                                {data.createdAt}
                                            </div>
                                        </div>
                                        <div className="absolute left-0 top-full">
                                            {data.comment}
                                        </div>
                                    </div>

                                </div>
                            </div>


                            <div
                                className="w-full p-[30px] bg-[#fafafd] rounded-2xl flex flex-col px-20"
                            >
                                <div className="flex items-start  gap-5 ">
                                    <img
                                        width="45px"
                                        className="rounded-full"
                                        src="https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
                                        alt="Avatar"
                                        style={{ marginTop: '6px' }}
                                    />
                                    <div className="flex items-center flex-col relative">
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center">
                                                {Array.from({ length: 5 }, (_, starIndex) => (
                                                    <FontAwesomeIcon
                                                        key={starIndex}
                                                        className={cx("text-yellow-400")}
                                                        icon={faStar}
                                                        style={{ fontSize: '14px', opacity: starIndex < data.rating ? 1 : 0.3 }}
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-[#1a162e] flex justify-start ">
                                                ({data.rating} star)
                                            </div>
                                            <div className="text-[#1a162e] flex justify-start ">
                                                {data.createdAt}
                                            </div>
                                        </div>
                                        <div className="absolute left-0 top-full">
                                            {data.comment}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <textarea onChange={(e) => setComment(e.target.value)} name="" id="" className="mt-1 block text-[17px] w-full border border-gray-300 rounded-md p-2"
                            ></textarea>
                        </Dialog.Description>
                        <div className="flex justify-end items-center gap-3 p-4 border-t">
                            <button onClick={() => handleReplyReview()} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mx-5">Phản hồi</button>

                            <Dialog.Close asChild>
                                <button
                                    className="px-3 py-1 text-xl text-gray-800 border rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
                                    aria-label="Close"
                                >
                                    Cancel
                                </button>
                            </Dialog.Close>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
