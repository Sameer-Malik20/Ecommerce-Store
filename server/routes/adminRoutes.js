import { Router } from "express";
import authMid from "../Authmiddleware.js";
import { verifyAdmin } from "../controller/admin.js";
import User from "../models/user.js";
import Cart from "../models/addCart.js";
import { Delete } from "../controller/items.js";
import itemSchema from "../models/item.js";
const router = Router();
// ADMIN ONLY - Get all users
router.get("/users", authMid, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select(
      "-password"
    );
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ADMIN ONLY - Delete any user
router.delete("/deleteuser/:id", authMid, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

// ADMIN ONLY - Get all orders or carts
router.get("/carts", authMid, verifyAdmin, async (req, res) => {
  const carts = await Cart.find().populate("items.item user");
  res.json({ carts });
});

// ADMIN ONLY - Delete any item
router.delete("/deleteitem/:id", authMid, verifyAdmin, async (req, res) => {
  const item = await itemSchema.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "item not found" });
  res.json({ message: "item deleted by admin" });
});

export default router;
