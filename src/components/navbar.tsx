import * as React from 'react';
import {
  Badge,
  Box,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { BsBag, BsSearch } from 'react-icons/bs';
import { GrMenu, GrClose } from 'react-icons/gr';
import { Oswald, Montserrat } from '@next/font/google';
import Link from 'next/link';
import ShoppingDrawer from './shoppingDrawer';
import { useAppContext } from '@/context';
import { useRouter } from 'next/router';

const oswald = Oswald({
  weight: ['600'],
  style: ['normal'],
  subsets: ['latin'],
});

const montserrat = Montserrat({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

interface NavbarProps {
  navChange: boolean;
}

export default function Navbar({ navChange }: NavbarProps) {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const [showMenu, setShowMenu] = React.useState(false);
  const { cartCount } = useAppContext();

  const paths = [
    {
      name: 'HOME',
      path: '/',
    },
    {
      name: 'ABOUT',
      path: '/about',
    },
    {
      name: 'CONTACT',
      path: '/contact',
    },
    {
      name: 'STORE',
      path: '/store',
    },
  ];
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const isMatch = (path: string) => {
    return router.pathname === path;
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query ? `/store?search=${encodeURIComponent(query)}` : '/store');
  };

  function isMobile() {
    const userAgent =
      typeof window !== 'undefined' ? window.navigator.userAgent : '';
    return /Mobile/.test(userAgent);
  }

  return (
    <>
      <Flex
        w='100%'
        py='5'
        alignItems='center'
        justifyContent='center'
        position='fixed'
        top='0'
        zIndex='10'
        transitionDuration='0.3s'
        background={navChange ? '#ffffff' : 'rgba(255, 255, 255, 0.85)'}
        backdropFilter={navChange ? 'none' : 'blur(8px)'}
        boxShadow={navChange ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : 'none'}
        className={montserrat.className}
        fontSize='14px'>
        <Flex
          maxW='1224px'
          w='100%'
          alignItems='center'
          justifyContent='space-between'
          px={{ base: '16px', lg: '0' }}>
          <Icon
            as={showMenu ? GrClose : GrMenu}
            boxSize='24px'
            cursor='pointer'
            display={{ base: 'block', lg: 'none' }}
            onClick={() => setShowMenu(!showMenu)}
            transition='all 0.3s ease-in-out'
          />

          <Link href='/'>
            <Flex
              flexDir='column'
              cursor='pointer'
              lineHeight='1'
              className={oswald.className}
              pt={{ base: '1', lg: '0' }}>
              <Flex alignItems='baseline'>
                <Text
                  fontSize={{ base: '16px', lg: '21px' }}
                  textTransform='uppercase'>
                  Best
                </Text>
                <Text
                  fontSize={{ base: '16px', lg: '21px' }}
                  textTransform='uppercase'
                  color='#2563eb'
                  ml='6px'>
                  Qualities
                </Text>
              </Flex>
              <Text
                fontSize={{ base: '7px', lg: '9px' }}
                letterSpacing={{ base: '2px', lg: '3.2px' }}
                color='#64748b'
                textTransform='uppercase'
                mt='3px'>
                Industrial Equipment
              </Text>
            </Flex>
          </Link>

          <Box
            as='form'
            onSubmit={submitSearch}
            display={{ base: 'none', lg: 'block' }}
            flex='1'
            maxW='380px'
            mx='30px'>
            <InputGroup size='sm'>
              <InputLeftElement pointerEvents='none' h='38px'>
                <BsSearch color='#9a9a9a' />
              </InputLeftElement>
              <Input
                h='38px'
                borderRadius='full'
                bg='#f1f2f4'
                border='1px solid #e4e5e7'
                focusBorderColor='#2563eb'
                placeholder='Search parts, brands...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </InputGroup>
          </Box>

          <Flex
            w={{ base: '60%', md: '70%', lg: 'auto' }}
            alignItems='center'
            justifyContent='space-between'
            gap={{ base: '0', lg: '26px' }}>
            {paths.map((path) => (
              <Link href={path.path} key={path.name}>
                <Text
                  display={{ base: 'none', lg: 'flex' }}
                  cursor='pointer'
                  py='1'
                  borderBottom={
                    isMatch(path.path) ? '2px solid #2563eb' : '2px solid transparent'
                  }
                  _hover={{
                    color: '#2563eb',
                  }}>
                  {path.name}
                </Text>
              </Link>
            ))}

            <Flex
              cursor='pointer'
              alignItems='center'
              position='relative'
              onClick={isMobile() ? onToggle : onOpen}>
              <Icon as={BsBag} boxSize='20px' />
              {cartCount > 0 && (
                <Badge
                  position='absolute'
                  top='-8px'
                  right='-12px'
                  bg='#2563eb'
                  color='white'
                  borderRadius='full'
                  fontSize='10px'
                  minW='18px'
                  h='18px'
                  display='flex'
                  alignItems='center'
                  justifyContent='center'>
                  {cartCount}
                </Badge>
              )}
              <Text
                ml='10px'
                py='1'
                display={{ base: 'none', md: 'block' }}
                _hover={{ color: '#2563eb' }}>
                CART
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          display={{ base: 'flex', lg: 'none' }}
          opacity={showMenu ? '1' : '0'}
          h={showMenu ? 'auto' : '0'}
          flexDirection='column'
          alignItems='flex-end'
          w='100%'
          position='fixed'
          top='64px'
          px='16px'
          left='0'
          background='#ffffff'
          zIndex='1'
          transition='all 0.3s ease-in-out'>
          {paths.map((path) => (
            <Link href={path.path} key={path.name}>
              <Text
                key={path.name}
                py='2'
                onClick={() => setShowMenu(!showMenu)}
                _active={{
                  borderBottom: '1px solid #000',
                }}>
                {path.name}
              </Text>
            </Link>
          ))}
        </Flex>
      </Flex>
      <ShoppingDrawer isOpen={isOpen} onClose={onClose} />
    </>
  );
}
