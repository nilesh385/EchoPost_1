import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";
import useShowToast from "../hooks/useShowToast";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

function UserHeader({ user }) {
  const { colorMode } = useColorMode();
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom); //logged in user
  const { following, handleFollowUnfollow, updatingFollow } =
    useFollowUnfollow(user);
  // const [isFollowing, setIsFollowing] = useState(
  //   user?.followers?.toString().includes(currentUser._id.toString())
  // );

  const copyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      showToast("Success", "Profile link copied to clipboard", "success");
    });
  };
  const handleReply = async () => {
    await handleFollowUnfollow();
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user?.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user?.username}</Text>
            <Text
              fontSize={"xs"}
              bg={colorMode === "light" ? "transparent" : "gray.dark"}
              p={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            src={user?.profilePic}
            border={"2px solid "}
            borderColor={"green"}
            size={{
              base: "md",
              md: "xl",
            }}
          >
            {currentUser?._id === user?._id && (
              <RouterLink to={"/update"}>
                <AvatarBadge boxSize={"1em"}>
                  <MdOutlineEdit
                    color={colorMode === "dark" ? "#ECECEC" : ""}
                  />
                </AvatarBadge>
              </RouterLink>
            )}
          </Avatar>
        </Box>
      </Flex>

      <Text>{user?.bio}</Text>
      {currentUser?._id !== user?._id && (
        <Button
          size={"sm"}
          onClick={handleReply}
          isLoading={updatingFollow}
          loadingText="following"
        >
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Text color={"gray.light"}>{user?.following?.length} following</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex gap={2}>
          <Box>
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box>
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem h={4} bg={"gray.dark"} onClick={copyUrl}>
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
          color={"gray.light"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
}

export default UserHeader;
