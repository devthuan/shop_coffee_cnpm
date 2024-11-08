import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { GetAllCategory } from "~/services/CategoryService";
import { GetAllAttribute } from "~/services/AttributeService";
import { AddProduct, UploadFileAPI } from "~/services/ProductService";
import { toast, ToastContainer } from "react-toastify";
import { HandleApiError } from "~/Utils/HandleApiError";
import { useDispatch, useSelector } from "react-redux";
import { initDataAttribute } from "~/redux/features/Attributes/attributesSlice";
import { addProduct } from "~/redux/features/Products/productsSlice";
import Select from "react-select";
import { initDataCatagories } from "~/redux/features/Categories/categoriesSlice";

export const ModalAddProduct = () => {
  const dispatch = useDispatch();
  // const attributes = useSelector((state) =>
  //   state.attributes.data.map((attributes) => ({
  //     value: attributes.id,
  //     label: attributes.name,
  //   }))
  // );

  const attributesOriginal = useSelector((state) => state.attributes.data);
  const attributes = attributesOriginal.map((attributes) => ({
    value: attributes.id,
    label: attributes.name,
  }));

  const categories = useSelector((state) => state.catagories.data);

  const [productName, setProductName] = useState();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [productDescription, setProductDescription] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const responseCategory = await GetAllCategory("limit=100");
      const responseAttribute = await GetAllAttribute("limit=100");
      dispatch(initDataCatagories(responseCategory.data));
      dispatch(initDataAttribute(responseAttribute.data));
    };

    if (
      !categories ||
      categories.length === 0 ||
      !attributes ||
      attributes.length === 0
    ) {
      fetchData();
    }
  }, []);

  const handleChange = (selected) => {
    setSelectedOptions(selected);
  };
  const handleImageChange = async (e) => {
    if (!e.target.files[0]) {
      return;
    }

    let formImage = new FormData();
    formImage.append("files", e.target.files[0]);

    try {
      const response = await UploadFileAPI(formImage);
      if (response && response.status === 201) {
        toast.success("Tải ảnh thành công");
        setProductImages([...productImages, response.data.url]);
      }
    } catch (error) {
      const { message, status } = HandleApiError(error);
      if (status === "error") {
        //  dispatch(initDataNotification({ error: message }));
      }
    }
  };

  const handleSubmit = async () => {
    const productData = {
      name: productName,
      categoryId: selectedCategory,
      description: productDescription,
      attributes: selectedOptions?.map((attributeId) => ({
        attributeId: attributeId.value,
      })),
      images: productImages,
    };

    try {
      const response = await AddProduct(productData);
      if (response && response.status === 201) {
        dispatch(addProduct(response.data.data));
        toast.success("Thêm sản phẩm thành công");

        setProductName("");
        setSelectedCategory("");
        setSelectedAttributes([]);
        setProductDescription("");
        setProductImages([]);
        setSelectedOptions([]);
      }
    } catch (error) {
      const result = HandleApiError(error);
      console.log(result);
      if (result) {
        toast.error(result.message);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm">
        Tạo mới sản phẩm
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <Dialog.Title className="text-lg font-medium text-gray-800 ">
                Tạo mới sản phẩm
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
              <div className="grid grid-cols-2 gap-x-7">
                <div className="mb-4 ">
                  <label className="block text-nowrap text-sm font-medium text-gray-700 pr-4">
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    className="mt-1 block text-[17px] w-full border border-gray-300 rounded-md p-2"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>

                <div className="mb-4 ">
                  <label className="block w-[130px] text-wrap text-center text-sm font-medium text-gray-700 pr-4">
                    Thể loại sản phẩm
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="" disabled>
                      Chọn một thể loại
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4 ">
                <label className="block text-nowrap text-sm font-medium text-gray-700 pr-4">
                  Thuộc tính sản phẩm
                </label>
                <Select
                  isMulti
                  value={selectedOptions}
                  onChange={handleChange}
                  options={attributes}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

              <div className="mb-4 ">
                <label className="block text-nowrap text-sm font-medium text-gray-700 pr-4">
                  Ảnh sản phẩm
                </label>
                <input
                  type="file"
                  className="mt-1 block w-full border border-gray-300 rounded-md"
                  required
                  multiple
                  onChange={(e) => handleImageChange(e)}
                />
              </div>

              <div className="mb-4 ">
                <label className="block text-sm text-nowrap pr-2 font-medium text-gray-700">
                  Mô tả sản phẩm
                </label>
                <textarea
                  className="mt-1 text-[17px] block w-full border border-gray-300 rounded-md p-2"
                  required
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="flex justify-end items-center gap-3 p-4 border-t">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 text-base text-white bg-indigo-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
                >
                  Tạo
                </button>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="px-6 py-2 text-base text-gray-800 border rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
                    aria-label="Close"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Description>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
