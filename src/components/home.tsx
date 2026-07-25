import * as React from "react";
import {
  Flex,
  Button,
  Icon,
  Image,
  SimpleGrid,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  FaShippingFast,
  FaShieldAlt,
  FaTools,
  FaHeadset,
  FaBolt,
} from "react-icons/fa";
import { useProducts } from "@/hooks/products";
import ProductTile from "@/components/ProductTile";
import { productTypes } from "@/utils/cart";

import { Oswald, Montserrat } from "@next/font/google";

const oswald = Oswald({
  weight: ["500", "600"],
  style: ["normal"],
  subsets: ["latin"],
});

const montserrat = Montserrat({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const ACCENT = "#2563eb";
const DARK = "#0f172a";

export const Home = () => {
  const categories = [
    {
      src: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=656&h=830&q=70",
      alt: "belts and chains",
      type: "BELTS & CHAINS",
      href: "/store?category=belts",
    },
    {
      src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=656&h=830&q=70",
      alt: "bearings and power transmission",
      type: "BEARINGS & TRANSMISSION",
      href: "/store?category=bearings",
    },
    {
      src: "https://images.unsplash.com/photo-1504328345606-18aa54129790?auto=format&fit=crop&w=656&h=830&q=70",
      alt: "excavator and drilling parts",
      type: "EXCAVATOR & DRILLING",
      href: "/store?category=excavatorDrilling",
    },
  ];

  const features = [
    {
      icon: FaShieldAlt,
      title: "Genuine Parts",
      text: "Trusted brands and quality-checked stock, sourced right.",
    },
    {
      icon: FaShippingFast,
      title: "Fast Delivery",
      text: "Same-day dispatch on in-stock orders placed before 2pm.",
    },
    {
      icon: FaTools,
      title: "Wide Range",
      text: "From conveyor belts to excavator parts, all under one roof.",
    },
    {
      icon: FaHeadset,
      title: "Expert Support",
      text: "Talk to real technicians, not call scripts, 6 days a week.",
    },
  ];

  const gallery = [
    "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=861&h=1100&q=70",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=861&h=1100&q=70",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=861&h=1100&q=70",
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=861&h=1100&q=70",
  ];

  const { data: products, isLoading: productsLoading } = useProducts();
  const flashDeals = (products || []).slice(0, 8);

  return (
    <>
      <Flex
        flexDir="column"
        w="100%"
        height="100%"
        alignItems="center"
        className={montserrat.className}
      >
        {/* Hero */}
        <Flex
          w="100%"
          height="607px"
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          mb="90px"
          color="#ffffff"
          bgImage="linear-gradient(rgba(20, 22, 26, 0.75), rgba(20, 22, 26, 0.75)), url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1920&q=70')"
          bgSize="cover"
          bgRepeat="no-repeat"
          px={{ base: "16px", lg: "0px" }}
          bgPosition="center"
        >
          <Flex
            flexDir="column"
            w="100%"
            maxW={{ base: "100%", md: "450px", lg: "1224px" }}
            mt="120px"
          >
            <Text
              fontSize="14px"
              letterSpacing="4px"
              color={ACCENT}
              fontWeight="bold"
              mb="16px"
            >
              INDUSTRIAL EQUIPMENT & VEHICLE PARTS
            </Text>
            <Text
              fontSize={{ base: "36px", lg: "56px" }}
              lineHeight="1.15"
              mb="24px"
              className={oswald.className}
              textTransform="uppercase"
              maxW={{ base: "100%", lg: "640px" }}
            >
              The right part, for the right machine, every time
            </Text>
            <Text
              mb={{ base: "25px", lg: "45px" }}
              maxW={{ base: "100%", lg: "501px" }}
              color="#e8e8e8"
            >
              From conveyor belts and bearings to excavator parts and car
              care products, we stock thousands of quality industrial
              supplies, backed by expert advice and fast nationwide delivery.
            </Text>
            <Flex gap="16px" flexWrap="wrap">
              <Link href="/store">
                <Button
                  width="170px"
                  height="51px"
                  bg={ACCENT}
                  color="#ffffff"
                  borderRadius="6px"
                  fontSize="14px"
                  fontWeight="bold"
                  _hover={{ opacity: 0.85 }}
                >
                  SHOP NOW
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  width="170px"
                  height="51px"
                  bg="transparent"
                  color="#ffffff"
                  border="1px solid #ffffff"
                  borderRadius="6px"
                  fontSize="14px"
                  _hover={{ bg: "rgba(255,255,255,0.12)" }}
                >
                  ASK AN EXPERT
                </Button>
              </Link>
            </Flex>
          </Flex>
        </Flex>

        <Flex
          flexDir="column"
          w="100%"
          maxW={{ base: "100%", md: "450px", lg: "1224px" }}
          px={{ base: "16px", lg: "0px" }}
        >
          {/* Feature bar */}
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 4 }}
            spacing="24px"
            w="100%"
            mb={{ base: "70px", lg: "120px" }}
          >
            {features.map((feature) => (
              <Flex
                key={feature.title}
                flexDir="column"
                p="28px"
                border="1px solid #e8e8e8"
                _hover={{ borderColor: ACCENT, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                transition="all 0.25s ease"
              >
                <Icon as={feature.icon} boxSize="32px" color={ACCENT} mb="16px" />
                <Text
                  className={oswald.className}
                  fontSize="18px"
                  textTransform="uppercase"
                  mb="8px"
                >
                  {feature.title}
                </Text>
                <Text fontSize="14px" color="#5a5a5a">
                  {feature.text}
                </Text>
              </Flex>
            ))}
          </SimpleGrid>

          {/* Category chips */}
          <Flex
            w="100%"
            gap="10px"
            flexWrap="wrap"
            justifyContent="center"
            mb={{ base: "60px", lg: "90px" }}
          >
            {productTypes.map((type: any) => (
              <Link href={`/store?category=${type.value}`} key={type.value}>
                <Button
                  size="sm"
                  bg="white"
                  color="#3a3a3a"
                  border="1px solid #e4e5e7"
                  borderRadius="full"
                  px="18px"
                  fontWeight="500"
                  _hover={{ bg: ACCENT, color: "white", borderColor: ACCENT }}
                >
                  {type.name}
                </Button>
              </Link>
            ))}
          </Flex>

          {/* Flash sales */}
          <Flex
            flexDir="column"
            w="100%"
            mb={{ base: "70px", lg: "120px" }}
            borderRadius="10px"
            overflow="hidden"
            border="1px solid #f0f0f0"
            boxShadow="0 2px 12px rgba(0,0,0,0.05)"
          >
            <Flex
              bg={ACCENT}
              color="white"
              px="20px"
              py="12px"
              alignItems="center"
              justifyContent="space-between"
            >
              <Flex alignItems="center" gap="8px">
                <Icon as={FaBolt} />
                <Text
                  className={oswald.className}
                  fontSize="18px"
                  textTransform="uppercase"
                >
                  Flash Sales
                </Text>
              </Flex>
              <Link href="/store">
                <Text
                  fontSize="13px"
                  fontWeight="bold"
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                >
                  SEE ALL →
                </Text>
              </Link>
            </Flex>
            <SimpleGrid
              columns={{ base: 2, md: 3, lg: 4 }}
              spacing="12px"
              p="14px"
              bg="#fafafa"
            >
              {productsLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} h="300px" borderRadius="8px" />
                  ))
                : flashDeals.map((item: any) => (
                    <ProductTile item={item} key={item.id} />
                  ))}
            </SimpleGrid>
          </Flex>

          {/* Categories */}
          <Flex flexDir="column" w="100%">
            <Flex flexDir="column" w="100%" alignItems="center">
              <Text
                className={oswald.className}
                mb="20px"
                fontSize={{ base: "28px", lg: "40px" }}
                textAlign="center"
                textTransform="uppercase"
                color={DARK}
              >
                Shop by category
              </Text>
              <Text
                textAlign="center"
                mb="45px"
                fontSize="16px"
                color="#5a5a5a"
                width={{ base: "100%", lg: "537px" }}
              >
                From power transmission to heavy equipment parts, find what
                keeps your machines and vehicles running, all in one place.
              </Text>
            </Flex>
            <Flex
              flexDirection={{ base: "column", lg: "row" }}
              alignItems="center"
              justifyContent="space-between"
              w="100%"
              mb={{ base: "0px", lg: "200px" }}
              h="100%"
            >
              {categories.map((category) => (
                <Flex
                  key={category.src}
                  position="relative"
                  width={{ base: "100%", lg: "380px" }}
                  flexDirection={{ base: "column", lg: "row" }}
                  alignItems={{ base: "center", lg: "none" }}
                >
                  <Image
                    src={category.src}
                    alt={category.alt}
                    height="496px"
                    objectFit="cover"
                    width={{ base: "100%", lg: "380px" }}
                  />
                  <Link href={category.href}>
                    <Button
                      height="51px"
                      bg={DARK}
                      color="#ffffff"
                      borderRadius="6px"
                      fontSize="13px"
                      fontWeight="bold"
                      minWidth="134px"
                      maxWidth="240px"
                      px="20px"
                      position={{ base: "static", lg: "absolute" }}
                      left={{ base: "0px", lg: "50%" }}
                      transform={{ base: "none", lg: "translate(-50%, -50%)" }}
                      bottom={{ base: "0px", lg: "-55px" }}
                      _hover={{ bg: ACCENT }}
                      mt={{ base: "25px", lg: "0px" }}
                      mb={{ base: "35px", lg: "0px" }}
                    >
                      {category.type}
                    </Button>
                  </Link>
                </Flex>
              ))}
            </Flex>
          </Flex>

          {/* Story */}
          <Flex
            w="100%"
            mb={{ base: "60px", lg: "200px" }}
            color={DARK}
            justifyContent="space-between"
            flexDir={{ base: "column", lg: "row" }}
          >
            <Flex flexDir="column">
              <Text
                fontSize="14px"
                my="32px"
                letterSpacing="4px"
                color={ACCENT}
                fontWeight="bold"
              >
                WHY BEST QUALITIES
              </Text>
              <Text
                fontSize={{ base: "28px", lg: "40px" }}
                mb="32px"
                width={{ base: "100%", lg: "433.3px" }}
                className={oswald.className}
                textTransform="uppercase"
              >
                Built by people who work with machines
              </Text>
              <Text mb="45px" width={{ base: "100%", lg: "489px" }} color="#5a5a5a">
                We started on the workshop floor, so we know how much a wrong
                part or a late delivery costs you. That&apos;s why every order
                is quality-checked before it ships, and every part is backed
                by a minimum 12-month warranty. Whether you run a fleet, a
                workshop or a construction site, you get trade-level quality
                at fair prices.
              </Text>
              <Link href="/about">
                <Button
                  width="169px"
                  height="51px"
                  bg={DARK}
                  color="#ffffff"
                  borderRadius="6px"
                  fontSize="14px"
                  mb={{ base: "45px", lg: "0px" }}
                  _hover={{ bg: ACCENT }}
                >
                  OUR STORY
                </Button>
              </Link>
            </Flex>
            <Flex>
              <Image
                src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=861&h=972&q=70"
                alt="engine workshop"
                objectFit="cover"
                height={{ base: "431px", lg: "560px" }}
                width={{ base: "100%", lg: "496px" }}
              />
            </Flex>
          </Flex>

          {/* Gallery */}
          <Flex
            w="100%"
            flexDir="column"
            alignItems="center"
            mb={{ base: "20px", lg: "100px" }}
          >
            <Text
              fontSize={{ base: "28px", lg: "40px" }}
              mb="32px"
              className={oswald.className}
              textAlign="center"
              textTransform="uppercase"
              color={DARK}
            >
              Trusted brands. Proven parts.
            </Text>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              w="100%"
              flexDir={{ base: "column", lg: "row" }}
            >
              {gallery.map((src) => (
                <Image
                  src={src}
                  alt="vehicle parts gallery"
                  key={src}
                  objectFit="cover"
                  height={{ base: "469px", md: "488px", lg: "388px" }}
                  width={{ base: "100%", lg: "288px" }}
                  mb={{ base: "30px", lg: "0px" }}
                />
              ))}
            </Flex>
            <Link href="/store">
              <Button
                width={{ base: "181px", md: "215px" }}
                height="51px"
                bg={ACCENT}
                color="#ffffff"
                borderRadius="6px"
                fontSize="14px"
                fontWeight="bold"
                mt={{ base: "20px", lg: "40px" }}
                _hover={{ opacity: 0.85 }}
              >
                BROWSE ALL PARTS
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
