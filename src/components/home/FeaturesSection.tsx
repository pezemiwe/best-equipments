import { Flex, Icon, SimpleGrid, Text } from "@chakra-ui/react";
import * as React from "react";
import { FaHeadset, FaShieldAlt, FaShippingFast, FaTools } from "react-icons/fa";
import { ACCENT, DARK, Section } from "./shared";

const features = [
  {
    icon: FaShieldAlt,
    title: "Genuine Products",
    text: "Trusted brands, quality-checked before every dispatch.",
  },
  {
    icon: FaShippingFast,
    title: "Nationwide Delivery",
    text: "Fast dispatch to workshops and sites across Nigeria.",
  },
  {
    icon: FaTools,
    title: "Wide Range",
    text: "Belts, bearings, seals, heavy equipment parts and more.",
  },
  {
    icon: FaHeadset,
    title: "Expert Support",
    text: "Real technicians on hand to help you find the right part.",
  },
];

export const FeaturesSection = () => (
  <Section mt={{ base: "32px", md: "-56px" }} zIndex="2" position="relative">
    <SimpleGrid
      columns={{ base: 1, sm: 2, lg: 4 }}
      spacing={{ base: "12px", md: "18px" }}
      w="100%"
    >
      {features.map((feature) => (
        <Flex
          key={feature.title}
          flexDir="column"
          bg="white"
          p={{ base: "20px", md: "26px" }}
          borderRadius="12px"
          border="1px solid #e2e8f0"
          boxShadow="0 4px 20px rgba(15,23,42,0.06)"
          _hover={{
            boxShadow: "0 12px 30px rgba(15,23,42,0.12)",
            transform: "translateY(-4px)",
            borderColor: "#bfdbfe",
          }}
          transition="all 0.25s ease"
        >
          <Flex
            alignItems="center"
            justifyContent="center"
            boxSize="44px"
            borderRadius="10px"
            bg="#eff6ff"
            mb="16px"
          >
            <Icon as={feature.icon} boxSize="20px" color={ACCENT} />
          </Flex>
          <Text
            className={"font-oswald"}
            fontSize={{ base: "16px", md: "17px" }}
            textTransform="uppercase"
            color={DARK}
            mb="6px"
          >
            {feature.title}
          </Text>
          <Text fontSize="13.5px" color="#64748b" lineHeight="1.6">
            {feature.text}
          </Text>
        </Flex>
      ))}
    </SimpleGrid>
  </Section>
);
