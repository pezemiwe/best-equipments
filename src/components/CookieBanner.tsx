import * as React from 'react';
import { Button, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';




const CONSENT_KEY = 'bq-cookie-consent';

export const CookieBanner = () => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Flex
      position='fixed'
      bottom='0'
      left='0'
      right='0'
      zIndex='1000'
      bg='#0f172a'
      color='white'
      px={{ base: '16px', md: '40px' }}
      py='14px'
      alignItems={{ base: 'stretch', md: 'center' }}
      justifyContent='space-between'
      flexDir={{ base: 'column', md: 'row' }}
      gap='12px'
      boxShadow='0 -4px 20px rgba(0,0,0,0.25)'
      className={"font-montserrat"}>
      <Text fontSize='13px' maxW='720px' color='#cbd5e1'>
        We use browser storage to keep your cart between visits and remember
        your preferences. No tracking, no ads. See our{' '}
        <Link href='/privacy'>
          <Text
            as='span'
            textDecoration='underline'
            cursor='pointer'
            color='white'>
            privacy policy
          </Text>
        </Link>
        .
      </Text>
      <Button
        onClick={accept}
        bg='#2563eb'
        color='white'
        size='sm'
        px='28px'
        borderRadius='6px'
        flexShrink={0}
        _hover={{ opacity: 0.85 }}>
        Got it
      </Button>
    </Flex>
  );
};

export default CookieBanner;
