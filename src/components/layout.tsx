import * as React from "react";
import { Box, Flex } from "@chakra-ui/react";
import Navbar from "./navbar";
import Footer from "./footer";

import { useEventListener } from "usehooks-ts";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [navChange, setNavchange] = React.useState(false);
  const handleScroll = () => {
    if (window.scrollY > 0) {
      setNavchange(true);
    } else {
      setNavchange(false);
    }
  };

  useEventListener("scroll", handleScroll);
  return (
    <Flex
      flexDir="column"
      alignItems="center"
      justifyContent="space-between"
      w="100%"
      minH="100vh"
      height="100%"
      overflow="auto"
    >
      <Navbar navChange={navChange} />
      <Box as="main" w="100%" flex="1">
        {children}
      </Box>
      <Footer />
    </Flex>
  );
};

export default Layout;
