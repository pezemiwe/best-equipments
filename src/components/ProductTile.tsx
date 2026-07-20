import * as React from 'react';
import { Badge, Flex, Icon, Image, Text } from '@chakra-ui/react';
import { AiFillStar } from 'react-icons/ai';
import Link from 'next/link';

const ACCENT = '#2563eb';

// Deterministic pseudo rating/review-count so cards look lively without
// needing review data yet. Replace with real ratings when available.
const hashCode = (value: string) =>
  value.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 7);

export const productMeta = (id: string, amount: number) => {
  const hash = Math.abs(hashCode(id || 'x'));
  const rating = 3.9 + (hash % 12) / 10; // 3.9 - 5.0
  const reviews = 14 + (hash % 470);
  const oldPrice = Math.round(amount * 1.25);
  const discount = oldPrice > amount
    ? Math.round(((oldPrice - amount) / oldPrice) * 100)
    : 0;
  return { rating: Math.min(rating, 5), reviews, oldPrice, discount };
};

export const Stars = ({ rating }: { rating: number }) => (
  <Flex alignItems='center' gap='1px'>
    {Array.from({ length: 5 }).map((_, i) => (
      <Icon
        key={i}
        as={AiFillStar}
        boxSize='13px'
        color={i < Math.round(rating) ? '#faaf00' : '#e0e0e0'}
      />
    ))}
  </Flex>
);

interface ProductTileProps {
  item: any;
}

export const ProductTile = ({ item }: ProductTileProps) => {
  const { rating, reviews, oldPrice, discount } = productMeta(
    item.id,
    item.amount
  );

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
        {discount > 0 && (
          <Badge
            position='absolute'
            top='8px'
            left='8px'
            bg={ACCENT}
            color='white'
            fontSize='11px'
            fontWeight='bold'
            px='6px'
            py='2px'
            borderRadius='4px'
            zIndex='1'>
            -{discount}%
          </Badge>
        )}
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
          <Flex alignItems='center' gap='4px' mb='6px'>
            <Stars rating={rating} />
            <Text fontSize='11px' color='#9a9a9a'>
              ({reviews})
            </Text>
          </Flex>
          <Flex alignItems='baseline' gap='6px' mt='auto'>
            <Text fontSize='17px' fontWeight='bold' color='#0f172a'>
              ₦{item.amount?.toLocaleString()}
            </Text>
            {discount > 0 && (
              <Text
                fontSize='12px'
                color='#b0b0b0'
                textDecoration='line-through'>
                ₦{oldPrice.toLocaleString()}
              </Text>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default ProductTile;
