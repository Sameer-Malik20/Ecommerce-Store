// models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
});

const isAdmin = mongoose.model("User", userSchema);
export default isAdmin;
