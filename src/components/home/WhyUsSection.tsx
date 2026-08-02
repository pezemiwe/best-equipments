import { Box, Button, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import Link from "next/link";
import * as React from "react";
import { ACCENT, DARK, Section, SectionHeading } from "./shared";

const stats = [
  { value: "15+", label: "Years in the trade" },
  { value: "40+", label: "Trusted brands" },
  { value: "2,000+", label: "Products supplied" },
  { value: "24hr", label: "Quote turnaround" },
];

export const WhyUsSection = () => (
  <Section mt={{ base: "60px", md: "90px", lg: "110px" }}>
    <Flex
      flexDir={{ base: "column", lg: "row" }}
      gap={{ base: "30px", lg: "60px" }}
      alignItems="stretch"
    >
      <Box flex="1" position="relative" minH={{ base: "260px", md: "380px" }}>
        <Image
          src="https://images.unsplash.com/photo-1676018366904-c083ed678e60?auto=format&fit=crop&w=1000&q=75"
          alt="Technician working on industrial machinery"
          w="100%"
          h="100%"
          minH={{ base: "260px", md: "380px" }}
          objectFit="cover"
          borderRadius="14px"
          loading="lazy"
          decoding="async"
        />
        <Flex
          display={{ base: "none", md: "flex" }}
          position="absolute"
          bottom="-24px"
          right="-16px"
          bg={ACCENT}
          color="white"
          borderRadius="12px"
          px="26px"
          py="20px"
          flexDir="column"
          boxShadow="0 12px 30px rgba(37,99,235,0.35)"
        >
          <Text className={"font-oswald"} fontSize="30px" lineHeight="1">
            15+
          </Text>
          <Text fontSize="12px" letterSpacing="1px" mt="4px">
            YEARS IN THE TRADE
          </Text>
        </Flex>
      </Box>

      <Flex flex="1" flexDir="column" justifyContent="center">
        <SectionHeading
          align="left"
          eyebrow="WHY BEST QUALITIES"
          title="Built by people who work with machines"
          subtitle="We started on the workshop floor, so we know how much a wrong part or a late delivery costs you. That's why every order is quality-checked before it ships. Whether you run a fleet, a workshop or a construction site, you get trade-level quality at fair prices."
        />
        <SimpleGrid columns={2} spacing="16px" mb="30px">
          {stats.map((stat) => (
            <Flex
              key={stat.label}
              flexDir="column"
              borderLeft="3px solid"
              borderColor="#e2e8f0"
              pl="16px"
            >
              <Text
                className={"font-oswald"}
                fontSize={{ base: "24px", md: "30px" }}
                color={DARK}
                lineHeight="1.1"
              >
                {stat.value}
              </Text>
              <Text fontSize="13px" color="#64748b">
                {stat.label}
              </Text>
            </Flex>
          ))}
        </SimpleGrid>
        <Flex gap="12px" flexWrap="wrap">
          <Link href="/about">
            <Button
              h="50px"
              px="30px"
              bg={DARK}
              color="white"
              borderRadius="8px"
              fontSize="13px"
              fontWeight="700"
              _hover={{ bg: ACCENT }}
            >
              OUR STORY
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              h="50px"
              px="30px"
              variant="outline"
              borderColor="#cbd5e1"
              color={DARK}
              borderRadius="8px"
              fontSize="13px"
              fontWeight="600"
              _hover={{ borderColor: DARK }}
            >
              CONTACT US
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  </Section>
);
