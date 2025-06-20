// controllers/authController.js
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const Signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    // Check if user already exists (by username or email)
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        message: "Username or Email already exists. Please login.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
    });

    await newUser.save();

    res.status(201).json({
      message: "Signup successful. Please login.",
      success: true,
      newUser,
    });
  } catch (e) {
    console.error("Signup Error:", e.message);
    res.status(500).json({
      message: "Server error during signup",
      success: false,
    });
  }
};

const Login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
  httpOnly: true,
  secure: true,            
  sameSite: "none",     
  maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
});


    res.status(200).json({
      message: "Login Successfully",
      success: true,
      token,
      username: user.username,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        isAdmin: user.role === "admin",
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({
      message: "Error logging in",
      success: false,
    });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Logout successfully",
  });
};

export { Signup, Login, logout };
