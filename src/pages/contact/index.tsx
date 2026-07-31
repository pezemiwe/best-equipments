import Layout from "@/components/layout";
import { useForm } from "react-hook-form";
import {
  Flex,
  Image,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import * as React from "react";






const ACCENT = "#2563eb";

import Seo from "@/components/Seo";

export const Contact = () => {
  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    toast({
      title: "Message sent",
      description: "Our parts team will get back to you within one business day.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    reset();
  };
  return (
    <Layout>
      <Seo
        title='Contact Us - Find the Right Part'
        description='Tell us the part or equipment you need and we will confirm availability and price before you order. Free expert advice.'
        path='/contact'
      />
      <Flex
        mt={{
          base: "110px",
          lg: "85px",
        }}
        h="100%"
        w="100%"
        maxW={{
          base: "100%",
          md: "450px",
          lg: "1224px",
        }}
        justifyContent="space-between"
        className={"font-montserrat"}
        fontSize="16px"
        color="#2e2e2e"
        flexDir={{
          base: "column-reverse",
          lg: "row",
        }}
        px={{
          base: "16px",
          lg: "0px",
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=656&h=956&q=70"
          alt="vehicle workshop"
          objectFit="cover"
          width={{
            base: "100%",
            lg: "600px",
          }}
          height={{
            base: "500px",
            lg: "874px",
          }}
          mt={{
            base: "40px",
            lg: "0px",
          }}
          mb={{
            base: "50px",
            lg: "0px",
          }}
        />
        <Flex
          h={{
            base: "auto",
            lg: "874px",
          }}
          flexDir="column"
          justifyContent="center"
        >
          <Text
            className={"font-oswald"}
            textTransform="uppercase"
            fontSize={{
              base: "32px",
              lg: "44px",
            }}
            mb="15px"
          >
            Need help finding a part?
          </Text>
          <Text mb="30px" color="#5a5a5a" maxW="496px">
            Send us the part or equipment you&apos;re looking for, along with
            your vehicle or machine details, and our team will confirm
            availability and price before you order.
          </Text>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl mb="15px" isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">Name*</FormLabel>
              <Input
                id="name"
                placeholder="Your name"
                border="none"
                width={{
                  base: "100%",
                  lg: "496px",
                }}
                height="48px"
                borderRadius="0"
                bg="#f1f1f1"
                {...register("name", {
                  required: "This is required",
                  minLength: {
                    value: 2,
                    message: "Minimum length should be 2",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.name?.message as string}
              </FormErrorMessage>
            </FormControl>
            <FormControl mb="15px" isInvalid={!!errors.email}>
              <FormLabel htmlFor="email">Your email*</FormLabel>
              <Input
                id="email"
                placeholder="Your email address"
                border="none"
                width={{
                  base: "100%",
                  lg: "496px",
                }}
                height="48px"
                borderRadius="0"
                bg="#f1f1f1"
                {...register("email", {
                  required: "This is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.email?.message as string}
              </FormErrorMessage>
            </FormControl>
            <FormControl mb="15px">
              <FormLabel htmlFor="vehicle">Vehicle or equipment (optional)</FormLabel>
              <Input
                id="vehicle"
                placeholder="e.g. Toyota Corolla 2018, or CAT excavator model"
                border="none"
                width={{
                  base: "100%",
                  lg: "496px",
                }}
                height="48px"
                borderRadius="0"
                bg="#f1f1f1"
                {...register("vehicle")}
              />
            </FormControl>
            <FormControl mb="15px" isInvalid={!!errors.message}>
              <FormLabel htmlFor="message">Message*</FormLabel>
              <Textarea
                id="message"
                placeholder="Which part do you need? Any part numbers or symptoms help too."
                border="none"
                width={{
                  base: "100%",
                  lg: "496px",
                }}
                height="120px"
                borderRadius="0"
                bg="#f1f1f1"
                {...register("message", {
                  required: "This is required",
                })}
              />
              <FormErrorMessage>
                {errors.message?.message as string}
              </FormErrorMessage>
            </FormControl>
            <Button
              type="submit"
              isLoading={isSubmitting}
              width="143px"
              height="51px"
              bg={ACCENT}
              color="#ffffff"
              borderRadius="6px"
              fontSize="14px"
              fontWeight="bold"
              mt="10px"
              _hover={{
                opacity: 0.85,
              }}
            >
              SUBMIT
            </Button>
          </form>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Contact;
