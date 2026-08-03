import * as React from 'react';
import Layout from '@/components/layout';
import Seo from '@/components/Seo';
import { Flex, Text } from '@chakra-ui/react';






const sections = [
  {
    title: 'What we store on your device',
    body: "We use your browser's local storage to keep the items in your shopping cart between visits and to remember that you have seen our notices. We do not use advertising or third-party tracking cookies.",
  },
  {
    title: 'What we collect when you order',
    body: 'When you place an order, we record the products, quantities and prices, and any name or phone number you provide, so we can fulfil the order and provide support. Completing an order takes you to WhatsApp, which is governed by WhatsApp’s own privacy policy.',
  },
  {
    title: 'What we collect from the contact form',
    body: 'Messages sent through the contact page include the details you type (name, email, vehicle information and your message) and are used only to respond to your enquiry.',
  },
  {
    title: 'How long we keep information',
    body: 'Order records are kept for as long as needed for business records, warranties and returns. You can ask us to delete your personal details at any time using the contact details below.',
  },
  {
    title: 'Your choices',
    body: 'You can clear your cart and stored preferences at any time by clearing your browser data for this site. To ask about, correct or delete information we hold about you, email support@bestqualities.ng or call +234 816 230 9761.',
  },
];

export default function Privacy() {
  return (
    <Layout>
      <Seo
        title='Privacy Policy'
        description='How Best Qualities Industrial Equipment handles your cart data, order details and contact information.'
        path='/privacy'
      />
      <Flex
        w='100%'
        maxWidth='800px' mx='auto'
        px={{ base: '16px', lg: '0px' }}
        flexDir='column'
        color='#2e2e2e'
        fontSize='16px'
        className={"font-montserrat"}
        mt='120px'
        mb='80px'>
        <Text
          fontSize={{ base: '28px', lg: '40px' }}
          className={"font-oswald"}
          textTransform='uppercase'
          mb='10px'>
          Privacy Policy
        </Text>
        <Text color='#7a7a7a' fontSize='14px' mb='40px'>
          Best Qualities Industrial Equipment Nig Ltd
        </Text>
        {sections.map((section) => (
          <Flex flexDir='column' key={section.title} mb='30px'>
            <Text
              className={"font-oswald"}
              fontSize='20px'
              mb='8px'>
              {section.title}
            </Text>
            <Text color='#5a5a5a' lineHeight='1.7'>
              {section.body}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Layout>
  );
}
