import express from "express";
import authUser from "../middlewares/authUser.middlewares.js";
import {
  sendMessage,
  getMessages,
  getConversations,
} from "../controllers/message.controllers.js";

const router = express.Router();

router.get("/conversations", authUser, getConversations);
router.get("/:otherUserId", authUser, getMessages);
router.post("/", authUser, sendMessage);

export default router;
