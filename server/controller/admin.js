import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    // Try to extract token from header if not in cookies
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1]; // "Bearer TOKEN"
    }

    if (!token) return res.status(401).json({ message: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access denied" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Admin Middleware Error:", err.message);
    res.status(500).json({ message: "Auth failed" });
  }
};
