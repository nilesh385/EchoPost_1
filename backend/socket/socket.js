import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.models.js";
import Conversation from "../models/conversation.models.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

export const getRecipienSocketId = (recipientid) => {
  return userSocketMap[recipientid];
};

const userSocketMap = {}; //userId:socketId

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId !== "undefined") userSocketMap[userId] = socket.id;

  console.log(Object.keys(userSocketMap).length, "user connected", socket.id);

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); //taking the keys of userSocketMap (userIds) and converting it into an array

  socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
    try {
      await Message.updateMany(
        {
          conversationId: conversationId,
          seen: false,
        },
        {
          $set: {
            seen: true,
          },
        }
      );
      await Conversation.updateOne(
        {
          _id: conversationId,
        },
        {
          $set: {
            "lastMessage.seen": true,
          },
        }
      );
      io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
