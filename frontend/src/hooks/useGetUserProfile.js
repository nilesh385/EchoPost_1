import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

function useGetUserProfile() {
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          console.log("bro error", data.error);
          setUser(null);
          return;
        }
        if (data.isFrozen) {
          setUser(null);
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error, "error");
        console.log("Error in hook", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [showToast, username]);
  return { isLoading, user };
}

export default useGetUserProfile;
