import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useImagePreview from "../hooks/useImagePreview";
import useShowToast from "../hooks/useShowToast";
import { Link } from "react-router-dom";

export default function UpdateProfile() {
  const [user, setUser] = useRecoilState(userAtom);
  const showToast = useShowToast();
  const [updating, setUpdating] = useState(false);
  const [inputsData, setInputsData] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    password: "",
    bio: user.bio,
    profilePic: user.profilePic,
  });
  const fileRef = useRef(null);
  // console.log("user", user);

  const { handleImageChange, imgUrl } = useImagePreview();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      console.log(user, imgUrl);
      const response = await fetch(`/api/users/update/${user?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputsData, profilePic: imgUrl }),
      });
      const data = await response.json();
      console.log(data);
      if (data.error) {
        showToast("Error", data.error, "error");
      } else {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        showToast("Success", "Profile updated successfully.", "success");
      }
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };
  return (
    <form action="" onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl>
            <FormLabel>User Icon</FormLabel>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  boxShadow={"md"}
                  src={user.profilePic || imgUrl}
                />
              </Center>
              <Center w="full">
                <Button w={"full"} onClick={() => fileRef.current.click()}>
                  Change Avatar
                </Button>
                <Input
                  type="file"
                  ref={fileRef}
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full Name</FormLabel>
            <Input
              placeholder="Full Name"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputsData.name}
              onChange={(e) =>
                setInputsData({ ...inputsData, name: e.target.value })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="UserName"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputsData.username}
              onChange={(e) =>
                setInputsData({ ...inputsData, username: e.target.value })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              value={inputsData.email}
              onChange={(e) =>
                setInputsData({ ...inputsData, email: e.target.value })
              }
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
              value={inputsData.password}
              onChange={(e) =>
                setInputsData({ ...inputsData, password: e.target.value })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Your bio..."
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputsData.bio}
              onChange={(e) =>
                setInputsData({ ...inputsData, bio: e.target.value })
              }
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Link style={{ width: "100%" }} to={"/"}>
              <Button
                bg={"red.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "red.500",
                }}
                title="Cancel the update and go to home page"
              >
                Cancel
              </Button>
            </Link>
            <Button
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
              type="submit"
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
