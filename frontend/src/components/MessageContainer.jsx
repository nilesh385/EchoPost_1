import {
  Avatar,
  Box,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import conversationAtom, {
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import messageSound from "../assets/sounds/message-sound.mp3";

function MessageContainer() {
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const setConversations = useSetRecoilState(conversationAtom);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectedConversation._id === message.conversationId) {
        setMessages((prevMsgs) => [...prevMsgs, message]);
      }

      if (!document.hasFocus()) {
        const sound = new Audio(messageSound);
        sound.play();
      }

      setConversations((prevConvos) => {
        const updatedConversations = prevConvos.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });

    return () => {
      socket.off("newMessage");
    };
  }, [selectedConversation._id, socket, setConversations]);

  useEffect(() => {
    const isLastMessageFromOtherUser =
      messages.length &&
      messages[messages.length - 1].sender !== currentUser._id;

    if (isLastMessageFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }

    socket.on("messagesSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prevMsgs) => {
          const updatedMessages = prevMsgs.map((msg) => {
            if (!msg.seen) {
              return {
                ...msg,
                seen: true,
              };
            }
            return msg;
          });
          return updatedMessages;
        });
      }
    });
  }, [currentUser._id, messages, selectedConversation, socket]);

  useEffect(() => {
    lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      if (selectedConversation.mock) {
        setTimeout(() => {
          setLoadingMessages(false);
          setMessages([]);
        }, 1000);
        return;
      }
      try {
        const res = await fetch(`/api/messages/${selectedConversation.userId}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setMessages(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingMessages(false);
      }
    };

    getMessages();
  }, [selectedConversation.userId, showToast, selectedConversation.mock]);

  return (
    <Flex
      flex={70}
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      flexDirection={"column"}
      p={2}
    >
      {/* Message header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar
          src={selectedConversation.userProfilePic || ""}
          size={"sm"}
          cursor={"pointer"}
        />
        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation.username}{" "}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
      </Flex>
      <Divider />

      {/* messages */}
      <Flex
        flexDir={"column"}
        p={2}
        gap={4}
        my={4}
        maxH={"400px"}
        overflowY={"auto"}
      >
        {loadingMessages &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              <Flex flexDir={"column"} gap={2}>
                {i % 2 === 0 && <SkeletonCircle size={7} />}
                <Skeleton h={1} w={"250px"} />
                <Skeleton h={1} w={"250px"} />
                <Skeleton h={1} w={"250px"} />
              </Flex>
              {!i % 2 === 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}
        {!loadingMessages &&
          messages.map((message) => (
            <Flex
              key={message._id}
              direction={"column"}
              ref={
                messages.length - 1 === messages.indexOf(message)
                  ? lastMessageRef
                  : null
              }
            >
              <Message
                message={message}
                ownMessage={message.sender === currentUser._id}
              />
            </Flex>
          ))}
      </Flex>

      {/* message bottom. message input and send button */}
      <Box>
        <MessageInput setMessages={setMessages} />
      </Box>
    </Flex>
  );
}

export default MessageContainer;
