import { Flex, Text } from "@chakra-ui/react";
import * as React from "react";

export const ACCENT = "#2563eb";
export const DARK = "#0f172a";
export const WHATSAPP = "https://wa.me/2348162309761";

export const Section = ({ children, ...rest }: any) => (
  <Flex
    w="100%"
    justifyContent="center"
    px={{ base: "16px", md: "24px", lg: "32px" }}
    {...rest}
  >
    <Flex flexDir="column" w="100%" maxW="1280px">
      {children}
    </Flex>
  </Flex>
);

export const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) => (
  <Flex
    flexDir="column"
    alignItems={align === "center" ? "center" : "flex-start"}
    textAlign={align === "center" ? "center" : "left"}
    mb={{ base: "28px", md: "40px" }}
  >
    {eyebrow && (
      <Text
        fontSize={{ base: "11px", md: "12px" }}
        letterSpacing="3px"
        color={ACCENT}
        fontWeight="700"
        mb="10px"
      >
        {eyebrow}
      </Text>
    )}
    <Text
      className={"font-oswald"}
      fontSize={{ base: "26px", md: "34px", lg: "40px" }}
      lineHeight="1.15"
      textTransform="uppercase"
      color={DARK}
    >
      {title}
    </Text>
    {subtitle && (
      <Text
        mt="14px"
        fontSize={{ base: "14px", md: "16px" }}
        color="#64748b"
        maxW="620px"
        lineHeight="1.7"
      >
        {subtitle}
      </Text>
    )}
  </Flex>
);
