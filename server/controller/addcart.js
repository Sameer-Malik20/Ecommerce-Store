import Cart from "../models/addCart.js";

// Add item to cart
const CartAdd = async (req, res) => {
  const { userId, itemId } = req.body;

  if (!userId || !itemId) {
    return res.status(400).json({
      success: false,
      message: "Both userId and itemId are required",
    });
  }

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ item: itemId, quantity: 1 }],
      });
    } else {
      const existingItem = cart.items.find(
        (i) => i.item?.toString() === itemId.toString()
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ item: itemId, quantity: 1 });
      }
    }

    await cart.save();
    return res.json({ success: true, cart });
  } catch (err) {
    console.error("CartAdd error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove item from cart
const CartRemove = async (req, res) => {
  const { userId, itemId } = req.body;

  if (!userId || !itemId) {
    return res.status(400).json({
      success: false,
      message: "Both userId and itemId are required",
    });
  }

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const originalLength = cart.items.length;
    cart.items = cart.items.filter(
      (i) => i.item.toString() !== itemId.toString()
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    await cart.save();
    return res.json({ success: true, cart });
  } catch (err) {
    console.error("CartRemove error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Error removing item" });
  }
};

//  Update item quantity
const updateQuantity = async (req, res) => {
  const { userId, itemId, quantity } = req.body;

  if (!userId || !itemId || typeof quantity !== "number") {
    return res.status(400).json({
      success: false,
      message: "userId, itemId, and quantity (as number) are required",
    });
  }

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.item.toString() === itemId.toString()
    );

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    item.quantity = quantity;
    await cart.save();

    return res.json({ success: true, cart });
  } catch (err) {
    console.error("UpdateQuantity error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { CartAdd, CartRemove, updateQuantity };
