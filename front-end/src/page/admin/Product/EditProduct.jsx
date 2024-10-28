import React from 'react'

export default function EditProduct({ show, close }) {
    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${show ? 'block' : 'hidden'}  `}>
            <div className="w-[700px] bg-white p-10 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-center">Chỉnh sửa sản phẩm</h2>
                <form>
                    <div className="mb-4 flex items-center">
                        <label className="block text-nowrap text-sm font-medium text-gray-700 pr-4">Tên sản phẩm</label>
                        <input
                            type="text"
                            className="mt-1 block text-[17px] w-full border border-gray-300 rounded-md p-2 "
                            required
                        />
                    </div>

                    <div className="mb-4 flex items-center text-[16px]">
                        <label className="block text-nowrap text-sm font-medium text-gray-700 pr-4">Ảnh sản phẩm</label>
                        <input
                            type="file"
                            className="mt-1  block w-full border border-gray-300 rounded-md "
                            required
                            multiple
                        />
                    </div>

                    <div className="mb-4 flex items-center text-[16px]">
                        <label className="block text-nowrap text-sm font-medium text-gray-700 pr-4">Ảnh sản phẩm</label>
                        <select className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="" disabled selected>Chọn một thể loại</option>
                            <option value="espresso">Espresso</option>
                            <option value="cappuccino">Cappuccino</option>
                            <option value="latte">Latte</option>
                            <option value="mocha">Mocha</option>
                        </select>
                    </div>

                    <div className="mb-4 flex items-center">
                        <label className="block text-sm text-nowrap pr-2 font-medium text-gray-700">Mô tả sản phẩm</label>
                        <textarea
                            className="mt-1 text-[17px] block w-full border border-gray-300 rounded-md p-2"
                            required
                        ></textarea>
                    </div>
                    
                    <div className="flex justify-between">
                        <button
                            onClick={() => close()}
                            type="button"
                            className="bg-gray-300 text-[17px] text-black px-5 py-3 rounded-md mr-2"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-[17px] text-white px-5 py-3 rounded-md hover:bg-blue-600"
                        >
                            Chỉnh sửa
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
