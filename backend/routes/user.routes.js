import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  userUpdateProfile,
  getUserProfile,
  getSuggestedUsers,
  freezeAccount,
} from "../controllers/user.controllers.js";
import authUser from "../middlewares/authUser.middlewares.js";

const router = express.Router();
router.get("/profile/:query", getUserProfile);
router.get("/suggested", authUser, getSuggestedUsers);
router.post("/signup", signupUser);
//login
router.post("/login", loginUser);
//updating profile
router.get("/logout", authUser, logoutUser);
router.get("/follow/:id", authUser, followUnfollowUser);
router.put("/update/:id", authUser, userUpdateProfile);
router.put("/freeze", authUser, freezeAccount);

export default router;
