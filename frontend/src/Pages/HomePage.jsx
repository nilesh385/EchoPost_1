import { Flex, Spinner } from "@chakra-ui/react";
// import { Link } from "react-router-dom";
// import { useRecoilValue } from "recoil";
// import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postAtom from "../atoms/postsAtom";

function HomePage() {
  const [posts, setPosts] = useRecoilState(postAtom);
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useShowToast();
  useEffect(() => {
    const getFeedPosts = async () => {
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        // console.log(data.feedPosts);
        setPosts(data.feedPosts);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setIsLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);
  return (
    <>
      {!isLoading && posts.length === 0 && (
        <Flex align={"center"} justify={"center"}>
          <h1>Follow some users to see feed</h1>
        </Flex>
      )}
      {isLoading && posts && (
        <Flex align={"center"} justify={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {posts &&
        posts.map((post) => {
          return <Post key={post._id} post={post} />;
        })}
    </>
  );
}

export default HomePage;
