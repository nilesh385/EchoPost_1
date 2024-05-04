import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
//connect to cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Middlewares
app.use(express.json({ limit: "10mb" })); //to parse JSOn data in the req.body
app.use(express.urlencoded({ extended: true })); //to parse form data in the req.body
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

//http://localhost:5000 => backend,frontend

if (process.env.NODE_ENV === "production") {
  console.log("running in production mode");
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // react app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

//listening server (it's http server created in socket file) on port or 3000
server.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
