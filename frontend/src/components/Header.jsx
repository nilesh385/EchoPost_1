import { Button, Flex, useColorMode } from "@chakra-ui/react";
import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex justifyContent="center" mt={6} mb={12}>
      <Button
        onClick={toggleColorMode}
        style={colorMode === "light" ? { background: "#aadfff" } : {}}
      >
        {colorMode === "dark" ? <MdDarkMode /> : <CiLight />}
      </Button>
    </Flex>
  );
}

export default Header;
