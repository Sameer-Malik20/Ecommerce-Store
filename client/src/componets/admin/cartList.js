import React, { useEffect, useState } from "react";
import axios from "axios";

function CartsList() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true); // start with true to show loading initially

  useEffect(() => {
    const fetchCarts = async () => {
      setLoading(true); // show loading before fetch
      try {
        const res = await axios.get("http://localhost:5000/api/admin/carts", {
          withCredentials: true,
        });
        setCarts(res.data.carts);
      } catch (err) {
        console.error("Error fetching carts:", err);
      } finally {
        setLoading(false); // hide loading after fetch
      }
    };

    fetchCarts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <span className="text-lg text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {carts.length === 0 ? (
        <p>No carts found.</p>
      ) : (
        carts.map((cart) => (
          <div key={cart._id} className="mb-6 p-4 border rounded shadow">
            <h3 className="text-lg font-bold mb-2">
              User: {cart.user?.username || "Unknown"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cart.items.map((item, index) => (
                <div key={index} className="p-2 border rounded bg-gray-50">
                  <h4 className="font-semibold">
                    {item.item?.title || "No Title"}
                  </h4>
                  <p>{item.item?.description}</p>
                  {item.item?.image && (
                    <img
                      src={item.item.image}
                      alt="item"
                      className="w-32 h-32 object-cover mt-2 rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default CartsList;
