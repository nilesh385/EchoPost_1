import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect } from "react";
import Comment from "../components/Comment";
import { Link, useNavigate, useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { MdOutlineDeleteOutline } from "react-icons/md";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postAtom from "../atoms/postsAtom";

function PostPage() {
  const { user, isLoading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const currentPost = posts[0];

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data.post]);
      } catch (err) {
        showToast("Error", err.message, "error");
      }
    };
    getPost();
  }, [pid, showToast, setPosts]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to DELETE")) return;
      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      console.log("post deleted");
      setPosts(posts.filter((prev) => prev._id !== posts._id));
      showToast("Success", data.message, "success");
      navigate("/");
    } catch (error) {
      showToast("Error", error, "error");
    }
  };

  if (!currentPost) return null;
  if (isLoading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner />
      </Flex>
    );
  }
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Link
            to={`/${user.username}`}
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <Avatar src={user.profilePic} size={"md"} />
            <Flex>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                {user.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
          </Link>
        </Flex>

        <Flex
          gap={4}
          alignItems={"center"}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <Text fontSize={"xs"} w={40} textAlign={"right"} color={"gray.light"}>
            {currentPost.createdAt &&
              formatDistanceToNow(new Date(currentPost?.createdAt))}{" "}
            ago
          </Text>
          {currentUser?._id === user?._id && (
            <MdOutlineDeleteOutline
              size={20}
              onClick={handleDeletePost}
              cursor={"pointer"}
            />
          )}
        </Flex>
      </Flex>
      <Text my={3}>{currentPost.text}</Text>
      {currentPost.image && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid "}
          borderColor={"gray.light"}
        >
          <Image
            src={currentPost.image}
            w={"full"}
            h={"full"}
            objectFit={"cover"}
          />
        </Box>
      )}

      <Flex gap={3} my={3}>
        {currentPost && <Actions post={currentPost} />}
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
      {currentPost?.replies &&
        currentPost.replies?.map((reply) => (
          <Comment
            key={reply._id}
            reply={reply}
            isLastReply={
              reply._id ===
              currentPost.replies[currentPost.replies.length - 1]._id
            }
          />
        ))}
    </>
  );
}

export default PostPage;
