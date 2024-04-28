import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getFeedPosts,
  getPost,
  getUserPosts,
  likeUnlikePost,
  replyPost,
} from "../controllers/post.controllers.js";
import authUser from "../middlewares/authUser.middlewares.js";

const router = express.Router();

router.get("/feed", authUser, getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.get("/", getAllPosts);
router.post("/create", authUser, createPost);
router.delete("/:id", authUser, deletePost);
router.put("/like/:id", authUser, likeUnlikePost);
router.put("/reply/:id", authUser, replyPost);

export default router;
