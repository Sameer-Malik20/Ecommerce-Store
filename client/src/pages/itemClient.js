import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../componets/footer";
import Hero from "../componets/hero";
import { toast } from "react-toastify";

// Simple SVG icons
const EditIcon = () => (
  <svg
    className="w-5 h-5 text-blue-500 hover:text-blue-700 transition"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V21h8"
    ></path>
  </svg>
);
const DeleteIcon = () => (
  <svg
    className="w-5 h-5 text-red-500 hover:text-red-700 transition"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    ></path>
  </svg>
);

const CATEGORY_LIST = [
  "Electronics",
  "Clothing",
  "Books",
  "Home",
  "Beauty",
  "Sports",
  "Toys",
  "Grocery",
  "Other",
];

const ItemClient = ({}) => {
  const [items, setitems] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // For popup update form
  const [showPopup, setShowPopup] = useState(false);
  const [edititem, setEdititem] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");
  const [price, SetPrice] = useState("");
  const [category, setCategory] = useState(""); // Add this for edit form
  const fileinputref = useRef(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null); // for delete button
  const [updateLoading, setUpdateLoading] = useState(false); // for update button
  const [selectedCategory, setSelectedCategory] = useState(""); // <-- add this

  // Get userId directly from localStorage on every render
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    allitems();
    // eslint-disable-next-line
  }, []);

  const allitems = async () => {
    setLoading(true); // start loading
    try {
      const res = await axios.get(`http://localhost:5000/api/allitems`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setitems(res.data.items);
      }
    } catch (e) {
      toast.error("Error fetching items");
    }
    setLoading(false); // stop loading
  };

  // Search filter
  const filtereditems = items.filter((item) => {
    const searchMatch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());

    const categoryMatch =
      !selectedCategory ||
      selectedCategory === "" ||
      item.category === selectedCategory;

    return searchMatch && categoryMatch;
  });

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setDeleteLoadingId(id);
    try {
      const res = await axios.delete(`http://localhost:5000/api/delete/${id}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        allitems();
      }
    } catch (e) {
      toast.error("please login");
    }
    setDeleteLoadingId(null);
  };

  // Open popup for update
  const openEditPopup = (item) => {
    setEdititem(item);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditImage(item.image);
    SetPrice(item.price || "");
    setCategory(item.category || ""); // <-- add this
    setShowPopup(true);
    if (fileinputref.current) fileinputref.current.value = null;
  };

  // Update item
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/update/${edititem._id}`,
        {
          title: editTitle,
          description: editDescription,
          image: editImage,
          price: price,
          category: category, // <-- add this
        },
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setShowPopup(false);
        setEdititem(null);
        allitems();
      }
    } catch (e) {
      toast.error("Error updating item");
    }
    setUpdateLoading(false);
  };

  const handleAddToCart = async (itemId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Please login first");
        return;
      }

      if (!userId) {
        return toast.error("Please login to add items to the cart.");
      }

      await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          userId,
          itemId,
        },
        { withCredentials: true }
      );
      toast.success("Added to cart!");
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(`Error: ${e.response.data.message}`);
      } else if (e.message) {
        toast.error(`Error: ${e.message}`);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };
  // Skeleton loader component
  const ItemSkeleton = () => (
    <li className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-purple-100 dark:border-slate-700 flex flex-col overflow-hidden p-0">
      <div className="h-56 w-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
      <div className="flex-1 flex flex-col px-7 py-6">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-4 animate-pulse"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2 animate-pulse"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6 mb-6 animate-pulse"></div>
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
        </div>
      </div>
    </li>
  );

  return (
    <div>
      <Hero />

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Explore Our Premium Gear
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Top-rated tech and lifestyle essentials to power your day. Free
          shipping on all orders above $50.
        </p>
        <div className="mt-6">
          <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800">
            Shop Now
          </button>
        </div>
      </div>
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <button
          className={`px-4 py-2 rounded-full font-medium ${
            !selectedCategory
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setSelectedCategory("")}
        >
          All
        </button>
        {CATEGORY_LIST.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full font-medium ${
              selectedCategory === cat
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 px-2 transition-colors duration-300">
        <div className="max-w-screen-xl mx-auto px-4">
          {/* item Cards Grid */}
          <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <ItemSkeleton key={i} />)
            ) : filtereditems.length === 0 ? (
              <li className="col-span-full text-center text-gray-400 dark:text-gray-500 text-lg">
                No items found. Try a different search!
              </li>
            ) : (
              filtereditems.map((item) => {
                const avgRating =
                  item.reviews && item.reviews.length
                    ? item.reviews.reduce(
                        (sum, r) => sum + (r.rating || 0),
                        0
                      ) / item.reviews.length
                    : 0;
                return (
                  <li
                    key={item._id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden group flex flex-col relative w-full mx-auto"
                    onClick={() => navigate(`/item/${item._id}`)}
                  >
                    {/* Badge (New/Sale) */}
                    {(item.isNew || item.isSale) && (
                      <span
                        className={`absolute top-3 right-3 text-white text-xs px-2 py-1 rounded z-10 ${
                          item.isSale ? "bg-red-600" : "bg-black"
                        }`}
                      >
                        {item.isSale ? "SALE" : "NEW"}
                      </span>
                    )}

                    {/* Image */}
                    <div className="relative">
                      <img
                        src={
                          item.image ||
                          "https://via.placeholder.com/320x320?text=No+Image"
                        }
                        alt={item.title}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-2 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        {/* Star Rating */}
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <=
                                Math.round(
                                  item.reviews && item.reviews.length
                                    ? item.reviews.reduce(
                                        (sum, r) => sum + (r.rating || 0),
                                        0
                                      ) / item.reviews.length
                                    : 0
                                )
                                  ? "text-yellow-400"
                                  : "text-gray-200"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {item.reviews?.length || 0} reviews
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-lg font-semibold text-green-600">
                          ₹{item.price}
                        </span>
                        <button
                          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item._id);
                          }}
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>

                    {/* Edit & Delete buttons only for creator */}
                    {userId &&
                      item.user &&
                      item.user.toString() === userId.toString() && (
                        <div className="absolute top-3 left-3 flex gap-2 z-20">
                          <button
                            className="bg-white dark:bg-slate-700 rounded-full p-2 shadow hover:bg-blue-50 dark:hover:bg-slate-600 flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditPopup(item);
                            }}
                            title="Edit"
                            disabled={updateLoading}
                          >
                            <EditIcon />
                          </button>
                          <button
                            className="bg-white dark:bg-slate-700 rounded-full p-2 shadow hover:bg-red-50 dark:hover:bg-slate-600 flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item._id);
                            }}
                            title="Delete"
                            disabled={deleteLoadingId === item._id}
                          >
                            {deleteLoadingId === item._id ? (
                              <svg
                                className="animate-spin h-5 w-5 text-red-500"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8z"
                                />
                              </svg>
                            ) : (
                              <DeleteIcon />
                            )}
                          </button>
                        </div>
                      )}
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* Popup Update Form */}
        {showPopup && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <form
              onSubmit={handleUpdate}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 flex flex-col gap-5 border border-purple-100 dark:border-slate-700 w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-2xl"
                onClick={() => setShowPopup(false)}
                title="Close"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-2 text-center">
                Update item
              </h2>
              <input
                className="border border-purple-200 dark:border-slate-700 bg-purple-50 dark:bg-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-700 transition placeholder:text-purple-300 dark:placeholder:text-slate-400 text-lg shadow-sm text-gray-900 dark:text-gray-100"
                type="text"
                value={editTitle}
                placeholder="Title"
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
              <textarea
                className="border border-purple-200 dark:border-slate-700 bg-purple-50 dark:bg-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-700 transition placeholder:text-purple-300 dark:placeholder:text-slate-400 text-lg shadow-sm min-h-[80px] resize-none text-gray-900 dark:text-gray-100"
                value={editDescription}
                placeholder="Description"
                onChange={(e) => setEditDescription(e.target.value)}
                required
              ></textarea>
              <input
                className="border border-purple-200 dark:border-slate-700 bg-purple-50 dark:bg-slate-700 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 dark:file:bg-slate-600 file:text-purple-700 dark:file:text-purple-200 hover:file:bg-purple-200 dark:hover:file:bg-slate-700 transition shadow-sm text-gray-900 dark:text-gray-100"
                type="file"
                accept="image/*"
                ref={fileinputref}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setEditImage(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <select
                className="border border-purple-200 dark:border-slate-700 bg-purple-50 dark:bg-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-700 transition text-lg shadow-sm text-gray-900 dark:text-gray-100"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {CATEGORY_LIST.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                className="border border-purple-200 dark:border-slate-700 bg-purple-50 dark:bg-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-700 transition placeholder:text-purple-300 dark:placeholder:text-slate-400 text-lg shadow-sm text-gray-900 dark:text-gray-100"
                type="number"
                value={price}
                placeholder="Price"
                min={0}
                onChange={(e) => SetPrice(e.target.value)}
                required
              />
              <button
                className="bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-800 dark:to-blue-900 text-white font-semibold rounded-lg py-2 hover:from-purple-700 hover:to-blue-600 dark:hover:from-purple-900 dark:hover:to-blue-800 transition text-lg shadow flex items-center justify-center"
                type="submit"
                disabled={updateLoading}
              >
                {updateLoading && (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                )}
                {updateLoading ? "Processing..." : "Update Item"}
              </button>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ItemClient;
