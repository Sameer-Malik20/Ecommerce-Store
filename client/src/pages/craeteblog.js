import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, SetImage] = useState("");
  const [price, SetPrice] = useState("");
  const [category, setCategory] = useState(""); // ADD THIS
  const [loading, setLoading] = useState(false);
  const fileinputref = useRef(null);
  const navigate = useNavigate();
  const [Error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const blog = { title, description, image, price, category }; // REMOVE dueDate, ADD category
      const res = await axios.post("http://localhost:5000/api/create", blog, {
        withCredentials: true,
      });
      if (res.status === 201) {
        setTitle("");
        setDescription("");
        SetImage("");
        SetPrice("");
        setCategory(""); // RESET CATEGORY
        if (fileinputref.current) fileinputref.current.value = null;
        navigate("/"); // Blog create hone ke baad home par redirect
      }
      setError(res.message || "create faild Product");
    } catch (e) {
      alert("Error creating blog");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white border-4 rounded-lg shadow relative m-10 max-w-5xl mx-auto">
      <div className="flex items-start justify-between p-5 border-b rounded-t">
        <h3 className="text-xl font-semibold">Add Product</h3>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Product Name */}
            <div>
              <label
                htmlFor="product-name"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Product Name
              </label>
              <input
                type="text"
                name="product-name"
                id="product-name"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-3"
                placeholder="Apple iMac 27”"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Category
              </label>
              <select
                name="category"
                id="category"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-3"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Price
              </label>
              <input
                type="number"
                name="price"
                id="price"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-3"
                placeholder="₹2300"
                value={price}
                onChange={(e) => SetPrice(e.target.value)}
                required
                min={0}
              />
            </div>
          </div>

          {/* Product Image & Price in 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div>
              <label
                htmlFor="image"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Product Image
              </label>
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      SetImage(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {image && (
                <img
                  src={image}
                  alt="Preview"
                  className="mt-2 h-24 w-auto object-cover rounded-lg border border-purple-300"
                />
              )}
            </div>

            {/* (Optional) You can add another field beside image here if needed */}
          </div>

          {/* Product Details */}
          <div>
            <label
              htmlFor="product-details"
              className="text-sm font-medium text-gray-900 block mb-2"
            >
              Product Details
            </label>
            <textarea
              id="product-details"
              rows="6"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4"
              placeholder="Details"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 rounded-b">
          <button
            className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-6 py-3"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save All"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;

// return (
//   <div className="bg-white border border-4 rounded-lg shadow relative m-10 max-w-2xl mx-auto">
//     <div className="flex items-start justify-between p-5 border-b rounded-t">
//       <h3 className="text-xl font-semibold">Add Product</h3>
//     </div>
//     <form onSubmit={handleSubmit} encType="multipart/form-data">
//       <div className="p-6 space-y-6">
//         <div className="grid grid-cols-6 gap-6">
//           <div className="col-span-6 sm:col-span-3">
//             <label
//               htmlFor="product-name"
//               className="text-sm font-medium text-gray-900 block mb-2"
//             >
//               Product Name
//             </label>
//             <input
//               type="text"
//               name="product-name"
//               id="product-name"
//               className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
//               placeholder="Apple Imac 27”"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//             />
//           </div>
//           <div className="col-span-6 sm:col-span-3">
//             <label
//               htmlFor="category"
//               className="text-sm font-medium text-gray-900 block mb-2"
//             >
//               Category
//             </label>
//             <select
//               name="category"
//               id="category"
//               className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               required
//             >
//               <option value="">Select Category</option>
//               <option value="Electronics">Electronics</option>
//               <option value="Clothing">Clothing</option>
//               <option value="Books">Books</option>
//               <option value="Sports">Sports</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>
//           <div className="col-span-6 sm:col-span-3">
//             <label
//               htmlFor="image"
//               className="text-sm font-medium text-gray-900 block mb-2"
//             >
//               Product Image
//             </label>
//             <input
//               type="file"
//               name="image"
//               id="image"
//               accept="image/*"
//               className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2"
//               onChange={handleImageChange}
//             />
//             {image && (
//               <img
//                 src={URL.createObjectURL(image)}
//                 alt="Preview"
//                 className="mt-2 h-20 rounded"
//               />
//             )}
//           </div>
//           <div className="col-span-6 sm:col-span-3">
//             <label
//               htmlFor="price"
//               className="text-sm font-medium text-gray-900 block mb-2"
//             >
//               Price
//             </label>
//             <input
//               type="number"
//               name="price"
//               id="price"
//               className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
//               placeholder="₹2300"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               required
//               min={0}
//             />
//           </div>

//           <div className="col-span-full">
//             <label
//               htmlFor="product-details"
//               className="text-sm font-medium text-gray-900 block mb-2"
//             >
//               Product Details
//             </label>
//             <textarea
//               id="product-details"
//               rows="6"
//               className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4"
//               placeholder="Details"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               required
//             ></textarea>
//           </div>
//         </div>
//       </div>
//       <div className="p-6 border-t border-gray-200 rounded-b">
//         <button
//           className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
//           type="submit"
//           disabled={loading}
//         >
//           {loading ? "Saving..." : "Save all"}
//         </button>
//       </div>
//     </form>
//   </div>
// );
