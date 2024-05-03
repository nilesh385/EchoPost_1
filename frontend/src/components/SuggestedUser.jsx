import { Avatar, Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { useNavigate } from "react-router-dom";

const SuggestedUser = ({ user }) => {
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const { following, handleFollowUnfollow, updatingFollow } =
    useFollowUnfollow(user);
  if (!currentUser) {
    return null;
  }
  return (
    <>
      <Flex gap={2} justifyContent={"space-between"}>
        <Flex gap={2}>
          <Avatar
            size={{
              base: "xs",
              md: "md",
              sm: "sm",
            }}
            src={user.profilePic}
            cursor={"pointer"}
            onClick={() => navigate(`/${user.username}`)}
          />
          <Box>
            <Text fontWeight={500} display={"flex"} alignItems={"center"}>
              {user.username} <Image src="/verified.png" w={4} h={4} />
            </Text>
            <Text fontSize={"sm"} color={"gray.500"}>
              {user.name}
            </Text>
          </Box>
        </Flex>

        {/* follow/unfollow button */}
        <Flex>
          <Button
            size={"sm"}
            bg={following ? "gray.200" : "blue.400"}
            color={following ? "gray.dark" : "#fff"}
            onClick={handleFollowUnfollow}
            _hover={{
              bg: following ? "gray.300" : "blue.300",
            }}
            isLoading={updatingFollow}
          >
            {following ? "Unfollow" : "Follow"}
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default SuggestedUser;
