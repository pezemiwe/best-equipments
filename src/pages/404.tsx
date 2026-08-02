import { Box, Button, Flex, Input, Text, SimpleGrid, Icon } from '@chakra-ui/react';
import Layout from '@/components/layout';
import Link from 'next/link';
import { BsArrowRight } from 'react-icons/bs';

import { useRouter } from 'next/router';
import React from 'react';
import Seo from '@/components/Seo';



const ACCENT = '#2563eb';

export default function Custom404() {
  const router = useRouter();
  const [search, setSearch] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/store?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <Layout>
      <Seo title="Page Not Found" noIndex />
      <Flex
        minH="60vh"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        px="20px"
        textAlign="center"
        className={"font-montserrat"}
        mt={{ base: "80px", md: "120px" }}
        mb={{ base: "60px", md: "100px" }}
      >
        <Text fontSize={{ base: '80px', md: '120px' }} className={"font-oswald"} color={ACCENT} lineHeight="1">
          404
        </Text>
        <Text fontSize={{ base: '24px', md: '32px' }} className={"font-oswald"} textTransform="uppercase" mb="20px" color="#0f172a">
          Page Not Found
        </Text>
        <Text fontSize="16px" color="#5a5a5a" mb="40px" maxW="500px">
          The page or part you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Text>
        
        <Box as="form" onSubmit={handleSearch} w="100%" maxW="400px" mb="30px">
          <Flex gap="10px">
            <Input
              aria-label="Search for parts"
              placeholder="Search for parts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              focusBorderColor={ACCENT}
              borderRadius="6px"
              h="50px"
              bg="white"
            />
            <Button type="submit" h="50px" px="30px" bg={ACCENT} color="white" borderRadius="6px" _hover={{ opacity: 0.85 }}>
              SEARCH
            </Button>
          </Flex>
        </Box>

        <Button
          onClick={() => router.push('/store')}
          variant="link"
          color={ACCENT}
          fontWeight="bold"
        >
          Browse all parts →
        </Button>

        <Box mt="60px" w="100%" maxW="600px" textAlign="left">
          <Text fontSize="14px" fontWeight="bold" color="#94a3b8" textTransform="uppercase" letterSpacing="1px" mb="20px" textAlign="center">
            Popular Categories
          </Text>
          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing="16px">
            {[
              { name: 'Belts', href: '/store?category=belts' },
              { name: 'Bearings', href: '/store?category=bearings' },
              { name: 'Seals & Gaskets', href: '/store?category=sealsGaskets' },
            ].map(cat => (
              <Link href={cat.href} key={cat.name}>
                <Flex 
                  alignItems="center" 
                  justifyContent="space-between" 
                  p="16px" 
                  bg="#f8fafc" 
                  borderRadius="8px" 
                  border="1px solid #e2e8f0"
                  color="#0f172a"
                  _hover={{ borderColor: ACCENT, color: ACCENT, bg: 'white', boxShadow: 'sm', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  <Text fontSize="14px" fontWeight="600">{cat.name}</Text>
                  <Icon as={BsArrowRight} />
                </Flex>
              </Link>
            ))}
          </SimpleGrid>
        </Box>
      </Flex>
    </Layout>
  );
}
