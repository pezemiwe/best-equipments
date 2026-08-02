import { Box, Flex, Grid, GridItem, Icon, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import * as React from "react";
import { FaArrowRight } from "react-icons/fa";
import { productTypes } from "@/utils/cart";
import { ACCENT, DARK, Section, SectionHeading } from "./shared";

const categoryImages: Record<string, string> = {
  belts:
    "https://images.unsplash.com/photo-1610891015188-5369212db097?auto=format&fit=crop&w=900&q=70",
  chainsSprockets:
    "https://images.unsplash.com/photo-1488272690691-2636704d6000?auto=format&fit=crop&w=900&q=70",
  powerTransmission:
    "https://images.unsplash.com/photo-1567093322102-6bdd32fba67d?auto=format&fit=crop&w=900&q=70",
  bearings:
    "https://images.unsplash.com/photo-1776671236324-d9b94d727f25?auto=format&fit=crop&w=900&q=70",
  sealsGaskets:
    "https://images.unsplash.com/photo-1699466622736-36c7b7893745?auto=format&fit=crop&w=900&q=70",
  excavatorDrilling:
    "https://images.unsplash.com/photo-1628645419184-26a1f2757340?auto=format&fit=crop&w=900&q=70",
  fastenersAdhesives:
    "https://images.unsplash.com/photo-1564226591723-659ff3852b2a?auto=format&fit=crop&w=900&q=70",
  industrialSupplies:
    "https://images.unsplash.com/photo-1567016958860-87d898933af1?auto=format&fit=crop&w=900&q=70",
  carCare:
    "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=900&q=70",
};

export const CategoryGrid = ({ categoryCounts }: { categoryCounts: Record<string, number> }) => {
  const wideIndexes = [0, 5, 8];

  return (
    <Section mt={{ base: "60px", md: "90px", lg: "110px" }}>
      <SectionHeading
        eyebrow="BROWSE OUR RANGE"
        title="Shop by category"
        subtitle="From power transmission to heavy equipment parts, find what keeps your machines and vehicles running, all in one place."
      />
      <Grid
        templateColumns={{
          base: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={{ base: "10px", md: "16px" }}
        w="100%"
      >
        {productTypes.map((type: any, index: number) => {
          const isWide = wideIndexes.includes(index);
          const count = categoryCounts[type.value];
          return (
            <GridItem
              key={type.value}
              colSpan={{
                base: index === productTypes.length - 1 ? 2 : 1,
                md: 1,
                lg: isWide ? 2 : 1,
              }}
            >
              <Link href={`/store?category=${type.value}`}>
                <Box
                  position="relative"
                  h={{ base: "150px", md: "190px", lg: "220px" }}
                  borderRadius="12px"
                  overflow="hidden"
                  cursor="pointer"
                  role="group"
                  bg={DARK}
                >
                  <Image
                    src={categoryImages[type.value]}
                    alt={type.name}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    opacity="0.62"
                    transition="transform 0.5s ease, opacity 0.3s ease"
                    _groupHover={{ transform: "scale(1.07)", opacity: "0.5" }}
                    loading="lazy"
                    decoding="async"
                  />
                  <Box
                    position="absolute"
                    inset="0"
                    bgGradient="linear(to-t, rgba(15,23,42,0.92) 5%, rgba(15,23,42,0.15) 70%)"
                  />
                  <Flex
                    position="absolute"
                    inset="0"
                    flexDir="column"
                    justifyContent="flex-end"
                    p={{ base: "14px", md: "18px" }}
                    color="white"
                  >
                    <Text
                      className={"font-oswald"}
                      fontSize={{ base: "14px", md: "18px", lg: "20px" }}
                      textTransform="uppercase"
                      lineHeight="1.2"
                    >
                      {type.name}
                    </Text>
                    <Flex alignItems="center" gap="6px" mt="4px">
                      <Text fontSize="12px" color="#cbd5e1">
                        {count ? `${count} product${count === 1 ? "" : "s"}` : "View range"}
                      </Text>
                      <Icon
                        as={FaArrowRight}
                        boxSize="10px"
                        color={ACCENT}
                        opacity="0"
                        transform="translateX(-6px)"
                        transition="all 0.25s ease"
                        _groupHover={{ opacity: 1, transform: "translateX(0)" }}
                      />
                    </Flex>
                  </Flex>
                </Box>
              </Link>
            </GridItem>
          );
        })}
      </Grid>
    </Section>
  );
};
