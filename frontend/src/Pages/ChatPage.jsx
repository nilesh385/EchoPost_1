import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import conversationAtom, {
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

function ChatPage() {
  const showToast = useShowToast();
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversations, setConversations] = useRecoilState(conversationAtom);
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setSelectedConversation = useSetRecoilState(selectedConversationAtom);
  const currentUser = useRecoilValue(userAtom);

  const [searchText, setSearchText] = useState("");
  const [searchingUsers, setSearchingUsers] = useState(false);
  const { onlineUsers, socket } = useSocket();

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((convs) => {
          if (convs._id === conversationId) {
            return {
              ...convs,
              lastMessage: {
                ...convs.lastMessage,
                seen: true,
              },
            };
          }
          return convs;
        });
        return updatedConversations;
      });
    });
  }, [setConversations, socket]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        if (selectedConversation.mock) return;
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
        }
        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingConversations(false);
      }
    };
    getConversations();
  }, [showToast, setConversations, selectedConversation.mock]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUsers(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        showToast("Error", searchedUser.error, "error");
      }

      const messaginYourself = searchedUser._id === currentUser._id;
      if (messaginYourself) {
        showToast("Error", "You cannot message yourself", "error");
        return;
      }

      const alreadyInConversation = conversations.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );
      if (alreadyInConversation) {
        setSelectedConversation({
          _id: alreadyInConversation._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            name: searchedUser.name,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };
      setConversations((prevConvs) => [...prevConvs, mockConversation]);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setSearchingUsers(false);
    }
  };

  return (
    <Box
      position={"absolute"}
      //   left={"50%"}
      //   transform={"translateX(-50%"}
      mx={"auto"}
      width={{
        base: "100%",
        md: "80%",
        lg: "750px",
      }}
      p={4}
      style={{ border: "1px solid gray" }}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{
            sm: "250px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            {" "}
            Your Conversations
          </Text>
          {/* search user here */}
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="Search for the user"
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
              />
              <Button
                size={"sm"}
                onClick={handleConversationSearch}
                isLoading={searchingUsers}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {/* loading when searching user */}
          {loadingConversations &&
            [0, 1, 2, 3].map((_, i) => (
              <Flex key={i} alignItems={"center"} p={1} borderRadius={"md"}>
                <Box>
                  <SkeletonCircle size={10} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}
          {/* show this when user searching is completed */}
          {!loadingConversations &&
            conversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                isOnline={onlineUsers.includes(
                  conversation.participants[0]._id
                )}
                conversation={conversation}
              />
            ))}
        </Flex>
        {/* messages here */}
        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={"xl"} fontWeight={"bold"}>
              Select a conversation to start messaging
            </Text>
          </Flex>
        )}
        {/* <Flex flex={70}>MessageContainer</Flex> */}
        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
}

export default ChatPage;
