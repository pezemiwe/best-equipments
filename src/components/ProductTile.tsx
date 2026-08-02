import * as React from 'react';
import { Badge, Flex, Image, Text } from '@chakra-ui/react';
import Link from 'next/link';

const ACCENT = '#2563eb';

interface ProductTileProps {
  item: any;
}

export const ProductTile = ({ item }: ProductTileProps) => {
  return (
    <Link href='/store/[id]' as={`/store/${item.id}`}>
      <Flex
        flexDir='column'
        bg='white'
        borderRadius='8px'
        overflow='hidden'
        border='1px solid #f0f0f0'
        h='100%'
        cursor='pointer'
        _hover={{
          boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
        }}
        transition='all 0.2s ease'
        position='relative'>
        {item.inStock === false && (
          <Badge
            position='absolute'
            top='8px'
            right='8px'
            bg='#4a4a4a'
            color='white'
            fontSize='10px'
            px='6px'
            py='2px'
            borderRadius='4px'
            zIndex='1'>
            SOLD OUT
          </Badge>
        )}
        <Image
          src={item.url}
          alt={item.name}
          height={{ base: '150px', md: '190px' }}
          w='100%'
          objectFit='cover'
          loading='lazy'
          decoding='async'
          fallbackSrc='/placeholder-part.svg'
          bg='#f7f7f7'
        />
        <Flex flexDir='column' p='10px' flex='1'>
          <Text fontSize='13px' noOfLines={2} mb='4px' color='#333'>
            {item.name}
          </Text>
          {item.brand && (
            <Text fontSize='11px' color='#9a9a9a' mb='4px'>
              {item.brand}
            </Text>
          )}
          <Flex alignItems='baseline' gap='6px' mt='auto'>
            <Text fontSize='17px' fontWeight='bold' color='#0f172a'>
              ₦{item.amount?.toLocaleString()}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default ProductTile;
