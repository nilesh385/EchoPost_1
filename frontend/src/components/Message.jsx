import {
  Avatar,
  Box,
  Flex,
  Image,
  Skeleton,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { BsCheckAll } from "react-icons/bs";
import { useState } from "react";

function Message({ message, ownMessage }) {
  const { colorMode } = useColorMode();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf="flex-end">
          {message.text && (
            <Flex
              bg={colorMode === "dark" ? "green.800" : "green.600"}
              maxHeight={"350px"}
              p={1}
              borderRadius={"md"}
            >
              <Text maxW={"330px"} color={"#fff"} p={1} borderRadius={"md"}>
                {message.text}
              </Text>
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "blue.400" : "#fff"}
                fontWeight={"bold"}
                fontSize={"xs"}
              >
                <BsCheckAll />
              </Box>
            </Flex>
          )}
          {message.image && !imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={message.image}
                hidden
                onLoad={() => setImgLoaded(true)}
                alt="message image"
                borderRadius={4}
              />

              <Skeleton width={"200px"} height={"200px"} />
            </Flex>
          )}
          {message.image && imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.image} alt="message image" borderRadius={4} />
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "blue.400" : "#fff"}
                fontWeight={"bold"}
                fontSize={"xs"}
              >
                <BsCheckAll />
              </Box>
            </Flex>
          )}

          <Avatar src={user.profilePic} w={7} h={7} />
        </Flex>
      ) : (
        <Flex gap={2} alignSelf={"flex-start"}>
          <Avatar src={selectedConversation.userProfilePic} w={7} h={7} />
          {message.text && (
            <Text
              maxW={"330px"}
              bg={colorMode === "dark" ? "gray.600" : "gray.300"}
              p={1}
              borderRadius={"md"}
            >
              {message.text}
            </Text>
          )}
          {message.image && !imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={message.image}
                hidden
                onLoad={() => setImgLoaded(true)}
                alt="message image"
                borderRadius={4}
              />
              <Skeleton height={"200px"} width={"200px"} />
            </Flex>
          )}
          {message.image && imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.image} alt="message image" borderRadius={4} />
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
}

export default Message;
