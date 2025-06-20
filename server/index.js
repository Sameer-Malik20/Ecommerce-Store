import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/itemRoutes.js";
import routeradmin from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: "https://verdant-concha-12400a.netlify.app",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.get("/", (req, res) => {
  res.send("hello my world");
});

//connect DB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected DB");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
connectDB();

app.use("/api/", router);
app.use("/api/cart", router);
app.use("/api/admin", routeradmin);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
