import { Avatar, Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { BsCheckAll } from "react-icons/bs";

function Message({ message, ownMessage }) {
  const { colorMode } = useColorMode();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf="flex-end">
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

          <Avatar src={user.profilePic} w={7} h={7} />
        </Flex>
      ) : (
        <Flex gap={2} alignSelf={"flex-start"}>
          <Avatar src={selectedConversation.userProfilePic} w={7} h={7} />
          <Text
            maxW={"330px"}
            bg={colorMode === "dark" ? "gray.600" : "gray.300"}
            p={1}
            borderRadius={"md"}
          >
            {message.text}
          </Text>
        </Flex>
      )}
    </>
  );
}

export default Message;
