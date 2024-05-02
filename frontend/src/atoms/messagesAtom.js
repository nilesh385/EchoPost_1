import { atom } from "recoil";

const conversationAtom = atom({
  key: "conversationAtom",
  default: [],
});

export default conversationAtom;

export const selectedConversationAtom = atom({
  key: "selectedConversationAtom",
  default: {
    _id: "",
    userId: "",
    username: "",
    userProfilePic: "",
    // messages: [],
  },
});
