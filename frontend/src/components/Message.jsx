import { Avatar, Flex, Text } from "@chakra-ui/react";

function Message({ ownMessage }) {
  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf="flex-end">
          <Text maxW={"330px"} bg={"blue.400"} p={1} borderRadius={"md"}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque
          </Text>
          <Avatar src="" w={7} h={7} />
        </Flex>
      ) : (
        <Flex gap={2} alignSelf={"flex-start"}>
          <Avatar src="" w={7} h={7} />
          <Text maxW={"330px"} bg={"gray.600"} p={1} borderRadius={"md"}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque
          </Text>
        </Flex>
      )}
    </>
  );
}

export default Message;
