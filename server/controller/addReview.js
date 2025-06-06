import Blog from "../models/blog.js";

const addReview = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { comment, rating } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.reviews.push({
      comment,
      rating,
      createdAt: new Date(),
    });
    await blog.save();

    res.status(200).json({ message: "Review added", reviews: blog.reviews });
  } catch (err) {
    console.error("Add review error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export default addReview;
