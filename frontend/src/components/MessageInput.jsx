import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import conversationAtom, {
  selectedConversationAtom,
} from "../atoms/messagesAtom";

function MessageInput({ setMessages }) {
  const [messagetext, setMessagetext] = useState("");
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationAtom);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messagetext) return;

    try {
      const res = await fetch("/api/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientId: selectedConversation.userId,
          message: messagetext,
        }),
      });
      const data = await res.json();
      if (data.error) {
        return showToast("Error", data.error, "error");
      }
      setMessages((prevMsgs) => {
        return [...prevMsgs, data];
      });
      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messagetext,
                sender: data.sender,
              },
            };
          } else {
            return conversation;
          }
        });
        return updatedConversations;
      });
      setMessagetext("");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };
  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup>
        <Input
          w={"full"}
          placeholder="type a message..."
          onChange={(e) => setMessagetext(e.target.value)}
          value={messagetext}
        />
        <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
          <IoSendSharp />
        </InputRightElement>
      </InputGroup>
    </form>
  );
}

export default MessageInput;
