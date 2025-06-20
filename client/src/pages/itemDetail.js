import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setitem] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/allitems`).then((res) => {
      const found = res.data.items.find((b) => b._id === id);
      setitem(found);
      setMainImage(found?.image || "");
    });
    axios
      .get(`http://localhost:5000/api/currentuser`, { withCredentials: true })
      .then((res) => {
        setUserId(res.data.userId);
        setCurrentUsername(res.data.username); // save username
      })
      .catch(() => {});
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { userId, itemId: item._id },
        { withCredentials: true }
      );
      toast.success("Added to cart!");
    } catch (e) {
      toast.error("Please Login");
    }
  };

  if (!item)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-xl">Loading...</div>
      </div>
    );

  // Example thumbnails array (add more if your item has multiple images)
  const thumbnails = [
    item.image,
    "https://images.unsplash.com/photo-1505751171710-1f6d0ace5a85?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1496957961599-e35b69ef5d7c?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1528148343865-51218c4a13e6?auto=format&fit=crop&w=400&q=80",
  ].filter(Boolean);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-4">
          {/* Item Images */}
          <div className="w-full md:w-1/2 px-4 mb-8">
            <img
              src={mainImage || thumbnails[0]}
              alt="Item"
              className="w-full h-auto rounded-lg shadow-md mb-4"
              id="mainImage"
            />
            <div className="flex gap-4 py-4 justify-center overflow-x-auto">
              {thumbnails.map((thumb, idx) => (
                <img
                  key={idx}
                  src={thumb}
                  alt={`Thumbnail ${idx + 1}`}
                  className={`size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300 ${
                    mainImage === thumb
                      ? "opacity-100 ring-2 ring-indigo-500"
                      : ""
                  }`}
                  onClick={() => setMainImage(thumb)}
                />
              ))}
            </div>
          </div>
          {/* Item Details */}
          <div className="w-full md:w-1/2 px-4">
            <h2 className="text-3xl font-bold mb-2">{item.title}</h2>
            <div className="mb-4">
              <span className="text-2xl font-bold mr-2">₹{item.price}</span>
              {/* <span className="text-gray-500 line-through">$399.99</span> */}
            </div>
            <div className="flex items-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`size-6 ${
                    star <=
                    Math.round(
                      item.reviews && item.reviews.length
                        ? item.reviews.reduce(
                            (sum, r) => sum + (r.rating || 0),
                            0
                          ) / item.reviews.length
                        : 0
                    )
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
              <span className="ml-2 text-gray-600">
                {item.reviews?.length
                  ? (
                      item.reviews.reduce(
                        (sum, r) => sum + (r.rating || 0),
                        0
                      ) / item.reviews.length
                    ).toFixed(1)
                  : "0.0"}{" "}
                ({item.reviews?.length || 0} reviews)
              </span>
            </div>
            <p className="text-gray-700 mb-6">{item.description}</p>
            {/* Color and Quantity (static for now) */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Color:</h3>
              <div className="flex space-x-2">
                <button className="w-8 h-8 bg-black rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black" />
                <button className="w-8 h-8 bg-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300" />
                <button className="w-8 h-8 bg-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min={1}
                defaultValue={1}
                className="w-12 text-center rounded-md border-gray-300  shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                disabled
              />
            </div>
            <div className="flex space-x-4 mb-6">
              <button
                className="bg-indigo-600 flex gap-2 items-center text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={handleAddToCart}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
                Add to Cart
              </button>
              <button className="bg-gray-200 flex gap-2 items-center  text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
                Wishlist
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
              <ul className="list-disc list-inside text-gray-700">
                <li>Industry-leading noise cancellation</li>
                <li>30-hour battery life</li>
                <li>Touch sensor controls</li>
                <li>Speak-to-chat technology</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Reviews Section */}
        <div className="max-w-2xl mx-auto mt-10">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              try {
                await axios.post(
                  `http://localhost:5000/api/item/${item._id}/review`,
                  { comment: review, rating, currentUsername, userId },
                  { withCredentials: true }
                );
                setReview("");
                setRating(5);
                // Reload item to show new review
                const res = await axios.get(
                  `http://localhost:5000/api/allitems`
                );
                const found = res.data.items.find((b) => b._id === item._id);
                setitem(found);
              } catch (err) {
                toast.error(
                  err.response?.data?.message ||
                    "Failed to post review. Please try again."
                );
              }
              setLoading(false);
            }}
            className="mt-6 flex flex-col gap-2"
          >
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Add a review..."
              className="px-4 py-2 rounded border border-purple-200 dark:border-slate-700"
              required
            />
            <div className="flex items-center gap-2">
              <span className="text-gray-700 dark:text-gray-200">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={
                    star <= rating
                      ? "text-yellow-400 text-xl"
                      : "text-gray-300 text-xl"
                  }
                >
                  ★
                </button>
              ))}
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-purple-600 text-white flex items-center justify-center"
              disabled={loading}
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
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
              {loading ? "Posting..." : "Post"}
            </button>
          </form>
          {item.reviews && item.reviews.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-2">Reviews</h3>
              {item.reviews.map((r, i) => (
                <div
                  key={i}
                  className="mb-3 p-3 rounded bg-purple-50 dark:bg-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-purple-700 dark:text-purple-200">
                      {r.username || "User"}
                    </span>
                    <span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            star <= r.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </span>
                    {/* Delete button: */}
                    {userId &&
                      r.user &&
                      r.user.toString() === userId.toString() && (
                        <button
                          onClick={async () => {
                            await axios.delete(
                              `http://localhost:5000/api/item/${item._id}/review/${r._id}`,
                              { withCredentials: true }
                            );
                            // Reload item to update reviews
                            const res = await axios.get(
                              `http://localhost:5000/api/allitems`
                            );
                            const found = res.data.items.find(
                              (b) => b._id === item._id
                            );
                            setitem(found);
                          }}
                          className="ml-2 text-red-500 hover:underline text-xs flex items-center gap-1"
                          title="Delete Review"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 3h6a2 2 0 012 2v2H7V5a2 2 0 012-2z"
                            />
                          </svg>
                          Delete
                        </button>
                      )}
                  </div>
                  <div className="text-gray-700 dark:text-gray-100">
                    {r.comment}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
