import bcrypt from "bcryptjs";
import User from "../models/user.js";

const AdminVerify = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Not an admin", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid password", success: false });
    }
    console.log("admin verified");

    return res.status(200).json({ message: "Admin verified", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export default AdminVerify;
