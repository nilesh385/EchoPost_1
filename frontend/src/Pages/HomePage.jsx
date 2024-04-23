import { Button, Flex, useColorMode } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function HomePage() {
  const { colorMode } = useColorMode();
  return (
    <Link to={"/markzukerberg"}>
      <Flex w={"full"} justifyContent={"center"}>
        <Button mx={"auto"} bg={colorMode === "light" ? "" : "gray.light"}>
          Visit Profile Page
        </Button>
      </Flex>
    </Link>
  );
}

export default HomePage;
