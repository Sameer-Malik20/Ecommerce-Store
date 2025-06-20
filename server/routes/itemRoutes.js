import { Router } from "express";
import { Create, Delete, getAllitems, Update } from "../controller/items.js";
import { Login, logout, Signup } from "../controller/auth.js";
import authMid from "../Authmiddleware.js";
import addReview from "../controller/addReview.js";
import deleteReview from "../controller/deleteReview.js";
import { CartAdd, CartRemove, updateQuantity } from "../controller/addcart.js";
import Cart from "../models/addCart.js";
import { verifyAdmin } from "../controller/admin.js";
const router = Router();

router.post("/create", verifyAdmin, authMid, Create);
router.put("/update/:id", authMid, Update);
router.delete("/delete/:id", authMid, Delete);
router.get("/allitems", getAllitems);
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", logout);
router.post("/item/:itemId/review", authMid, addReview);
router.delete("/item/:itemId/review/:reviewId", authMid, deleteReview);
router.get("/currentuser", authMid, (req, res) => {
  res.json({ userId: req.user.id, username: req.user.username });
});
router.post("/add", CartAdd);
router.get("/:userId", async (req, res) => {
  const cart = await Cart.findOne({ user: req.params.userId }).populate(
    "items.item"
  );
  res.json({ cart });
});
router.post("/remove", CartRemove);
router.post("/update", updateQuantity);
export default router;
