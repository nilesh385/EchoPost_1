import {
  Avatar,
  Box,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Actions from "./Actions";

function UserPost({ likes, replies, postTitle, postImage }) {
  const [liked, setLiked] = useState(false);

  return (
    <Link to={"/markzukerberg/post/1"}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size={"md"} name="Mark Zukerberg" src="/zuck-avatar.png" />
          <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            <Avatar
              size={"xs"}
              name="nk ok"
              src="/zuck-avatar.png"
              position={"absolute"}
              top={0}
              left={"15px"}
              p={"2px"}
            />
            <Avatar
              size={"xs"}
              name="nk ok"
              src="/post3.png"
              position={"absolute"}
              bottom={0}
              right={"-5px"}
              p={"2px"}
            />
            <Avatar
              size={"xs"}
              name="nk ok"
              src="/post1.png"
              position={"absolute"}
              bottom={0}
              left={1}
              p={"2px"}
            />
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                markzukerberg
              </Text>
              <Image src="/verified.png" h={4} w={4} ml={1} />
            </Flex>
            <Flex
              gap={4}
              alignItems={"center"}
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Text fontSize={"sm"} color={"gray.light"}>
                1d
              </Text>
              <Menu>
                <MenuButton>
                  <BsThreeDots />
                </MenuButton>
                <MenuList>
                  <MenuItem>Download</MenuItem>
                  <MenuItem>Create a Copy</MenuItem>
                  <MenuItem>Mark as Draft</MenuItem>
                  <MenuItem>Delete</MenuItem>
                  <MenuItem>Attend a Workshop</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{postTitle}</Text>
          {postImage && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid "}
              borderColor={"gray.light"}
            >
              <Image
                src={postImage}
                w={"full"}
                h={"full"}
                objectFit={"cover"}
              />
            </Box>
          )}
          <Flex gap={3} my={1}>
            <Actions liked={liked} setLiked={setLiked} />
          </Flex>
          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"} fontSize={"sm"}>
              {replies} replies
            </Text>
            <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
            <Text color={"gray.light"} fontSize={"sm"}>
              {likes} likes
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
}

export default UserPost;
