import {
  Avatar,
  Button,
  Divider,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

function Comment({ reply, isLastReply }) {
  const showToast = useShowToast();
  const hoverBgColor = useColorModeValue("#E2E8F0", "#363636");
  const [commentUser, setCommentUser] = useState({});
  useEffect(() => {
    const getCommentUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${reply.username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setCommentUser(data);
      } catch (error) {
        showToast("Error", error, "error");
      }
    };
    getCommentUser();
  }, [reply?.username, showToast]);
  return (
    <>
      <Flex
        gap={4}
        py={2}
        my={2}
        w={"full"}
        onClick={(e) => e.preventDefault()}
      >
        <Button
          bg={"transparent"}
          p={0}
          _hover={{ bg: hoverBgColor, borderRadius: "full" }}
        >
          <Link to={`/${commentUser.username}`}>
            <Avatar src={commentUser.profilePic} size={"sm"} />
          </Link>
        </Button>
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Button bg={"transparent"} _hover={{ bg: hoverBgColor }}>
              <Link
                to={`/${commentUser.username}`}
                style={{ fontSize: "sm", fontWeight: "bold" }}
              >
                {commentUser.username}
              </Link>
            </Button>
            <Flex gap={2} alignItems={"center"}>
              <Text size={"sm"}>
                {reply.createdAt &&
                  formatDistanceToNow(new Date(reply?.createdAt))}
              </Text>
              <BsThreeDots />
            </Flex>
          </Flex>
          <Text>{reply?.text}</Text>
        </Flex>
      </Flex>
      {!isLastReply ? <Divider /> : null}
    </>
  );
}

export default Comment;
