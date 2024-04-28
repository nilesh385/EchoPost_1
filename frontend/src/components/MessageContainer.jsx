import {
  Avatar,
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

function MessageContainer() {
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
        <Avatar src="" size={"sm"}></Avatar>
        <Text display={"flex"} alignItems={"center"}>
          johndoe <Image src="/verified.png" w={4} h={4} ml={1} />
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
        {false &&
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

        <Message ownMessage={true} />
        <Message ownMessage={false} />
        <Message ownMessage={false} />
        <Message ownMessage={true} />
        <Message ownMessage={false} />
        <Message ownMessage={true} />
        <Message ownMessage={false} />
      </Flex>
      <MessageInput />
    </Flex>
  );
}

export default MessageContainer;
