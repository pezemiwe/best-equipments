import * as React from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  Link as Linker,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react';

import {
  BsFacebook,
  BsInstagram,
  BsWhatsapp,
  BsTelephoneFill,
  BsEnvelopeFill,
  BsGeoAltFill,
  BsClockFill,
} from 'react-icons/bs';
import Link from 'next/link';





const ACCENT = '#2563eb';
const MUTED = '#94a3b8';
const WHATSAPP = 'https://wa.me/2348162309761';

const quickLinks = [
  { label: 'Shop products', href: '/store' },
  { label: 'About us', href: '/about' },
  { label: 'Shipping & returns', href: '/faq' },
  { label: 'Ask an expert', href: '/contact' },
  { label: 'Privacy policy', href: '/privacy' },
];

const ColumnHeading = ({ children }: { children: React.ReactNode }) => (
  <Text
    className={"font-oswald"}
    fontSize='15px'
    letterSpacing='1.5px'
    textTransform='uppercase'
    color='white'
    mb='18px'
  >
    {children}
  </Text>
);

export const Footer = () => {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const toast = useToast();

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: 'Please enter a valid email.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast({
          title: 'Subscribed successfully!',
          status: 'success',
          duration: 3000,
        });
        setEmail('');
      } else {
        const data = await res.json();
        toast({
          title: data.error || 'Subscription failed',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (err) {
      toast({ title: 'An error occurred', status: 'error', duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      as='footer'
      w='100%'
      bg='#0f172a'
      color='white'
      className={"font-montserrat"}
      mt='auto'
    >
      <Flex
        w='100%'
        justifyContent='center'
        px={{ base: '16px', md: '24px', lg: '32px' }}
      >
        <Flex flexDir='column' w='100%' maxW='1280px' mx='auto'>
          {/* ---------------- Newsletter bar ---------------- */}
          <Flex
            mt={{ base: '48px', md: '64px' }}
            p={{ base: '24px', md: '32px' }}
            bg='#152238'
            border='1px solid #1e293b'
            borderRadius='14px'
            flexDir={{ base: 'column', lg: 'row' }}
            alignItems={{ base: 'stretch', lg: 'center' }}
            justifyContent='space-between'
            gap={{ base: '20px', lg: '40px' }}
          >
            <Flex flexDir='column' flexShrink={0}>
              <Text
                className={"font-oswald"}
                fontSize={{ base: '19px', md: '22px' }}
                textTransform='uppercase'
                letterSpacing='0.5px'
              >
                Get deals &amp; new arrivals
              </Text>
              <Text fontSize='14px' color={MUTED} mt='6px'>
                Product specials and restock alerts. No spam, ever.
              </Text>
            </Flex>
            <Flex
              as='form'
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                handleSubscribe();
              }}
              gap='10px'
              w={{ base: '100%', lg: 'auto' }}
              flexDir={{ base: 'column', sm: 'row' }}
              flex={{ lg: '1' }}
              maxW={{ lg: '520px' }}
            >
              <InputGroup flex='1'>
                <Input
                  type='email'
                  aria-label='Email address for newsletter'
                  height='50px'
                  bg='#0f172a'
                  borderRadius='8px'
                  border='1px solid #334155'
                  placeholder='Your email address'
                  color='white'
                  fontSize='14px'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  _hover={{ borderColor: '#475569' }}
                  _focus={{
                    borderColor: ACCENT,
                    boxShadow: `0 0 0 1px ${ACCENT}`,
                  }}
                  sx={{
                    '&::placeholder': { color: '#64748b', fontSize: '14px' },
                  }}
                />
              </InputGroup>
              <Button
                type='submit'
                height='50px'
                px='30px'
                bg={ACCENT}
                color='white'
                borderRadius='8px'
                fontSize='13px'
                fontWeight='700'
                letterSpacing='0.5px'
                flexShrink={0}
                _hover={{ bg: '#1d4ed8' }}
                isLoading={isLoading}
                loadingText='SUBSCRIBING'
              >
                SUBSCRIBE
              </Button>
            </Flex>
          </Flex>

          {/* ---------------- Main columns ---------------- */}
          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 4 }}
            spacingX={{ base: '24px', md: '40px' }}
            spacingY={{ base: '36px', md: '44px' }}
            py={{ base: '44px', md: '60px' }}
          >
            {/* Brand */}
            <Flex flexDir='column'>
              <Flex flexDir='column' lineHeight='1' mb='16px'>
                <Flex alignItems='baseline'>
                  <Text
                    className={"font-oswald"}
                    fontSize='22px'
                    textTransform='uppercase'
                  >
                    Best
                  </Text>
                  <Text
                    className={"font-oswald"}
                    fontSize='22px'
                    textTransform='uppercase'
                    color={ACCENT}
                    ml='6px'
                  >
                    Qualities
                  </Text>
                </Flex>
                <Text
                  fontSize='9px'
                  letterSpacing='3.4px'
                  color={MUTED}
                  textTransform='uppercase'
                  mt='5px'
                >
                  Industrial Equipment
                </Text>
              </Flex>
              <Text fontSize='14px' color={MUTED} lineHeight='1.7' mb='22px'>
                Suppliers of quality industrial equipment and vehicle parts to
                workshops, fleets and construction sites across Nigeria.
              </Text>
              <Flex gap='10px'>
                {[
                  { icon: BsWhatsapp, href: WHATSAPP, label: 'WhatsApp' },
                  {
                    icon: BsFacebook,
                    href: 'https://www.facebook.com/',
                    label: 'Facebook',
                  },
                  {
                    icon: BsInstagram,
                    href: 'https://www.instagram.com/',
                    label: 'Instagram',
                  },
                ].map((social) => (
                  <Linker
                    key={social.label}
                    href={social.href}
                    isExternal
                    aria-label={social.label}
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    boxSize='38px'
                    borderRadius='8px'
                    bg='#1e293b'
                    color={MUTED}
                    transition='all 0.2s ease'
                    _hover={{ bg: ACCENT, color: 'white' }}
                  >
                    <Icon as={social.icon} boxSize='16px' />
                  </Linker>
                ))}
              </Flex>
            </Flex>

            {/* Quick links */}
            <Flex flexDir='column'>
              <ColumnHeading>Quick links</ColumnHeading>
              <Flex flexDir='column' gap='11px'>
                {quickLinks.map((link) => (
                  <Link href={link.href} key={link.href}>
                    <Text
                      fontSize='14px'
                      color={MUTED}
                      w='fit-content'
                      transition='color 0.2s ease'
                      _hover={{ color: 'white' }}
                    >
                      {link.label}
                    </Text>
                  </Link>
                ))}
              </Flex>
            </Flex>

            {/* Visit us */}
            <Flex flexDir='column'>
              <ColumnHeading>Visit us</ColumnHeading>
              <Flex gap='10px' mb='16px'>
                <Icon
                  as={BsGeoAltFill}
                  boxSize='13px'
                  color={ACCENT}
                  mt='4px'
                  flexShrink={0}
                />
                <Text fontSize='14px' color={MUTED} lineHeight='1.7'>
                  Area A6 / Shop 63, Machine Parts (UASPDA),
                  <br />
                  Opposite Auto Parts First Gate, Trade Fair,
                  <br />
                  Mile 2 &ndash; Badagry Expressway, Ojo, Lagos
                </Text>
              </Flex>
              <Flex gap='10px'>
                <Icon
                  as={BsClockFill}
                  boxSize='13px'
                  color={ACCENT}
                  mt='4px'
                  flexShrink={0}
                />
                <Flex flexDir='column'>
                  <Text fontSize='14px' color={MUTED}>
                    Mon &ndash; Sat: 9am &ndash; 6pm
                  </Text>
                  <Text fontSize='14px' color={MUTED}>
                    Sunday: Closed
                  </Text>
                </Flex>
              </Flex>
            </Flex>

            {/* Contact */}
            <Flex flexDir='column'>
              <ColumnHeading>Contact</ColumnHeading>
              <Flex flexDir='column' gap='14px'>
                <Linker
                  href='tel:+2348103447856'
                  display='flex'
                  alignItems='center'
                  gap='10px'
                  fontSize='14px'
                  color={MUTED}
                  w='fit-content'
                  _hover={{ color: 'white', textDecoration: 'none' }}
                >
                  <Icon as={BsTelephoneFill} boxSize='13px' color={ACCENT} />
                  +234 810 344 7856
                </Linker>
                <Linker
                  href='mailto:bestindqualities@gmail.com'
                  display='flex'
                  alignItems='flex-start'
                  gap='10px'
                  fontSize='14px'
                  color={MUTED}
                  w='fit-content'
                  wordBreak='break-word'
                  _hover={{ color: 'white', textDecoration: 'none' }}
                >
                  <Icon
                    as={BsEnvelopeFill}
                    boxSize='13px'
                    color={ACCENT}
                    mt='4px'
                    flexShrink={0}
                  />
                  bestindqualities@gmail.com
                </Linker>
                <Button
                  as='a'
                  href={WHATSAPP}
                  target='_blank'
                  rel='noopener noreferrer'
                  mt='4px'
                  h='44px'
                  w='fit-content'
                  px='20px'
                  bg='#25D366'
                  color='white'
                  borderRadius='8px'
                  fontSize='13px'
                  fontWeight='700'
                  leftIcon={<Icon as={BsWhatsapp} boxSize='16px' />}
                  _hover={{ opacity: 0.9 }}
                >
                  CHAT WITH US
                </Button>
              </Flex>
            </Flex>
          </SimpleGrid>

          {/* ---------------- Bottom bar ---------------- */}
          <Flex
            borderTop='1px solid #1e293b'
            py='24px'
            flexDir={{ base: 'column', md: 'row' }}
            alignItems='center'
            justifyContent='space-between'
            gap='12px'
          >
            <Text
              fontSize='13px'
              color='#64748b'
              textAlign={{ base: 'center', md: 'left' }}
            >
              &copy; {new Date().getFullYear()} Best Qualities Industrial
              Equipment Nig Ltd. All rights reserved.
            </Text>
            <Flex gap='20px'>
              <Link href='/privacy'>
                <Text
                  fontSize='13px'
                  color='#64748b'
                  _hover={{ color: 'white' }}
                  transition='color 0.2s ease'
                >
                  Privacy
                </Text>
              </Link>
              <Link href='/faq'>
                <Text
                  fontSize='13px'
                  color='#64748b'
                  _hover={{ color: 'white' }}
                  transition='color 0.2s ease'
                >
                  Shipping &amp; returns
                </Text>
              </Link>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
