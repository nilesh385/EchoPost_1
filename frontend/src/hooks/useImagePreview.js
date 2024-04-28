import { useState } from "react";
import useShowToast from "./useShowToast";

function useImagePreview() {
  const [imgUrl, setImgUrl] = useState(null);
  const showToast = useShowToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // console.log(file);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImgUrl(reader.result);
      };
    } else {
      showToast("Invalid file type", "Please select an image file", "error");
      setImgUrl(null);
    }
  };
  return { imgUrl, setImgUrl, handleImageChange };
}

export default useImagePreview;
