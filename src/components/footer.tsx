import * as React from 'react';
import { Button, Flex, Input, Link as Linker, Text } from '@chakra-ui/react';
import { Oswald, Montserrat } from '@next/font/google';
import { BsFacebook, BsInstagram, BsTwitter } from 'react-icons/bs';
import Link from 'next/link';

const oswald = Oswald({
  weight: ['500'],
  style: ['normal'],
  subsets: ['latin'],
});

const montserrat = Montserrat({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

const ACCENT = '#2563eb';

export const Footer = () => {
  return (
    <Flex
      bg='#0f172a'
      w='100%'
      py='16'
      justifyContent='center'
      h={{
        base: 'auto',
        lg: '440px',
      }}
      color='#ffffff'
      className={montserrat.className}
      px={{
        base: '16px',
        lg: '0px',
      }}>
      <Flex
        maxW={{
          base: '100%',
          md: '450px',
          lg: '1224px',
        }}
        w='100%'
        flexDir='column'>
        <Flex
          w='100%'
          justifyContent='space-between'
          flexDir={{
            base: 'column',
            lg: 'row',
          }}>
          <Flex
            fontSize='16px'
            w={{ base: '100%', lg: '55%' }}
            justifyContent='space-between'
            pt='15px'
            flexDir={{
              base: 'column',
              lg: 'row',
            }}>
            <Flex
              flexDir='column'
              mb={{
                base: '30px',
                lg: '0px',
              }}>
              <Text className={oswald.className} fontSize='20px' mb='8px' textTransform='uppercase'>
                Visit us
              </Text>
              <Flex flexDir='column' color='#b9bcbf'>
                <Text>3721 Single Street</Text>
                <Text>Quincy, MA 02169</Text>
                <Text mt='10px'>Mon - Sat: 8am - 6pm</Text>
              </Flex>
            </Flex>
            <Flex
              flexDir='column'
              mb={{
                base: '30px',
                lg: '0px',
              }}>
              <Text className={oswald.className} fontSize='20px' mb='8px' textTransform='uppercase'>
                Contact
              </Text>
              <Flex flexDir='column' color='#b9bcbf'>
                <Text>+1 (347) 679-9566</Text>
                <Text>support@bestqualities.ng</Text>
              </Flex>
            </Flex>
            <Flex
              flexDir='column'
              mb={{
                base: '30px',
                lg: '0px',
              }}>
              <Text className={oswald.className} fontSize='20px' mb='8px' textTransform='uppercase'>
                Quick links
              </Text>
              <Flex flexDir='column' color='#b9bcbf'>
                <Link href='/store'>
                  <Text _hover={{ color: '#fff' }}>Shop parts</Text>
                </Link>
                <Link href='/about'>
                  <Text _hover={{ color: '#fff' }}>About us</Text>
                </Link>
                <Link href='/faq'>
                  <Text _hover={{ color: '#fff' }}>Shipping & returns</Text>
                </Link>
                <Link href='/contact'>
                  <Text _hover={{ color: '#fff' }}>Ask an expert</Text>
                </Link>
                <Link href='/privacy'>
                  <Text _hover={{ color: '#fff' }}>Privacy policy</Text>
                </Link>
              </Flex>
            </Flex>
          </Flex>
          <Flex flexDir='column'>
            <Text
              className={oswald.className}
              fontSize='20px'
              mb='8px'
              textTransform='uppercase'
              w={{
                base: '100%',
                md: 'auto',
              }}>
              Get deals & new arrivals
            </Text>
            <Text fontSize='14px' color='#b9bcbf' mb='12px'>
              Parts specials and restock alerts. No spam, ever.
            </Text>
            <Input
              height='48px'
              w={{
                base: '100%',
                md: '388.93px',
              }}
              bg='#2a2e33'
              borderRadius='6px'
              border='none'
              placeholder='Your email address'
              pl='16px'
              color='#ffffff'
              sx={{
                '&::placeholder': {
                  color: '#8a8d90',
                  fontSize: '14px',
                },
              }}
            />
            <Button
              width='151.9px'
              height='50.9px'
              bg={ACCENT}
              color='#ffffff'
              borderRadius='6px'
              fontWeight='bold'
              _hover={{ opacity: 0.85 }}
              mt='20px'>
              SUBSCRIBE
            </Button>
          </Flex>
        </Flex>
        <Flex
          mt='60px'
          w='100%'
          justifyContent='space-between'
          alignItems={{ base: 'flex-start', md: 'center' }}
          flexDir={{ base: 'column', md: 'row' }}
          gap='20px'>
          <Text fontSize='13px' color='#8a8d90'>
            © {new Date().getFullYear()} Best Qualities Industrial Equipment
            Nig Ltd. All rights reserved.
          </Text>
          <Flex width='123px' alignItems='center' justifyContent='space-between'>
            <Linker href='https://twitter.com/' isExternal>
              <BsTwitter size='20px' />
            </Linker>
            <Linker href='https://www.facebook.com/' isExternal>
              <BsFacebook size='20px' />
            </Linker>
            <Linker href='https://www.instagram.com/' isExternal>
              <BsInstagram size='20px' />
            </Linker>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Footer;
