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

function ChatPage() {
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
          <form>
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder="Search for the user" />
              <Button size={"sm"}>
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {/* loading when searching user */}
          {
            /*loadingConversations*/ false &&
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
              ))
          }
          {/* show this when user searching is completed */}
          <Conversation />
          <Conversation />
          <Conversation />
        </Flex>
        {/* messages here */}

        {/* <Flex
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
        </Flex> */}
        {/* <Flex flex={70}>MessageContainer</Flex> */}
        <MessageContainer />
      </Flex>
    </Box>
  );
}

export default ChatPage;
