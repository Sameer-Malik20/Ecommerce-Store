// scripts/createAdmin.js
import mongoose from "mongoose";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

await mongoose.connect(
  "mongodb+srv://votit54786:EoTYoHZxCehQL51S@cluster0.crhfxe3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

const hashedPassword = await bcrypt.hash("sameer123", 10);

const admin = new User({
  username: "sameer",
  email: "sameer@gmail.com",
  password: hashedPassword,
  isAdmin: true,
});

await admin.save();
console.log("Admin user created: sameer@gmail.com / sameer123");
process.exit();
