import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "./useShowToast";

function useLogout() {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const logout = async () => {
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

  return logout;
}

export default useLogout;
