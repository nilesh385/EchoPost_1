import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import useImagePreview from "../hooks/useImagePreview";
import { BsFillImageFill } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";

function CreatePost() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const imgRef = useRef();
  const { handleImageChange, imgUrl, setImgUrl } = useImagePreview();
  const MAX_CHAR = 500;
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const showToast = useShowToast();
  const user = useRecoilValue(userAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postAtom);
  const { username } = useParams();

  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };
  const handleCreatePost = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          image: imgUrl,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      if (username === user.username) {
        setPosts([data.post, ...posts]);
      }
      onClose();
      setImgUrl("");
      setPostText("");
      setRemainingChar(MAX_CHAR);
      showToast("Success", data.message, "success");
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        size={{
          base: "sm",
          sm: "md",
        }}
      >
        <AddIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                onChange={handleTextChange}
                value={postText}
                maxLength={500}
              ></Textarea>
              <Text
                fontSize={"xs"}
                fontWeight={"bold"}
                m={1}
                textAlign={"right"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>
              <Input
                type="file"
                ref={imgRef}
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
              <BsFillImageFill
                style={{ cursor: "pointer", marginLeft: 4, background: "" }}
                size={24}
                onClick={() => imgRef.current.click()}
              />
            </FormControl>
            {imgUrl && (
              <Flex my={3} w={"full"} position={"relative"}>
                <Image
                  src={imgUrl}
                  height={"20rem"}
                  width={"full"}
                  objectFit={"cover"}
                  objectPosition={"center"}
                  alt="Selected Image"
                />
                <CloseIcon
                  position={"absolute"}
                  top={2}
                  right={2}
                  cursor={"pointer"}
                  background={"gray.dark"}
                  borderRadius={"full"}
                  p={"0.5"}
                  onClick={() => setImgUrl("")}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              onClick={handleCreatePost}
              isLoading={isLoading}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreatePost;
