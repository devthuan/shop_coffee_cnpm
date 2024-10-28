import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import AddProduct from "./AddProduct";
import { useState } from "react";
import EditProduct from "./EditProduct";
const cx = classNames.bind(styles);

export const Product = () => {
  const [modalAddProduct, setModalAddProduct] = useState(false)
  const [modalEditProduct, setModalEditProduct] = useState(false)
  return (
    <div class="overflow-x-auto">
      <div class="flex justify-between items-center mb-4 p-5">
        <div class="text-lg font-semibold flex items-center">
          <p className="pr-2">Tổng số sản phẩm:</p>
          <p>10</p>
        </div>
        <button onClick={() => setModalAddProduct(true)} class="bg-blue-500 text-[17px] p-2 text-white rounded hover:bg-blue-600">
          Thêm sản phẩm
        </button>
      </div>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-[15px] font-medium text-gray-500 uppercase tracking-wider">
              Id
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên sản phẩm
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mô tả sản phẩm
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thể loại
            </th>
            <th scope="col" colSpan="2" class=" text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>

          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8c7ae203-0970-4b2a-95b3-8f19b64e48b2</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
              <img className="rounded-2xl mr-2" width="45px" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
              <p>Cafe espresso</p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              description cafe espresso
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Thể loại Espresso</td>
            <td class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
              <button onClick={() => setModalEditProduct(true)} class="bg-blue-500 text-[17px] p-2 mr-3 text-white rounded hover:bg-blue-600">
                Edit
              </button>
              <button class="bg-blue-500 text-[17px] p-2 text-white rounded hover:bg-blue-600">
                Delete
              </button>
            </td>

          </tr>
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">d45da10e-1e3a-4a6c-8923-0840e1003774</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
              <img className="rounded-2xl mr-2" width="45px" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
              <p>Cappuccino</p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">description Cappuccino</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Thể loại Cappuccino</td>
            <td class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
              <button class="bg-blue-500 text-[17px] p-2 mr-3 text-white rounded hover:bg-blue-600">
                Edit
              </button>
              <button class="bg-blue-500 text-[17px] p-2 text-white rounded hover:bg-blue-600">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <AddProduct show={modalAddProduct} close={() => setModalAddProduct(false)} />
      <EditProduct show={modalEditProduct} close={() => setModalEditProduct(false)} />

    </div>

  );
};
