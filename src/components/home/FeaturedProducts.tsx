import { Button, Flex, Icon, SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
import Link from "next/link";
import * as React from "react";
import { FaArrowRight } from "react-icons/fa";
import ProductTile from "@/components/ProductTile";
import { ACCENT, DARK, Section } from "./shared";

export const FeaturedProducts = ({
  productsLoading,
  featured,
}: {
  productsLoading: boolean;
  featured: any[];
}) => (
  <Section mt={{ base: "60px", md: "90px", lg: "110px" }}>
    <Flex
      justifyContent="space-between"
      alignItems={{ base: "flex-start", sm: "flex-end" }}
      flexDir={{ base: "column", sm: "row" }}
      gap="14px"
      mb={{ base: "24px", md: "34px" }}
    >
      <Flex flexDir="column">
        <Text
          fontSize={{ base: "11px", md: "12px" }}
          letterSpacing="3px"
          color={ACCENT}
          fontWeight="700"
          mb="10px"
        >
          IN STOCK NOW
        </Text>
        <Text
          className={"font-oswald"}
          fontSize={{ base: "26px", md: "34px", lg: "40px" }}
          textTransform="uppercase"
          lineHeight="1.15"
          color={DARK}
        >
          Featured products
        </Text>
      </Flex>
      <Link href="/store">
        <Button
          variant="outline"
          borderColor="#cbd5e1"
          color={DARK}
          borderRadius="8px"
          h="44px"
          px="22px"
          fontSize="13px"
          fontWeight="600"
          rightIcon={<Icon as={FaArrowRight} boxSize="11px" />}
          _hover={{ bg: DARK, color: "white", borderColor: DARK }}
        >
          VIEW ALL
        </Button>
      </Link>
    </Flex>
    <SimpleGrid
      columns={{ base: 2, md: 3, lg: 4 }}
      spacing={{ base: "10px", md: "16px" }}
    >
      {productsLoading
        ? Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} h="300px" borderRadius="12px" />
          ))
        : featured.map((item: any) => (
            <ProductTile item={item} key={item.id} />
          ))}
    </SimpleGrid>
  </Section>
);
