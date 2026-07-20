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

const faqs = [
  {
    question: "How do I know a part will fit my vehicle?",
    answer:
      "Every order is fitment-checked before dispatch. Add your vehicle's make, model and year (or VIN) at checkout or via the contact page, and our team will verify the part against manufacturer data. If a part we confirmed doesn't fit, return shipping is on us.",
  },
  {
    question: "How fast is delivery?",
    answer:
      "In-stock parts ordered before 2pm are dispatched the same business day. Standard delivery takes 2-4 business days and costs ₦2,500; orders over ₦50,000 ship free. Express next-day delivery is available at checkout. If you're outside our courier coverage area, we'll contact you with the additional rate before charging anything.",
  },
  {
    question: "What is your return policy?",
    answer:
      "You can return any part within 14 days of receiving it, as long as it's unused, uninstalled and in its original packaging. Electrical parts that have been fitted can't be returned unless faulty. To start a return, email support@bestqualities.ng with your order number.",
  },
  {
    question: "Are your parts genuine?",
    answer:
      "We sell genuine OEM parts and certified aftermarket parts from established brands like Bosch, NGK, Brembo, Gates and Mann-Filter, sourced directly from authorised distributors. Every part carries a minimum 12-month warranty.",
  },
  {
    question: "What does the warranty cover?",
    answer:
      "All parts carry a minimum 12-month warranty against manufacturing defects; many brands offer longer. The warranty covers replacement or refund of the part itself. Keep your order confirmation as proof of purchase; no registration needed.",
  },
  {
    question: "Can you help me diagnose which part I need?",
    answer:
      "Yes. Describe the symptoms (noises, warning lights, fault codes) through the contact page along with your vehicle details, and one of our mechanics will point you to the likely part, free of charge and with no obligation to buy.",
  },
];

export const Faq = () => {
  return (
    <Layout>
      <Seo
        title='FAQ - Shipping, Returns & Warranty'
        description='Answers on part fitment, delivery times and costs, 14-day returns and the minimum 12-month warranty on all vehicle parts.'
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
        flexDir="column"
        alignItems="center"
        color="#2e2e2e"
        fontSize="16px"
        className={montserrat.className}
      >
        <Text
          mt="120px"
          mb="10px"
          fontSize={{
            base: "28px",
            lg: "40px",
          }}
          className={oswald.className}
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
                  className={oswald.className}
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
