import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utilities/jwtTokens-cookies.js";
import { v2 as cloudinary } from "cloudinary";

const signupUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    // Check for missing fields (optional)
    if (!name || !username || !email || !password) {
      return res
        .status(400)
        .json({ error: `Missing required fields ${req.body.username}` });
    }
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    if (newUser) {
      const token = generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in signupUser: ", error);
  }
};
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res
        .status(400)
        .json({ error: "username or password is incorrect" });
    }

    generateTokenAndSetCookie(user._id, res);

    console.log("Logged in", user.name);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in loginUser: ", error);
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      maxAge: 1,
    });
    console.log("Logged out");
    res.status(200).json({ message: "Logged out Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in logoutUser: ", error);
  }
};

const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot follow/unfolow yourself" });
    }
    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      //unfollow user
      await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { following: id } },
        { new: true }
      );
      //modify currentUser following and modify followers of userToModify
      await User.findByIdAndUpdate(
        id,
        { $pull: { followers: req.user._id } },
        { new: true }
      );
      res.status(200).json({ message: "User Unfollowed Successfully" });
    } else {
      //follow user
      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { following: id } },
        { new: true }
      );
      //modify currentUser following and modify followers of userToModify
      // await User.findByIdAndUpdate(
      //   id,
      //   { $push: { followers: req.user._id } },
      //   { new: true }
      // );
      res.status(200).json({ message: "User Followed Successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in followUnfollowUser: ", error);
  }
};

const userUpdateProfile = async (req, res) => {
  try {
    //get data from user
    const { name, username, email, password, bio } = req.body;
    let { profilePic } = req.body;
    //get user id
    const userid = req.user._id;
    //find user in mongodb
    let user = await User.findById(userid);

    //if user not found give error
    if (!user) return res.status(400).json({ error: "User not found" });
    if (req.params.id !== userid.toString())
      return res
        .status(401)
        .json({ error: "You cannot update other user's profile" });

    //if password is there ,then update it and create its bcrypt hashed version
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword || user.password;
    }
    if (profilePic) {
      console.log(profilePic);
      //if user already has profilePic then delete the old one
      if (user.profilePic) {
        await cloudinary.v2.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }
      //add new profilPic
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }
    //update other fields
    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;
    //save updated user
    user = await user.save();
    res.status(200).json({ message: "Profile Updated Successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in userUpdateProfile: ", error);
  }
};

const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username })
      .select("-password")
      .select("-createdAt")
      .select("-updatedAt");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in getUserProfile: ", error);
  }
};

export {
  signupUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  userUpdateProfile,
  getUserProfile,
};
