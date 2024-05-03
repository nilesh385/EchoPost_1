import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import useShowToast from "../hooks/useShowToast";
import Comment from "./Comment";
import { formatDistanceToNow } from "date-fns";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postAtom from "../atoms/postsAtom";

function Post({ post }) {
  const showToast = useShowToast();
  const [postUser, setPostUser] = useState({});
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postAtom);

  useEffect(() => {
    const getPostUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${post.postedBy}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setPostUser(data);
      } catch (error) {
        showToast("Error", error, "error");
      }
    };
    getPostUser();
  }, [post?.postedBy, showToast]);
  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to DELETE")) return;
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      console.log("post deleted");
      showToast("Success", data.message, "success");
      setPosts(posts.filter((prev) => prev._id !== post._id));
    } catch (error) {
      showToast("Error", error, "error");
    }
  };
  if (!post) {
    return;
  }

  return (
    <Link to={`/${postUser.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size={"md"}
            src={postUser.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${postUser.username}`);
            }}
          />
          <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <h1>🥱</h1>}
            {post.replies[0] && (
              <Avatar
                size={"xs"}
                src={post.replies[0].userProfilePic}
                position={"absolute"}
                bottom={0}
                left={1}
                p={"2px"}
              />
            )}
            {post.replies[1] && (
              <Avatar
                size={"xs"}
                src={post.replies[1].userProfilePic}
                position={"absolute"}
                bottom={0}
                right={"-5px"}
                p={"2px"}
              />
            )}

            {post.replies[2] && (
              <Avatar
                size={"xs"}
                src={post.replies[2].userProfilePic}
                position={"absolute"}
                top={0}
                left={"15px"}
                p={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${postUser.username}`);
                }}
              >
                {postUser.username}
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
              <Text
                fontSize={"xs"}
                w={40}
                textAlign={"right"}
                color={"gray.light"}
              >
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              {currentUser?._id === postUser._id && (
                <MdOutlineDeleteOutline size={20} onClick={handleDeletePost} />
              )}
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.text}</Text>
          {post.image && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid "}
              borderColor={"gray.light"}
            >
              <Image
                src={post.image}
                alt="post image"
                w={"full"}
                h={"full"}
                // maxHeight={"60dvh"}
                objectFit={"cover"}
                objectPosition={"center"}
              />
            </Box>
          )}
          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>

          {post?.replies &&
            post.replies.map((reply) => (
              <Comment key={reply._id} reply={reply} />
            ))}
        </Flex>
      </Flex>
    </Link>
  );
}

export default Post;
