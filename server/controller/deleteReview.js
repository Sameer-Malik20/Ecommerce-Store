import Blog from "../models/blog.js";

const deleteReview = async (req, res) => {
  try {
    const { blogId, reviewId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const review = blog.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Only review creator can delete
    if (review.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Remove review using filter
    blog.reviews = blog.reviews.filter(
      (r) => r._id.toString() !== reviewId.toString()
    );
    await blog.save();

    res.status(200).json({ message: "Review deleted", reviews: blog.reviews });
  } catch (err) {
    console.error("Delete review error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export default deleteReview;
