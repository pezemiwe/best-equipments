import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import * as React from "react";
import { FaArrowRight, FaWhatsapp } from "react-icons/fa";
import { ACCENT, Section, WHATSAPP } from "./shared";

export const HeroSection = () => (
  <Box
    position="relative"
    w="100%"
    minH={{ base: "560px", md: "620px", lg: "700px" }}
    display="flex"
    alignItems="center"
  >
    <Box
      position="absolute"
      inset="0"
      bgImage="url('https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1920&q=75')"
      bgSize="cover"
      bgPosition="center"
    />
    <Box
      position="absolute"
      inset="0"
      bgGradient={{
        base: "linear(to-b, rgba(15,23,42,0.92), rgba(15,23,42,0.86))",
        lg: "linear(to-r, rgba(15,23,42,0.96) 0%, rgba(15,23,42,0.88) 45%, rgba(15,23,42,0.55) 100%)",
      }}
    />
    <Section position="relative" zIndex="1" pt={{ base: "90px", lg: "60px" }}>
      <Flex flexDir="column" maxW={{ base: "100%", lg: "660px" }} color="white">
        <Flex alignItems="center" gap="10px" mb="18px">
          <Text
            fontSize={{ base: "11px", md: "12px" }}
            letterSpacing="3px"
            color="#93c5fd"
            fontWeight="700"
          >
            INDUSTRIAL EQUIPMENT &amp; VEHICLE PARTS
          </Text>
        </Flex>
        <Text
          fontSize={{ base: "34px", sm: "42px", md: "52px", lg: "60px" }}
          lineHeight="1.08"
          className={"font-oswald"}
          textTransform="uppercase"
          mb="20px"
        >
          The right part,
          <br />
          for the right machine,
          <Text as="span" color={ACCENT}>
            {" "}
            every time
          </Text>
        </Text>
        <Text
          fontSize={{ base: "15px", md: "17px" }}
          color="#cbd5e1"
          maxW="540px"
          lineHeight="1.75"
          mb={{ base: "28px", md: "36px" }}
        >
          From conveyor belts and bearings to excavator parts and car care
          products, we supply the components that keep Nigerian workshops,
          fleets and sites running.
        </Text>
        <Flex gap="14px" flexWrap="wrap">
          <Link href="/store">
            <Button
              h={{ base: "48px", md: "54px" }}
              px="34px"
              bg={ACCENT}
              color="white"
              borderRadius="8px"
              fontSize={{ base: "13px", md: "14px" }}
              fontWeight="700"
              letterSpacing="0.5px"
              rightIcon={<Icon as={FaArrowRight} boxSize="12px" />}
              _hover={{ bg: "#1d4ed8", transform: "translateY(-2px)" }}
              transition="all 0.2s ease"
            >
              SHOP PRODUCTS
            </Button>
          </Link>
          <Button
            as="a"
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            h={{ base: "48px", md: "54px" }}
            px="30px"
            bg="rgba(255,255,255,0.08)"
            color="white"
            border="1px solid rgba(255,255,255,0.35)"
            borderRadius="8px"
            fontSize={{ base: "13px", md: "14px" }}
            fontWeight="600"
            leftIcon={<Icon as={FaWhatsapp} boxSize="17px" />}
            _hover={{ bg: "rgba(255,255,255,0.18)" }}
            transition="all 0.2s ease"
          >
            REQUEST A QUOTE
          </Button>
        </Flex>
      </Flex>
    </Section>
  </Box>
);
