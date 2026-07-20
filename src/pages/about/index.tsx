import * as React from "react";
import Layout from "@/components/layout";
import { Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { Oswald, Montserrat } from "@next/font/google";

const oswald = Oswald({
  weight: ["500"],
  style: ["normal"],
  subsets: ["latin"],
});

const montserrat = Montserrat({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const ACCENT = "#2563eb";

import Seo from "@/components/Seo";

export const About = () => {
  const productImages = [
    {
      src: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=392&h=432&q=70",
      alt: "engine parts",
    },
    {
      src: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=392&h=432&q=70",
      alt: "engine bay",
    },
    {
      src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=392&h=432&q=70",
      alt: "vehicle",
    },
  ];

  const stats = [
    { value: "15+", label: "Years in the trade" },
    { value: "12,000+", label: "Parts in stock" },
    { value: "40+", label: "Trusted brands" },
    { value: "98%", label: "Orders shipped same day" },
  ];

  return (
    <Layout>
      <Seo
        title='About Us'
        description='Best Qualities Industrial Equipment Nig Ltd supplies genuine vehicle parts to mechanics, fleets and DIYers across Nigeria. 15+ years in the trade, 40+ trusted brands.'
        path='/about'
      />
      <Flex
        flexDir="column"
        w="100%"
        maxW={{
          base: "100%",
          md: "450px",
          lg: "1224px",
        }}
        alignItems="center"
        className={montserrat.className}
        fontSize="16px"
        mt={{
          base: "120px",
          lg: "150px",
        }}
        mb={{
          base: "20px",
          lg: "50px",
        }}
        color="#2e2e2e"
        px={{
          base: "16px",
          lg: "0px",
        }}
      >
        <Text
          mb="20px"
          className={oswald.className}
          textTransform="uppercase"
          fontSize={{
            base: "28px",
            lg: "40px",
          }}
        >
          Parts you can trust
        </Text>
        <Text
          mb={{
            base: "50px",
            lg: "70px",
          }}
          textAlign="center"
          color="#5a5a5a"
          maxW="700px"
        >
          Best Qualities Industrial Equipment Nig Ltd began life as a
          family-run workshop. Today we supply
          thousands of genuine and OEM-quality vehicle parts to mechanics,
          fleets and home DIYers, with the same standard we always had: if we
          wouldn&apos;t fit it to our own cars, we don&apos;t sell it.
        </Text>
        <Flex
          justifyContent="space-between"
          w="100%"
          height="100%"
          flexDirection={{
            base: "column",
            lg: "row",
          }}
          mb={{
            base: "20px",
            lg: "80px",
          }}
        >
          {productImages.map((image) => (
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              height="432px"
              width={{ base: "100%", lg: "392px" }}
              objectFit="cover"
              mb={{
                base: "30px",
                lg: "0px",
              }}
            />
          ))}
        </Flex>
        <SimpleGrid
          columns={{ base: 2, lg: 4 }}
          spacing="24px"
          w="100%"
          mb={{ base: "50px", lg: "90px" }}
        >
          {stats.map((stat) => (
            <Flex
              key={stat.label}
              flexDir="column"
              alignItems="center"
              p="28px"
              border="1px solid #e8e8e8"
            >
              <Text
                className={oswald.className}
                fontSize={{ base: "28px", lg: "36px" }}
                color={ACCENT}
              >
                {stat.value}
              </Text>
              <Text fontSize="14px" color="#5a5a5a" textAlign="center">
                {stat.label}
              </Text>
            </Flex>
          ))}
        </SimpleGrid>
        <Flex
          flexDir="column"
          width={{
            base: "100%",
            lg: "806px",
          }}
        >
          <Text mb="30px">
            Our mission is simple: take the guesswork and the risk out of buying
            vehicle parts online. Every part we list is checked for fitment
            against manufacturer data before it ships, sourced directly from
            authorised distributors, and covered by a minimum 12-month
            warranty. From routine service items like filters, pads, plugs and
            oils to alternators, clutch kits and complete strut assemblies,
            we stock the parts that keep vehicles on the road.
          </Text>
          <Text mb="30px">
            The company was founded by lifelong mechanics who grew tired of
            seeing customers sold the wrong part, the cheap part, or the part
            that arrives a week late. That workshop experience shapes
            everything we do: honest advice from people who have actually
            turned a wrench, real stock levels you can rely on, and support
            that stays with you until the part is fitted and working.
          </Text>
          <Text
            mb={{
              base: "30px",
              lg: "100px",
            }}
          >
            Whether you run a professional garage, manage a fleet, or service
            your own car on the weekend, you get the same trade-level quality
            and fair pricing. If you&apos;re ever unsure which part fits your
            vehicle, send us your registration or VIN and our team will confirm
            it before you spend a cent.
          </Text>
          <Flex
            className={oswald.className}
            fontSize="22px"
            flexDir="column"
            alignItems="flex-end"
          >
            <Text>Keep them running,</Text>
            <Text>The Best Qualities Team</Text>
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default About;
