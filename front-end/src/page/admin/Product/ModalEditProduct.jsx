import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { GetAllCategory } from "~/services/CategoryService";
import { GetAllAttribute } from "~/services/AttributeService";
import { HandleApiError } from "~/Utils/HandleApiError";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { initDataCatagories } from "~/redux/features/Categories/categoriesSlice";
import { initDataAttribute } from "~/redux/features/Attributes/attributesSlice";
import { UpdateProduct, UploadFileAPI } from "~/services/ProductService";
import { updateProduct } from "~/redux/features/Products/productsSlice";
export const ModalEditProduct = ({ data }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.catagories.data);
  const attributesOriginal = useSelector((state) => state.attributes.data);
  const attributes = attributesOriginal.map((attributes) => ({
    value: attributes.id,
    label: attributes.name,
  }));
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [productImages, setProductImages] = useState([]);

  const [formData, setFromData] = useState({
    id: "",
    name: "",
    category: "",
    images: "",
    description: "",
    attributes: "",
  });
  useEffect(() => {
    if (data && data.productAttributes && data.productAttributes.length > 0) {
      setFromData({
        id: data.id,
        name: data.name,
        category: data.category.id,
        images: data.images,
        description: data.description,
        attributes: data.productAttributes,
      });
      setSelectedOptions(
        data.productAttributes.map((attr) => ({
          value: attr.attributes.id,
          label: attr.attributes.name,
        }))
      ); // Lưu id các thuộc tính đã chọn
    }
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCategory = await GetAllCategory("limit=100");
        if (responseCategory && responseCategory.status === 200) {
          dispatch(initDataCatagories(responseCategory.data));
        }

        const responseAttribute = await GetAllAttribute("limit=100");
        if (responseAttribute && responseAttribute.status === 200) {
          dispatch(initDataAttribute(responseAttribute.data));
        }
      } catch (error) {
        const result = HandleApiError(error);
        result
          ? toast.error(result)
          : toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    };
    if (!categories || !attributes) {
      fetchData();
    }
  }, []);

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

  const handleChangeAttribute = (selected) => {
    setSelectedOptions(selected);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    setFromData({
      ...formData,
      [name]: value,
    });
  };
  const handleAttributeChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedAttributes(selectedOptions);
  };

  const handleUpdateProduct = async (e) => {
    const attributesNew = attributes.filter((attribute) =>
      selectedAttributes.includes(attribute.id)
    );
    const categoryNew = categories.filter(
      (category) => category.id === formData.category
    );

    try {
      const response = await UpdateProduct(data.id, {
        name: formData.name,
        categoryId: formData.category,
        description: formData.description,
        attributes: selectedOptions.map((attributeId) => ({
          attributeId: attributeId.value,
        })),
        images: productImages,
      });

      if (response && response.status === 200) {
        dispatch(
          updateProduct({
            id: data.id,
            name: formData.name,
            category: categoryNew[0],
            description: formData.description,
            productAttributes: attributesNew.map((attribute) => {
              return {
                attributes: attribute,
              };
            }),
          })
        );
        toast.success("Chỉnh sửa sản phẩm thành công");
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
      {/* title button */}
      <Dialog.Trigger>Chỉnh sửa</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
        {/* chỉnh kính thước modal ở max-w-lg các option [max-w-xl,max-w-2xl, max-w-3xl... ] */}
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              {/* title modal */}
              <Dialog.Title className="text-lg font-medium text-gray-800 ">
                Chỉnh sửa sản phẩm
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

            {/* content modal */}
            <Dialog.Description className="space-y-2 p-4 mt-3 text-[15.5px] leading-relaxed text-gray-500">
              <div>
                <div className="grid grid-cols-2 gap-x-5">
                  <div className="mb-4 ">
                    <label className="block text-nowrap text-sm font-medium text-gray-700 pr-6">
                      ID
                    </label>
                    <input
                      readOnly
                      type="text"
                      className="mt-1 block text-[17px] w-full border border-gray-300 rounded-md p-2"
                      required
                      value={formData.id}
                    />
                  </div>

                  <div className="mb-4 ">
                    <label className="block text-nowrap text-sm font-medium text-gray-700 pr-4">
                      Tên sản phẩm
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="mt-1 block text-base w-full border border-gray-300 rounded-md p-2"
                      required
                      value={formData.name}
                      onChange={handleChangeInput}
                    />
                  </div>

                  <div className="mb-4  ">
                    <label className="block w-[130px] text-wrap text-center text-sm font-medium text-gray-700 pr-4">
                      Thể loại sản phẩm
                    </label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      required
                      name="category"
                      value={formData.category}
                      onChange={handleChangeInput}
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
                  <div className="mb-4 ">
                    <label className="block text-nowrap text-sm font-medium text-gray-700 pr-4">
                      Thuộc tính sản phẩm
                    </label>
                    <Select
                      isMulti
                      value={selectedOptions}
                      onChange={handleChangeAttribute}
                      options={attributes}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-5">
                  <div className="mb-4  ">
                    <label className="block text-nowrap text-sm font-medium text-gray-700 pr-4">
                      Ảnh sản phẩm
                    </label>
                    <input
                      onChange={(e) => handleImageChange(e)}
                      type="file"
                      className="mt-1 block text-base w-full border border-gray-300 rounded-md p-2"
                      required
                      multiple
                    />
                  </div>

                  <div className="mb-4 flex justify-center">
                    {formData?.images && formData.images.length > 0 ? (
                      formData.images.map((img, index) => (
                        <div key={index} className="">
                          <img
                            src={img.urlImage}
                            alt={`image-${index}`}
                            className="w-8"
                          />
                        </div>
                      ))
                    ) : (
                      <p>No images available</p>
                    )}
                  </div>
                </div>

                <div className="mb-4 ">
                  <label className="block text-sm text-nowrap pr-2 font-medium text-gray-700">
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    className="mt-1 text-[17px] block w-full border border-gray-300 rounded-md p-2"
                    required
                    name="description"
                    onChange={handleChangeInput}
                    value={formData.description}
                  ></textarea>
                </div>
                <div className="flex justify-end items-center gap-3 p-4 border-t">
                  <button
                    onClick={handleUpdateProduct}
                    type="submit"
                    className="px-6 py-2 text-base text-white bg-indigo-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
                  >
                    Cập nhật
                  </button>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="px-6 py-2 text-base text-gray-800 border rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
                      aria-label="Close"
                    >
                      Đóng
                    </button>
                  </Dialog.Close>
                </div>
              </div>
            </Dialog.Description>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
