import * as React from "react";
import Layout from "@/components/layout";
import { Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";






const ACCENT = "#2563eb";

import Seo from "@/components/Seo";

export const About = () => {
  const productImages = [
    {
      src: "https://images.unsplash.com/photo-1610891015188-5369212db097?auto=format&fit=crop&w=392&h=432&q=70",
      alt: "industrial machinery and belts",
    },
    {
      src: "https://images.unsplash.com/photo-1776671236324-d9b94d727f25?auto=format&fit=crop&w=392&h=432&q=70",
      alt: "mechanical components in stock",
    },
    {
      src: "https://images.unsplash.com/photo-1628645419184-26a1f2757340?auto=format&fit=crop&w=392&h=432&q=70",
      alt: "heavy equipment on site",
    },
  ];

  return (
    <Layout>
      <Seo
        title='About Us'
        description='Best Qualities Industrial Equipment Nig Ltd supplies belts, bearings, seals, excavator parts and vehicle parts across Nigeria.'
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
        className={"font-montserrat"}
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
          className={"font-oswald"}
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
          family-run workshop. Today we supply thousands of belts, bearings,
          seals, heavy equipment parts and vehicle parts to workshops, fleets
          and construction sites across Nigeria, with the same standard we
          always had: if we wouldn&apos;t use it ourselves, we don&apos;t
          sell it.
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
        <Flex
          flexDir="column"
          width={{
            base: "100%",
            lg: "806px",
          }}
        >
          <Text mb="30px">
            Our mission is simple: take the guesswork and the risk out of
            buying industrial equipment and vehicle parts online. Every
            product we list is quality-checked before it ships, and sourced
            directly from trusted suppliers. From belts, chains and bearings to excavator
            buckets, hydraulic seals and car care products, we stock what
            keeps your machines and vehicles running.
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
            Whether you run a workshop, manage a fleet, or operate heavy
            machinery on a construction site, you get the same trade-level
            quality and fair pricing. If you&apos;re ever unsure which part
            you need, send us the details and our team will confirm it before
            you spend a cent.
          </Text>
          <Flex
            className={"font-oswald"}
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
