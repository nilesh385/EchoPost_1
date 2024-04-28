import Post from "../models/post.models.js";
import User from "../models/user.models.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let { image } = req.body;

    if (!postedBy || !text) {
      res.status(400).json({ error: "postedBy and text fields are required" });
    }
    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ error: "Unauthorized to create post." });
    }
    const maxLength = 500;
    if (text.length > maxLength) {
      return res.status(400).json({
        error: `Text cannot be longer than ${maxLength} characters`,
      });
    }
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      image = uploadedResponse.secure_url;
    }
    const newPost = new Post({
      postedBy,
      text,
      image,
    });
    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
    console.log("Post created successfully", newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
    // console.log("Error in createPost: ", error);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ message: "Post found", post });
    // console.log("Post found", post);
  } catch (error) {
    res.status(500).json({ error: error.message });
    // console.log("Error in getPost: ", error);
  }
};
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to delete post." });
    }
    if (post.image) {
      const imgId = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully", post });
    console.log("Post deleted successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
    // console.log("Error in deletePost: ", error);
  }
};
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ message: "Posts found", posts });
    // console.log("Posts found", posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
    // console.log("Error in getAllPosts: ", error);
  }
};

const likeUnlikePost = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      //unlike post
      await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      );
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      //like post
      await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } },
        { new: true }
      );
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    res.status(404).send({ error: error.message });
    console.log("Error in likeUnlikePost: ", error);
  }
};

const replyPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const username = req.user.username;
    const userProfilePic = req.user.profilePic;

    if (!text) {
      return res.status(400).json({ error: "text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const reply = { userId, text, userProfilePic, username };

    post.replies.push(reply);
    await post.save();

    res.status(200).json({ message: "Reply added successfully", reply });
  } catch (error) {
    res.status(500).send({ error: error.message });
    console.log("Error in replyPost: ", error);
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const following = user.following;
    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    res.status(200).json({ message: "feed posts", feedPosts });
    // console.log("Posts found", feedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in getFeedPost: ", error);
  }
};

const getUserPosts = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userPosts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ message: "user posts" + "" + username, userPosts });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in getUserPosts: ", error);

    // console.log("Error in getUserPosts: ", error);
  }
};

export {
  createPost,
  getPost,
  deletePost,
  getAllPosts,
  likeUnlikePost,
  replyPost,
  getFeedPosts,
  getUserPosts,
};
