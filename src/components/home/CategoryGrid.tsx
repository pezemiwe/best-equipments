import { Box, Flex, Grid, GridItem, Icon, Image, Text, Skeleton } from "@chakra-ui/react";
import Link from "next/link";
import * as React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useCategories } from "@/hooks/categories";
import { ACCENT, DARK, Section, SectionHeading } from "./shared";

export const CategoryGrid = ({ categoryCounts }: { categoryCounts: Record<string, number> }) => {
  const { data: categories, isLoading } = useCategories();
  const wideIndexes = [0, 5, 8];

  if (isLoading) {
    return (
      <Section mt={{ base: "60px", md: "90px", lg: "110px" }}>
        <Skeleton height="300px" borderRadius="12px" />
      </Section>
    );
  }

  const items = categories || [];

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
        {items.map((type: any, index: number) => {
          const isWide = wideIndexes.includes(index);
          const count = categoryCounts[type.value] || 0;
          return (
            <GridItem
              key={type.id || type.value}
              colSpan={{
                base: index === items.length - 1 && items.length % 2 !== 0 ? 2 : 1,
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
                    src={type.image}
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
