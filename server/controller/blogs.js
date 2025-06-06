import BlogSchema from "../models/blog.js";

const Create = async (req, res) => {
  const { title, description, image, category, price } = req.body;
  try {
    const blog = await new BlogSchema({
      title,
      description,
      image,
      category,
      price,
      user: req.user.id,
    });
    await blog.save();
    res.status(201).json({
      message: "Blog Created SuccessFully",
      success: true,
      user: req.user.id,
      blog,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "server error",
      success: false,
      error,
    });
  }
};

const Update = async (req, res) => {
  const { id } = req.params;
  const { title, description, image, category, price } = req.body;
  try {
    const blogUpdate = await BlogSchema.findByIdAndUpdate(
      id,
      { title, description, image, category, price },
      { new: true }
    );
    if (!blogUpdate) {
      return res.status(500).json({
        message: "blog not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Blog Updated Successfully",
      success: true,
      blogUpdate,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};

const Delete = async (req, res) => {
  try {
    const { id } = req.params;
    const blogDel = await BlogSchema.findByIdAndDelete(id);
    if (!blogDel) {
      return res.status(500).json({
        message: "Blog not Found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Blog Deleted SuccessFully",
      success: false,
      blogDel,
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogSchema.find();
    if (!blogs || blogs.length == 0) {
      return res.status(500).json({
        message: "Blogs Not Found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Blogs Fecthed Successfully",
      success: true,
      blogs,
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};
export { Create, Update, Delete, getAllBlogs };
