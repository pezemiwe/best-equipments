import * as React from "react";
import {
  Box,
  Flex,
  Button,
  Grid,
  GridItem,
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
  FaArrowRight,
  FaWhatsapp,
} from "react-icons/fa";
import { useProducts } from "@/hooks/products";
import ProductTile from "@/components/ProductTile";
import { productTypes } from "@/utils/cart";







const ACCENT = "#2563eb";
const DARK = "#0f172a";
const WHATSAPP = "https://wa.me/2348162309761";

// Shell keeps every section on the same max width and gutters.
const Section = ({ children, ...rest }: any) => (
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

const SectionHeading = ({
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

export const Home = () => {
  const { data: products, isLoading: productsLoading } = useProducts();

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

  // Wide tiles at these positions create the bento rhythm on desktop.
  const wideIndexes = [0, 5, 8];

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of products || []) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [products]);

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

  const stats = [
    { value: "15+", label: "Years in the trade" },
    { value: "40+", label: "Trusted brands" },
    { value: "2,000+", label: "Products supplied" },
    { value: "24hr", label: "Quote turnaround" },
  ];

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

  const featured = (products || []).slice(0, 8);

  return (
    <Flex
      flexDir="column"
      w="100%"
      alignItems="center"
      className={"font-montserrat"}
      overflowX="hidden"
    >
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
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

      {/* ---------------------------------------------------------------- */}
      {/* Feature cards (overlap the hero for depth)                        */}
      {/* ---------------------------------------------------------------- */}
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

      {/* ---------------------------------------------------------------- */}
      {/* Category bento grid                                               */}
      {/* ---------------------------------------------------------------- */}
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

      {/* ---------------------------------------------------------------- */}
      {/* Featured products                                                 */}
      {/* ---------------------------------------------------------------- */}
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

      {/* ---------------------------------------------------------------- */}
      {/* Why us + stats                                                    */}
      {/* ---------------------------------------------------------------- */}
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

      {/* ---------------------------------------------------------------- */}
      {/* Brand strip                                                       */}
      {/* ---------------------------------------------------------------- */}
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

      {/* ---------------------------------------------------------------- */}
      {/* Closing CTA                                                       */}
      {/* ---------------------------------------------------------------- */}
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
    </Flex>
  );
};

export default Home;
