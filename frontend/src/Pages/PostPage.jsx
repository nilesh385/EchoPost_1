import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import { useState } from "react";
import Comment from "../components/Comment";

function PostPage() {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src="/zuck-avatar.png" size={"md"} name="Mark Zukerberg" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              markzukerberg
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
          <Text color={"gray.light"} fontSize={"sm"}>
            1d
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>
      <Text my={3}>Lets talk now.</Text>
      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid "}
        borderColor={"gray.light"}
      >
        <Image src={"/post1.png"} w={"full"} h={"full"} objectFit={"cover"} />
      </Box>

      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>

      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          238 replies
        </Text>

        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {200 + (liked ? 1 : 0)} likes
        </Text>
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      <Comment
        comment="looks really great"
        createdAt="2d"
        like="300"
        avatar="/post2.png"
        username="example123"
      />
      <Comment
        comment="cool dude"
        createdAt="1d"
        like="12"
        avatar="/post1.png"
        username="okgotohell"
      />
      <Comment
        comment="awesome"
        createdAt="1d"
        like="127"
        avatar="/post3.png"
        username="angel123"
      />
    </>
  );
}

export default PostPage;
