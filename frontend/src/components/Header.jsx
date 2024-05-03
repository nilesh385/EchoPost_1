import { Avatar, Button, Flex, useColorMode } from "@chakra-ui/react";
import { CiLight } from "react-icons/ci";
import { MdDarkMode, MdOutlineSettings } from "react-icons/md";
import { HiHome } from "react-icons/hi";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authScreenAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  return (
    <Flex
      justifyContent="space-between"
      alignItems={"center"}
      mt={6}
      mb={12}
      padding={{
        base: 5,
        lg: 10,
      }}
    >
      {user && (
        <Link to={"/"}>
          <HiHome size={30} cursor={"pointer"} />
        </Link>
      )}

      {!user && (
        <Link
          to={"/auth"}
          onClick={() => {
            setAuthScreen("login");
          }}
        >
          Log in
        </Link>
      )}
      <Button
        onClick={toggleColorMode}
        style={colorMode === "light" ? { background: "#aadfff" } : {}}
      >
        {colorMode === "dark" ? <MdDarkMode /> : <CiLight />}
      </Button>
      {user && (
        <>
          <Flex alignItems={"center"} gap={3}>
            <Link to={`/${user.username}`}>
              <Avatar
                src={user.profilePic}
                title={`${user.name}\n${user.email}`}
                size={"sm"}
              />
            </Link>
            {user && (
              <Link to={"/chat"}>
                <BsFillChatQuoteFill size={24} cursor={"pointer"} />
              </Link>
            )}
            {user && (
              <Link to={"/settings"}>
                <MdOutlineSettings size={24} cursor={"pointer"} />
              </Link>
            )}
            <Button
              size="xs"
              colorScheme="red" // Red color for logout action
              onClick={logout}
            >
              <Link to={"/"}>
                <FiLogOut size={20} />
              </Link>
            </Button>
          </Flex>
        </>
      )}
      {!user && (
        <Link
          to={"/auth"}
          onClick={() => {
            setAuthScreen("signup");
          }}
        >
          Sign up
        </Link>
      )}
    </Flex>
  );
}

export default Header;
