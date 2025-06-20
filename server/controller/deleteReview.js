import itemSchema from "../models/item.js";

const deleteReview = async (req, res) => {
  try {
    const { itemId, reviewId } = req.params;
    const item = await itemSchema.findById(itemId);
    if (!item) return res.status(404).json({ message: "item not found" });

    const review = item.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Only review creator can delete
    if (review.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Remove review using filter
    item.reviews = item.reviews.filter(
      (r) => r._id.toString() !== reviewId.toString()
    );
    await item.save();

    res.status(200).json({ message: "Review deleted", reviews: item.reviews });
  } catch (err) {
    console.error("Delete review error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export default deleteReview;
