import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postAtom from "../atoms/postsAtom";

function UserPage() {
  const { username } = useParams();
  const showToast = useShowToast();

  const [post, setPost] = useRecoilState(postAtom);
  const [fetchingPost, setFetchingPost] = useState(true);
  const { isLoading, user } = useGetUserProfile();

  useEffect(() => {
    const getPost = async () => {
      if (!user) return;
      setFetchingPost(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPost(data.userPosts);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setFetchingPost(false);
      }
    };
    getPost();
  }, [username, showToast, setPost, user]);

  if (!user && isLoading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!user && !isLoading) return <h1>User not found.</h1>;

  return (
    <>
      {user.followers && <UserHeader user={user} />}
      {!fetchingPost && post?.length === 0 && <h1>User has no post.</h1>}
      {fetchingPost && (
        <Flex justifyContent={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {post &&
        post.length > 0 &&
        post?.map((post) => <Post key={post._id} post={post} />)}
    </>
  );
}

export default UserPage;
