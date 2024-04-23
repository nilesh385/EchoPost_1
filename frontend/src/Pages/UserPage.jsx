import React from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

function UserPage() {
  return (
    <>
      <UserHeader />
      <UserPost
        likes={405}
        replies={907}
        postImage={"/public/post1.png"}
        postTitle={"The best post ever"}
      />
      <UserPost
        likes={67}
        replies={45}
        postImage={"/public/post2.png"}
        postTitle={"Good post"}
      />
      <UserPost
        likes={902}
        replies={987}
        postImage={"/public/post3.png"}
        postTitle={"Elon musk"}
      />
      <UserPost likes={345} replies={323} postTitle={"My first post. "} />
    </>
  );
}

export default UserPage;
