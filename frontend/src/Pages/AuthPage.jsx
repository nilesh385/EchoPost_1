import { useRecoilValue } from "recoil";
import LoginCard from "../components/LoginCard.1";
import SignupCard from "../components/SignupCard/";
import authScreenAtom from "../atoms/authAtom";

function AuthPage() {
  const authScreenState = useRecoilValue(authScreenAtom);

  //   console.log(authScreenState);
  // useSetRecoilState(authScreenState)

  return <>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</>;
}

export default AuthPage;
