import itemSchema from "../models/item.js";
import User from "../models/user.js";

const addReview = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { comment, rating, username } = req.body;
    const currUser = req.user;
    if (!currUser || !currUser.username) {
      return res.status(500).json({ message: "unauthorized" });
    }
    const item = await itemSchema.findById(itemId);
    if (!item) return res.status(404).json({ message: "item not found" });

    item.reviews.push({
      comment,
      rating,
      user: currUser.id,
      username: currUser.username,
      createdAt: new Date(),
    });
    await item.save();
    res.status(200).json({ message: "Review added", reviews: item.reviews });
  } catch (err) {
    console.error("Add review error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export default addReview;
