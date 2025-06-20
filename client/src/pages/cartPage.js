import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SHIPPING_RATES = {
  standard: 5,
  express: 15,
  overnight: 25,
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [promoValid, setPromoValid] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!localStorage.getItem("token");

  // Fetch cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        // Convert backend cart to local cartItems format
        setCartItems(
          res.data.cart.items.map((item) => ({
            id: item.item._id,
            name: item.item.title,
            model: item.item.model || "",
            hsCode: item.item.hsCode || "",
            quantity: item.quantity,
            weight: item.item.weight || 1,
            perPieceRate: item.item.price,
            totalPrice: item.item.price * item.quantity,
            color: "Black",
            deliveryMethod: "Air",
            description: item.item.description,
            isEditingDescription: false,
            originalDescription: "",
            showDescription: false,
            image: item.item.image || "https://via.placeholder.com/150",
          }))
        );
      } catch (e) {
        setCartItems([]);
      }
      setLoading(false);
    };
    fetchCart();
  }, []);

  // Remove item
  const removeItem = async (index) => {
    const item = cartItems[index];
    try {
      const userId = localStorage.getItem("userId");
      await axios.post("http://localhost:5000/api/cart/remove", {
        userId,
        itemId: item.id,
      });
      setCartItems((prev) => prev.filter((_, i) => i !== index));
    } catch {
      toast.error("Failed to remove item");
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;
    // Optionally call backend to clear cart
    setCartItems([]);
  };

  // Quantity handlers
  const incrementQuantity = async (index) => {
    const item = cartItems[index];
    const newQty = item.quantity + 1;
    await updateQuantity(index, newQty);
  };

  const decrementQuantity = async (index) => {
    const item = cartItems[index];
    if (item.quantity <= 1) return;
    const newQty = item.quantity - 1;
    await updateQuantity(index, newQty);
  };

  const updateQuantity = async (index, newQty) => {
    if (newQty < 1) return;
    const item = cartItems[index];
    try {
      const userId = localStorage.getItem("userId");
      await axios.post("http://localhost:5000/api/cart/update", {
        userId,
        itemId: item.id,
        quantity: newQty,
      });
      setCartItems((prev) =>
        prev.map((it, i) =>
          i === index
            ? { ...it, quantity: newQty, totalPrice: it.perPieceRate * newQty }
            : it
        )
      );
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  // Promo code logic
  const applyPromoCode = () => {
    const promoCodes = {
      SAVE10: { discount: 0.1, message: "10% discount applied!" },
      FREESHIP: {
        discount: 0,
        message: "Free shipping applied!",
        freeShipping: true,
      },
      WELCOME20: { discount: 0.2, message: "20% discount applied!" },
    };
    if (promoCode.trim() === "") {
      setPromoMessage("Please enter a promo code");
      setPromoValid(false);
      setDiscount(0);
      return;
    }
    const promo = promoCodes[promoCode.toUpperCase()];
    if (promo) {
      setPromoValid(true);
      setPromoMessage(promo.message);
      if (promo.discount) {
        setDiscount(subtotal * promo.discount);
      } else {
        setDiscount(0);
      }
      if (promo.freeShipping) setShippingMethod("standard");
    } else {
      setPromoValid(false);
      setPromoMessage("Invalid promo code");
      setDiscount(0);
    }
  };

  // Description edit handlers
  const startEditingDescription = (index) => {
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              originalDescription: item.description,
              isEditingDescription: true,
            }
          : item
      )
    );
  };
  const saveDescription = (index) => {
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isEditingDescription: false } : item
      )
    );
  };
  const cancelEditingDescription = (index) => {
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              description: item.originalDescription,
              isEditingDescription: false,
            }
          : item
      )
    );
  };
  const toggleDescription = (index) => {
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, showDescription: !item.showDescription } : item
      )
    );
  };

  // Color helper
  const getColorHex = (color) => {
    const colorMap = {
      Black: "#000000",
      Silver: "#C0C0C0",
      Blue: "#0047AB",
      Red: "#FF0000",
      White: "#FFFFFF",
    };
    return colorMap[color] || "#000000";
  };

  // Totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const shippingCost = SHIPPING_RATES[shippingMethod] || 5;
  const tax = (subtotal - discount) * 0.075;
  const total = subtotal + shippingCost + tax - discount;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-gray-500">
          Please login to view your cart.
        </span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-gray-500">Loading cart...</span>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <i className="fas fa-shopping-cart text-gray-300 text-5xl mb-4"></i>
          <p className="text-xl text-gray-500">Your cart is empty</p>
          <a
            href="/"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
          Shopping Cart
        </h1>
        <div className="bg-blue-600 text-white px-3 py-1 rounded-full flex items-center">
          <i className="fas fa-shopping-cart mr-2"></i>
          <span>{cartItems.length}</span>
          <span className="hidden sm:inline ml-1">items</span>
        </div>
      </div>

      {/* Cart Items Table (Desktop) */}
      <div className="hidden sm:block mb-8">
        <div className="responsive-table">
          <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Item</th>
                <th className="py-3 px-4 text-left">Details</th>
                <th className="py-3 px-4 text-center">Quantity</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <tr className="border-t border-gray-200 hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt="Item"
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.model}</p>
                          <p className="text-xs text-gray-500">
                            HS: {item.hsCode}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">
                            Color:
                          </span>
                          <select
                            value={item.color}
                            onChange={(e) =>
                              setCartItems((prev) =>
                                prev.map((it, i) =>
                                  i === index
                                    ? { ...it, color: e.target.value }
                                    : it
                                )
                              )
                            }
                            className="text-sm border rounded p-1"
                          >
                            <option value="Black">Black</option>
                            <option value="Silver">Silver</option>
                            <option value="Blue">Blue</option>
                            <option value="Red">Red</option>
                            <option value="White">White</option>
                          </select>
                          <div
                            className="w-4 h-4 ml-2 rounded-full"
                            style={{ backgroundColor: getColorHex(item.color) }}
                          ></div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">
                            Delivery:
                          </span>
                          <select
                            value={item.deliveryMethod}
                            onChange={(e) =>
                              setCartItems((prev) =>
                                prev.map((it, i) =>
                                  i === index
                                    ? { ...it, deliveryMethod: e.target.value }
                                    : it
                                )
                              )
                            }
                            className={`text-sm border rounded p-1 ${
                              item.deliveryMethod === "Air"
                                ? "bg-blue-50 text-blue-800"
                                : item.deliveryMethod === "Ship"
                                ? "bg-green-50 text-green-800"
                                : "bg-purple-50 text-purple-800"
                            }`}
                          >
                            <option value="Air">Air</option>
                            <option value="Ship">Ship</option>
                            <option value="Express">Express</option>
                          </select>
                        </div>
                        <div className="flex items-center"></div>
                        <button
                          onClick={() => toggleDescription(index)}
                          className="text-xs text-blue-600 flex items-center mt-1"
                        >
                          <span>
                            {item.showDescription
                              ? "Hide Description"
                              : "Show Description"}
                          </span>
                          <i
                            className={`fas ml-1 ${
                              item.showDescription
                                ? "fa-chevron-up"
                                : "fa-chevron-down"
                            }`}
                          ></i>
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => decrementQuantity(index)}
                          className="px-2 py-1 text-gray-500 border rounded-l"
                        >
                          -<i className="fas fa-minus text-xs"></i>
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(index, Number(e.target.value))
                          }
                          className="w-12 text-center border-y"
                        />
                        <button
                          onClick={() => incrementQuantity(index)}
                          className="px-2 py-1 text-gray-500 border rounded-r"
                        >
                          +<i className="fas fa-plus text-xs"></i>
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-medium">
                        ₹{item.perPieceRate.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold">
                        ₹{item.totalPrice.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                  {item.showDescription && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="py-3 px-6">
                        {!item.isEditingDescription ? (
                          <>
                            <p className="text-sm text-gray-700">
                              {item.description}
                            </p>
                            <button
                              onClick={() => startEditingDescription(index)}
                              className="text-xs text-blue-600 mt-1"
                            >
                              <i className="fas fa-edit mr-1"></i> Edit
                              Description
                            </button>
                          </>
                        ) : (
                          <>
                            <textarea
                              value={item.description}
                              onChange={(e) =>
                                setCartItems((prev) =>
                                  prev.map((it, i) =>
                                    i === index
                                      ? { ...it, description: e.target.value }
                                      : it
                                  )
                                )
                              }
                              className="w-full text-sm border rounded p-2"
                              rows={2}
                            />
                            <div className="flex justify-end space-x-2 mt-2">
                              <button
                                onClick={() => cancelEditingDescription(index)}
                                className="text-xs px-3 py-1 border rounded hover:bg-gray-100"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => saveDescription(index)}
                                className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                Save
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cart Items (Mobile) */}
      <div className="sm:hidden">
        {cartItems.map((item, index) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                <img
                  src={item.image}
                  alt="Item"
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-sm text-gray-600">{item.model}</p>
                </div>
              </div>
              <button
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">HS Code:</span>
                <span>{item.hsCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Color:</span>
                <div className="flex items-center">
                  <select
                    value={item.color}
                    onChange={(e) =>
                      setCartItems((prev) =>
                        prev.map((it, i) =>
                          i === index ? { ...it, color: e.target.value } : it
                        )
                      )
                    }
                    className="text-sm border rounded p-1"
                  >
                    <option value="Black">Black</option>
                    <option value="Silver">Silver</option>
                    <option value="Blue">Blue</option>
                    <option value="Red">Red</option>
                    <option value="White">White</option>
                  </select>
                  <div
                    className="w-4 h-4 ml-2 rounded-full"
                    style={{ backgroundColor: getColorHex(item.color) }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Quantity:</span>
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => decrementQuantity(index)}
                    className="px-2 py-1 text-gray-500"
                  >
                    <i className="fas fa-minus text-xs"></i>
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(index, Number(e.target.value))
                    }
                    className="w-12 text-center border-x"
                  />
                  <button
                    onClick={() => incrementQuantity(index)}
                    className="px-2 py-1 text-gray-500"
                  >
                    <i className="fas fa-plus text-xs"></i>
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight:</span>
                <span>{item.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery:</span>
                <select
                  value={item.deliveryMethod}
                  onChange={(e) =>
                    setCartItems((prev) =>
                      prev.map((it, i) =>
                        i === index
                          ? { ...it, deliveryMethod: e.target.value }
                          : it
                      )
                    )
                  }
                  className="text-sm border rounded p-1"
                >
                  <option value="Air">Air</option>
                  <option value="Ship">Ship</option>
                  <option value="Express">Express</option>
                </select>
              </div>
              <div className="flex justify-between font-medium">
                <span>Price:</span>
                <span>₹{item.perPieceRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>₹{item.totalPrice.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t mt-2">
                <button
                  onClick={() => toggleDescription(index)}
                  className="text-blue-600 text-sm flex items-center"
                >
                  <span>
                    {item.showDescription
                      ? "Hide Description"
                      : "Show Description"}
                  </span>
                  <i
                    className={`fas ml-1 ${
                      item.showDescription ? "fa-chevron-up" : "fa-chevron-down"
                    }`}
                  ></i>
                </button>
                {item.showDescription && (
                  <div className="mt-2">
                    {!item.isEditingDescription ? (
                      <>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                        <button
                          onClick={() => startEditingDescription(index)}
                          className="text-xs text-blue-600 mt-1"
                        >
                          <i className="fas fa-edit mr-1"></i> Edit
                        </button>
                      </>
                    ) : (
                      <>
                        <textarea
                          value={item.description}
                          onChange={(e) =>
                            setCartItems((prev) =>
                              prev.map((it, i) =>
                                i === index
                                  ? { ...it, description: e.target.value }
                                  : it
                              )
                            )
                          }
                          className="w-full text-sm border rounded p-2 mt-1"
                          rows={3}
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={() => cancelEditingDescription(index)}
                            className="text-xs px-2 py-1 border rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => saveDescription(index)}
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded"
                          >
                            Save
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          {/* Shipping Options */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Options</h2>
            <div className="space-y-3">
              {Object.entries(SHIPPING_RATES).map(([method, price]) => (
                <label
                  key={method}
                  className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="shippingMethod"
                    value={method}
                    checked={shippingMethod === method}
                    onChange={() => setShippingMethod(method)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium capitalize">
                      {method} Shipping
                    </div>
                    <div className="text-sm text-gray-600">
                      {method === "standard"
                        ? "Delivery in 5-7 business days"
                        : method === "express"
                        ? "Delivery in 1-3 business days"
                        : "Next day delivery"}
                    </div>
                  </div>
                  <div className="ml-auto font-medium">₹{price.toFixed(2)}</div>
                </label>
              ))}
            </div>
          </div>
          {/* Promo Code */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Promo Code</h2>
            <div className="flex">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className="flex-grow border rounded-l p-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={applyPromoCode}
                className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition"
              >
                Apply
              </button>
            </div>
            {promoMessage && (
              <div
                className={`mt-2 text-sm ${
                  promoValid ? "text-green-600" : "text-red-600"
                }`}
              >
                {promoMessage}
              </div>
            )}
          </div>
        </div>
        {/* Order Total */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">₹{shippingCost.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span className="font-medium">₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center"
              disabled={cartItems.length === 0}
            >
              <i className="fas fa-lock mr-2"></i> Proceed to Checkout
            </button>
            <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
              <i className="fas fa-shield-alt mr-2"></i> Secure Checkout
            </div>
            <div className="flex justify-center space-x-2 mt-4">
              <i className="fab fa-cc-visa text-2xl text-blue-900"></i>
              <i className="fab fa-cc-mastercard text-2xl text-red-600"></i>
              <i className="fab fa-cc-amex text-2xl text-blue-500"></i>
              <i className="fab fa-cc-paypal text-2xl text-blue-700"></i>
            </div>
          </div>
        </div>
      </div>
      {/* Continue Shopping & Clear Cart */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
        <a
          href="/"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Continue Shopping
        </a>
        <button onClick={clearCart} className="text-red-600 hover:text-red-800">
          <i className="fas fa-trash mr-1"></i> Clear Cart
        </button>
      </div>
    </div>
  );
};

export default CartPage;
