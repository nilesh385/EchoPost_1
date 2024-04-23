import { Button } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const onLogout = async () => {
    console.log("logout");
    try {
      const res = await fetch("/api/users/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "Error");
        return;
      }
      localStorage.removeItem("user");
      setUser(null);
      showToast("Success", "Logged out successfully", "success");
    } catch (error) {
      showToast("Error", "Something went wrong while logging out", "error");
    }
  };
  return (
    <Button
      size="sm"
      colorScheme="red" // Red color for logout action
      onClick={onLogout}
      position="fixed" // Fix the button to viewport
      top="1rem" // Set top margin from viewport
      right="1rem" // Set right margin from viewport
    >
      <FiLogOut size={20} />
    </Button>
  );
};

export default LogoutButton;
