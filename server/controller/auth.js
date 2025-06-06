import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const Signup = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(500).json({
        message: "username Already Exist Please Login",
        success: false,
        existingUser,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user", // ✅ Safety check
    });
    await newUser.save();
    res.status(200).json({
      message: "Signup Successfull Please Login",
      success: true,
      newUser,
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};

const JWT_SECRET = process.env.JWT_SECRET;
const Login = async (req, res) => {
  const { username, password } = req.body;
  try {
    //find by email
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(500).json({
        message: "User Not Found",
      });
    }

    //compare hashedpassword
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).json({
        message: "Invalid credentials",
        success: false,
        isMatch,
      });
    }
    //generate JWT Token
    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, {
      expiresIn: "3d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
    });
    return res.status(200).json({
      message: "Login Successfully",
      success: true,
      user,
      token,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "logout successfully",
  });
};

export { Signup, Login, logout };
