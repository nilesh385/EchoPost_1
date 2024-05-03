import { useState } from "react";
import useShowToast from "./useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const useFollowUnfollow = (user) => {
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [updatingFollow, setUpdatingFollow] = useState(false);
  const [following, setFollowing] = useState(
    user?.followers?.includes(currentUser?._id)
  );

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast("Error", "Login/Signup to follow the user", "error");
    }
    setUpdatingFollow(true);

    try {
      const response = await fetch(`/api/users/follow/${user._id}`);
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      if (following) {
        user.followers.filter((id) => id !== currentUser?._id); // simulate removing from followers
        showToast("Success", `${data.message} ${user.username}`, "success");
      } else {
        user.followers.push(currentUser?._id); // simulate adding from followers
        showToast("Success", `${data.message} ${user.username}`, "success");
      }
      setFollowing(!following);
      console.log(data);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdatingFollow(false);
    }
  };
  return { handleFollowUnfollow, updatingFollow, following };
};

export default useFollowUnfollow;
