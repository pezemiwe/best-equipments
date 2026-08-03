import * as React from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import Layout from "@/components/layout";
import Seo from "@/components/Seo";






const faqs = [
  {
    question: "How do I know I'm ordering the right part?",
    answer:
      "If you're unsure, describe your vehicle or machine (make, model, year) and the part you need via the contact page before you order. Our team will confirm availability and compatibility. If a part we confirmed turns out wrong, return shipping is on us.",
  },
  {
    question: "How fast is delivery?",
    answer:
      "Delivery costs and timeframes will be confirmed with you on WhatsApp before dispatch.",
  },
  {
    question: "What is your return policy?",
    answer:
      "You can return any part as long as it's unused, uninstalled and in its original packaging. Electrical parts that have been fitted can't be returned unless faulty. To start a return, email support@bestqualities.ng with your order number.",
  },
  {
    question: "Are your products genuine?",
    answer:
      "We sell genuine and certified parts from established brands like Bosch, SKF, Gates, Fenner and Caterpillar, sourced directly from authorised distributors.",
  },
  {
    question: "What does the warranty cover?",
    answer:
      "Warranty coverage depends on the specific part and brand, covering manufacturing defects. The warranty covers replacement or refund of the part itself. Keep your order confirmation as proof of purchase; no registration needed.",
  },
  {
    question: "Can you help me identify which part I need?",
    answer:
      "Yes. Describe the equipment or vehicle and the problem through the contact page, and one of our technicians will point you to the right part, free of charge and with no obligation to buy.",
  },
];

export const Faq = () => {
  return (
    <Layout>
      <Seo
        title='FAQ - Shipping, Returns & Warranty'
        description='Answers on product compatibility, delivery times and costs, returns and warranties.'
        path='/faq'
        jsonLd={{
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }}
      />
      <Flex
        w="100%"
        maxWidth={{
          base: "100%",
          md: "450px",
          lg: "1224px",
        }}
        px={{
          base: "16px",
          lg: "0px",
        }}
        mx="auto"
        flexDir="column"
        alignItems="center"
        color="#2e2e2e"
        fontSize="16px"
        className={"font-montserrat"}
      >
        <Text
          mt="120px"
          mb="10px"
          fontSize={{
            base: "28px",
            lg: "40px",
          }}
          className={"font-oswald"}
          textTransform="uppercase"
          textAlign="center"
        >
          Frequently asked questions
        </Text>
        <Text mb="40px" color="#5a5a5a" textAlign="center" maxW="600px">
          Everything you need to know about fitment, shipping, returns and
          warranties. Can&apos;t find your answer? Reach us through the contact
          page.
        </Text>
        <Accordion
          allowMultiple
          w="100%"
          maxW="800px"
          mb="80px"
        >
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} border="1px solid #e8e8e8" mb="12px">
              <AccordionButton py="18px" _expanded={{ bg: "#f8f8f8" }}>
                <Box
                  flex="1"
                  textAlign="left"
                  fontSize="17px"
                  className={"font-oswald"}
                >
                  {faq.question}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb="20px" color="#5a5a5a">
                {faq.answer}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Flex>
    </Layout>
  );
};

export default Faq;
