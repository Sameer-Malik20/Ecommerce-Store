import Cart from "../models/addCart.js";

const CartAdd = async (req, res) => {
  const { userId, blogId } = req.body;
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [{ blog: blogId, quantity: 1 }] });
  } else {
    const item = cart.items.find((i) => i.blog.toString() === blogId);
    if (item) {
      item.quantity += 1;
    } else {
      cart.items.push({ blog: blogId, quantity: 1 });
    }
  }

  await cart.save();
  res.json({ success: true, cart });
};

// Remove item from cart
export const CartRemove = async (req, res) => {
  const { userId, blogId } = req.body;
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    // Remove the item
    cart.items = cart.items.filter((item) => item.blog.toString() !== blogId);
    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error removing item" });
  }
};

export const updateQuantity = async (req, res) => {
  const { userId, blogId, quantity } = req.body;
  if (!userId || !blogId || !quantity) {
    return res.status(400).json({ error: "Missing fields" });
  }
  try {
    // Find user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    // Find item and update quantity
    const item = cart.items.find((it) => it.blog.toString() === blogId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.quantity = quantity;
    await cart.save();

    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
export default CartAdd;
