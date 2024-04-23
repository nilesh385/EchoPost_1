import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getFeedPosts,
  getPost,
  likeUnlikePost,
  replyPost,
} from "../controllers/post.controllers.js";
import authUser from "../middlewares/authUser.middlewares.js";

const router = express.Router();

router.get("/feed", authUser, getFeedPosts);
router.get("/:id", getPost);
router.get("/", getAllPosts);
router.post("/create", authUser, createPost);
router.delete("/delete/:id", authUser, deletePost);
router.post("/like/:id", authUser, likeUnlikePost);
router.post("/reply/:id", authUser, replyPost);

export default router;
