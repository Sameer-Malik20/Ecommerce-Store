import itemSchema from "../models/item.js";

const Create = async (req, res) => {
  const { title, description, image, category, price } = req.body;
  try {
    const item = await new itemSchema({
      title,
      description,
      image,
      category,
      price,
      user: req.user.id,
    });
    await item.save();
    res.status(201).json({
      message: "item Created SuccessFully",
      success: true,
      user: req.user.id,
      item,
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
    const itemUpdate = await itemSchema.findByIdAndUpdate(
      id,
      { title, description, image, category, price },
      { new: true }
    );
    if (!itemUpdate) {
      return res.status(500).json({
        message: "item not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "item Updated Successfully",
      success: true,
      itemUpdate,
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
    const itemDel = await itemSchema.findByIdAndDelete(id);
    if (!itemDel) {
      return res.status(500).json({
        message: "item not Found",
        success: false,
      });
    }
    res.status(200).json({
      message: "item Deleted SuccessFully",
      success: false,
      itemDel,
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};

const getAllitems = async (req, res) => {
  try {
    const items = await itemSchema.find();
    if (!items || items.length == 0) {
      return res.status(500).json({
        message: "items Not Found",
        success: false,
      });
    }
    res.status(200).json({
      message: "items Fecthed Successfully",
      success: true,
      items,
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};
export { Create, Update, Delete, getAllitems };
