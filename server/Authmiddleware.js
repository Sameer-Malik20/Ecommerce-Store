// middleware/authMid.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const authMid = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Please Login" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ message: "User not found" });

    
    req.user = {
      id: user._id,
      username: user.username,
      role: user.role, 
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMid;
