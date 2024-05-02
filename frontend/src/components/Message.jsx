import { Avatar, Flex, Text, useColorMode } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";

function Message({ message, ownMessage }) {
  const { colorMode } = useColorMode();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf="flex-end">
          <Text
            maxW={"330px"}
            bg={colorMode === "dark" ? "blue.400" : "blue.300"}
            p={1}
            borderRadius={"md"}
          >
            {message.text}
          </Text>
          <Avatar name={user.name} src={user.profilePic} w={7} h={7} />
        </Flex>
      ) : (
        <Flex gap={2} alignSelf={"flex-start"}>
          <Avatar
            name={selectedConversation.username}
            src={selectedConversation.userProfilePic}
            w={7}
            h={7}
          />
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
