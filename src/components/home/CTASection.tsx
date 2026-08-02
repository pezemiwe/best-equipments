import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import * as React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { DARK, Section, WHATSAPP } from "./shared";

const brands = [
  "BOSCH",
  "SKF",
  "GATES",
  "FENNER",
  "CATERPILLAR",
  "JOHN CRANE",
  "MOOG",
  "TOTAL",
];

export const CTASection = () => (
  <>
    {/* Brand strip */}
    <Section mt={{ base: "60px", md: "90px", lg: "110px" }}>
      <Flex
        flexDir="column"
        alignItems="center"
        bg="#f8fafc"
        border="1px solid #e2e8f0"
        borderRadius="14px"
        py={{ base: "26px", md: "34px" }}
        px={{ base: "16px", md: "30px" }}
      >
        <Text
          fontSize="11px"
          letterSpacing="3px"
          color="#94a3b8"
          fontWeight="700"
          mb="22px"
          textAlign="center"
        >
          BRANDS WE STOCK
        </Text>
        <Flex
          wrap="wrap"
          justifyContent="center"
          alignItems="center"
          gap={{ base: "18px", md: "40px" }}
        >
          {brands.map((brand) => (
            <Text
              key={brand}
              className={"font-oswald"}
              fontSize={{ base: "15px", md: "20px" }}
              color="#94a3b8"
              letterSpacing="1px"
              _hover={{ color: DARK }}
              transition="color 0.2s ease"
            >
              {brand}
            </Text>
          ))}
        </Flex>
      </Flex>
    </Section>

    {/* Closing CTA */}
    <Section
      mt={{ base: "60px", md: "90px", lg: "110px" }}
      mb={{ base: "60px", md: "90px", lg: "110px" }}
    >
      <Box
        position="relative"
        borderRadius="16px"
        overflow="hidden"
        bg={DARK}
      >
        <Box
          position="absolute"
          inset="0"
          bgImage="url('https://images.unsplash.com/photo-1583024011792-b165975b52f5?auto=format&fit=crop&w=1600&q=70')"
          bgSize="cover"
          bgPosition="center"
          opacity="0.28"
        />
        <Flex
          position="relative"
          flexDir={{ base: "column", md: "row" }}
          alignItems={{ base: "flex-start", md: "center" }}
          justifyContent="space-between"
          gap="24px"
          px={{ base: "24px", md: "48px" }}
          py={{ base: "36px", md: "52px" }}
          color="white"
        >
          <Flex flexDir="column" maxW="620px">
            <Text
              className={"font-oswald"}
              fontSize={{ base: "24px", md: "32px" }}
              textTransform="uppercase"
              lineHeight="1.2"
              mb="10px"
            >
              Can&apos;t find the part you need?
            </Text>
            <Text fontSize={{ base: "14px", md: "15px" }} color="#cbd5e1" lineHeight="1.7">
              Send us the details of your machine or vehicle and our team will
              source it, confirm the price, and get it moving. Most quotes
              within 24 hours.
            </Text>
          </Flex>
          <Button
            as="a"
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            flexShrink={0}
            h={{ base: "50px", md: "56px" }}
            px="32px"
            bg="#25D366"
            color="white"
            borderRadius="8px"
            fontSize={{ base: "13px", md: "14px" }}
            fontWeight="700"
            leftIcon={<Icon as={FaWhatsapp} boxSize="19px" />}
            _hover={{ opacity: 0.9, transform: "translateY(-2px)" }}
            transition="all 0.2s ease"
          >
            CHAT ON WHATSAPP
          </Button>
        </Flex>
      </Box>
    </Section>
  </>
);
