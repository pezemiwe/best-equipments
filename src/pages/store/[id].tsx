import * as React from 'react';

import {
  Badge,
  Box,
  Button,
  Flex,
  Image,
  IconButton,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  SimpleGrid,
  Skeleton,
  Text,
  Textarea,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import { AiFillStar, AiOutlineStar, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

import { useProduct, useProducts } from '@/hooks/products';
import { useCategories } from '@/hooks/categories';
import { useAppContext } from '@/context';
import ProductTile from '@/components/ProductTile';
import { DiscountCountdown } from '@/components/DiscountCountdown';
import { relatedProducts } from '@/utils/search';
import Seo, { absoluteUrl, SITE_NAME, SITE_URL } from '@/components/Seo';

const ACCENT = '#2563eb';

// Server-render the product so crawlers get full meta tags and Product
// JSON-LD without executing JavaScript.
export const getServerSideProps = async ({ params }: any) => {
  try {
    const { getProduct } = await import('@/server/productStore');
    const product = await getProduct(String(params?.id || ''));
    if (!product) return { notFound: true };
    return {
      props: { initialProduct: JSON.parse(JSON.stringify(product)) },
    };
  } catch {
    return { notFound: true };
  }
};

export const SingleProduct = ({ initialProduct }: { initialProduct?: any }) => {
  const router = useRouter();
  const { id } = router.query;
  const [num, setNum] = React.useState(1);
  const toast = useToast();
  const { data: fetched, isLoading: fetchLoading, refetch } = useProduct(id as string);
  const { data: categories } = useCategories();
  const product = fetched ?? initialProduct ?? undefined;
  const isLoading = fetchLoading && !product;
  const { addToCart, isInCart } = useAppContext();

  const categoryLabel = (value: string) => {
    const found = (categories || []).find((c: any) => c.value === value);
    return found ? found.name : value;
  };

  const addedToCart = isInCart(id as string);
  const increment = () => {
    setNum(num + 1);
  };
  const decrement = () => {
    if (num > 1) {
      setNum(num - 1);
    }
  };

  const addItemToCart = () => {
    if (product) {
      addToCart({
        ...product,
        quantity: num,
      });
    }
  };

  const info = product as any;
  const [reviewForm, setReviewForm] = React.useState({ name: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = React.useState(false);

  const averageRating = React.useMemo(() => {
    if (!info?.reviews || info.reviews.length === 0) return 0;
    const sum = info.reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
    return sum / info.reviews.length;
  }, [info]);

  const submitReview = async () => {
    if (!reviewForm.name || !reviewForm.comment) {
      toast({ title: 'Please fill all fields', status: 'error' });
      return;
    }
    setSubmittingReview(true);
    try {
      await fetch(`/api/products/${info?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });
      toast({ title: 'Review submitted!', status: 'success' });
      setReviewForm({ name: '', rating: 5, comment: '' });
      refetch(); // Refetch product data to show new review
    } catch (e) {
      toast({ title: 'Failed to submit review', status: 'error' });
    } finally {
      setSubmittingReview(false);
    }
  };

  const { data: allProducts, isLoading: relatedLoading } = useProducts();
  const related = relatedProducts(allProducts || [], info, 4);

  const images: string[] = React.useMemo(
    () =>
      [info?.url, ...(info?.gallery || [])].filter(
        (src, index, all) => src && all.indexOf(src) === index
      ),
    [info]
  );
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);
  const { isOpen: isLightboxOpen, onOpen: openLightbox, onClose: closeLightbox } = useDisclosure();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  React.useEffect(() => setSelectedImage(0), [info?.id]);

  const handleLightboxScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const width = scrollContainerRef.current.clientWidth;
      const index = Math.round(scrollLeft / width);
      if (index !== selectedImage) {
        setSelectedImage(index);
      }
    }
  };

  const scrollToLightboxImage = (index: number) => {
    setSelectedImage(index);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.clientWidth * index,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Layout>
      {info && (
        <Seo
          title={`${info.name}${info.brand ? ` - ${info.brand}` : ''}`}
          description={`Buy ${info.name}${
            info.brand ? ` by ${info.brand}` : ''
          } for ₦${Number(info.amount).toLocaleString()}. ${String(
            info.description || ''
          ).slice(0, 120)}`}
          path={`/store/${info.id}`}
          image={info.url}
          type='product'
          jsonLd={[
            {
              '@type': 'Product',
              name: info.name,
              image: [info.url, ...(info.gallery || [])].map(absoluteUrl),
              description: info.description,
              sku: info.sku,
              brand: info.brand
                ? { '@type': 'Brand', name: info.brand }
                : undefined,
              offers: {
                '@type': 'Offer',
                url: `${SITE_URL}/store/${info.id}`,
                priceCurrency: 'NGN',
                price: Number(info.amount),
                availability: info.inStock
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
                seller: { '@type': 'Organization', name: SITE_NAME },
              },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Store',
                  item: `${SITE_URL}/store`,
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: info.name,
                  item: `${SITE_URL}/store/${info.id}`,
                },
              ],
            },
          ]}
        />
      )}
      <Flex
        w='100%'
        maxWidth='1224px'
        mx='auto'
        color='#2e2e2e'
        fontSize='16px'
        mt={{
          base: '120px',
          lg: '140px',
        }}
        mb={{
          base: '0px',
          lg: '150px',
        }}
        justifyContent='space-between'
        className={"font-montserrat"}
        px={{
          base: '16px',
          lg: '0px',
        }}
        flexDir={{
          base: 'column',
          lg: 'row',
        }}>
        {isLoading ? (
          <Flex
            flexDir='column'
            w={{ base: '100%', lg: '600px' }}
            flexShrink={0}>
            <Skeleton w='100%' h={{ base: '320px', lg: '600px' }} />
            <Flex gap='10px' mt='12px'>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} boxSize={{ base: '64px', lg: '84px' }} />
              ))}
            </Flex>
          </Flex>
        ) : (
          <Flex
            flexDir='column'
            w={{ base: '100%', lg: '600px' }}
            flexShrink={0}>
            <Image
              key={images[selectedImage]}
              src={images[selectedImage]}
              alt={info?.name}
              objectFit='cover'
              fallbackSrc='/placeholder-part.svg'
              w='100%'
              h={{ base: '320px', md: '440px', lg: '600px' }}
              borderRadius='8px'
              bg='#f7f7f7'
              transition='opacity 0.25s ease'
              cursor='zoom-in'
              onClick={() => {
                openLightbox();
                // We need to wait for modal to render before scrolling
                setTimeout(() => scrollToLightboxImage(selectedImage), 50);
              }}
            />
            {images.length > 1 && (
              <Flex gap='10px' mt='12px' flexWrap='wrap'>
                {images.map((src, index) => (
                  <Image
                    key={src}
                    src={src}
                    alt={`${info?.name} view ${index + 1}`}
                    boxSize={{ base: '64px', lg: '84px' }}
                    objectFit='cover'
                    fallbackSrc='/placeholder-part.svg'
                    cursor='pointer'
                    borderRadius='6px'
                    border={
                      index === selectedImage
                        ? `2px solid ${ACCENT}`
                        : '2px solid transparent'
                    }
                    opacity={index === selectedImage ? 1 : 0.7}
                    _hover={{ opacity: 1 }}
                    transition='all 0.2s ease'
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </Flex>
            )}
          </Flex>
        )}
        <Flex
          mt={{
            base: '30px',
            lg: '0px',
          }}
          mb={{
            base: '50px',
            lg: '0px',
          }}
          maxW={{ base: '100%', lg: '560px' }}
          flexDir='column'>
          <Flex gap='10px' mb='15px'>
            {info?.category && (
              <Badge bg='#f1f1f1' color='#5a5a5a' borderRadius='6px'>
                {categoryLabel(info.category)}
              </Badge>
            )}
            <Badge
              bg={info?.inStock === false ? '#fdecec' : '#e8f5e9'}
              color={info?.inStock === false ? '#c62828' : '#2e7d32'}
              borderRadius='6px'>
              {info?.inStock === false ? 'Out of stock' : 'In stock'}
            </Badge>
          </Flex>
          <Text
            fontSize={{
              base: '30px',
              lg: '40px',
            }}
            className={"font-oswald"}
            textTransform='uppercase'
            lineHeight='1.2'
            mb='10px'>
            {info?.name}
          </Text>
          {info?.reviews && info.reviews.length > 0 && (
            <Flex alignItems='center' gap='5px' mb='10px'>
              {Array.from({ length: 5 }).map((_, i) => (
                i < Math.round(averageRating) 
                  ? <AiFillStar key={i} color="#ecc94b" size="18px" /> 
                  : <AiOutlineStar key={i} color="#cbd5e1" size="18px" />
              ))}
              <Text fontSize='13px' color='#7a7a7a'>
                ({info.reviews.length} reviews)
              </Text>
            </Flex>
          )}
          <Flex mb='10px' fontSize='14px' color='#7a7a7a' gap='16px'>
            {info?.brand && <Text>Brand: {info.brand}</Text>}
            {info?.sku && <Text>SKU: {info.sku}</Text>}
          </Flex>
          <Flex alignItems='baseline' gap='10px' mb='20px'>
            {mounted && info?.discountPrice && info?.discountEnd && info.discountEnd > Date.now() ? (
              <Flex flexDir="column">
                <Flex alignItems='baseline' gap='10px'>
                  <Text fontSize='28px' fontWeight='bold' color='#ea580c'>
                    ₦{info.discountPrice.toLocaleString()}
                  </Text>
                  <Text fontSize='18px' color='#9a9a9a' textDecoration='line-through'>
                    ₦{info.amount?.toLocaleString()}
                  </Text>
                </Flex>
                <DiscountCountdown discountEnd={info.discountEnd} />
              </Flex>
            ) : (
              <Text fontSize='28px' fontWeight='bold' color='#0f172a'>
                ₦{info?.amount?.toLocaleString()}
              </Text>
            )}
          </Flex>
          <Flex mb='25px'>
            <Button
              px='4'
              border='1px solid #e5e5e5'
              cursor='pointer'
              onClick={decrement}
              borderRadius='4px 0 0 4px'
              bg='white'
              isDisabled={addedToCart}
              h='44px'
              _hover={{ bg: '#f9f9f9' }}>
              -
            </Button>
            <Flex
              w='60px'
              borderTop='1px solid #e5e5e5'
              borderBottom='1px solid #e5e5e5'
              h='44px'
              alignItems='center'
              justifyContent='center'
              fontWeight='500'>
              {num}
            </Flex>
            <Button
              display='flex'
              px='4'
              border='1px solid #e5e5e5'
              onClick={increment}
              borderRadius='0 4px 4px 0'
              bg='white'
              h='44px'
              isDisabled={addedToCart}
              _hover={{ bg: '#f9f9f9' }}>
              +
            </Button>
          </Flex>
          <Button
            px='36px'
            py='0'
            height='44px'
            w='fit-content'
            alignSelf='flex-start'
            bg={addedToCart ? '#4a5568' : ACCENT}
            color='#ffffff'
            borderRadius='6px'
            fontSize='14px'
            fontWeight='700'
            mb='40px'
            letterSpacing='1px'
            textTransform='uppercase'
            _hover={{ bg: addedToCart ? '#4a5568' : '#1d4ed8', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(37,99,235,0.4)' }}
            _active={{ transform: 'translateY(0)' }}
            transition='all 0.2s'
            onClick={addItemToCart}
            isDisabled={addedToCart}>
            {addedToCart ? 'ADDED TO CART' : 'ADD TO CART'}
          </Button>
          {info?.description ? (
            <Box
              w='100%'
              mb='25px'
              color='#5a5a5a'
              className='rich-text-content'
              sx={{
                'ul, ol': { paddingLeft: '1.5rem', marginBottom: '1rem' },
                'h1, h2, h3': { color: '#0f172a', fontWeight: 'bold', marginY: '0.5rem' },
                'p': { marginBottom: '0.5rem' },
                'a': { color: '#2563eb', textDecoration: 'underline' }
              }}
              dangerouslySetInnerHTML={{ __html: info.description }}
            />
          ) : (
            <Text
              w='100%'
              mb='25px'
              color='#5a5a5a'>
              Quality-checked before dispatch.
            </Text>
          )}
          <Flex flexDir='column' fontSize='14px' color='#5a5a5a' gap='4px'>
            <Text>✓ Quality-checked before dispatch</Text>
          </Flex>
          
          <Box mt='60px' w='100%' borderTop='1px solid #e4e5e7' pt='30px'>
            <Text fontSize='20px' className="font-oswald" mb='20px'>Customer Reviews</Text>
            
            {(!info?.reviews || info.reviews.length === 0) ? (
              <Text fontSize='14px' color='#7a7a7a' mb='30px'>No reviews yet. Be the first to review this product!</Text>
            ) : (
              <Flex flexDir='column' gap='20px' mb='30px'>
                {info.reviews.map((rev: any, idx: number) => (
                  <Box key={idx} p='20px' bg='white' border='1px solid #e4e5e7' borderRadius='8px'>
                    <Flex justifyContent='space-between' alignItems='center' mb='10px'>
                      <Text fontWeight='600'>{rev.name}</Text>
                      <Text fontSize='12px' color='#9a9a9a'>{new Date(rev.date).toLocaleDateString()}</Text>
                    </Flex>
                    <Flex alignItems='center' gap='2px' mb='10px'>
                      {Array.from({ length: 5 }).map((_, i) => (
                        i < rev.rating 
                          ? <AiFillStar key={i} color="#ecc94b" size="14px" /> 
                          : <AiOutlineStar key={i} color="#cbd5e1" size="14px" />
                      ))}
                    </Flex>
                    <Text fontSize='14px' color='#5a5a5a'>{rev.comment}</Text>
                  </Box>
                ))}
              </Flex>
            )}

            <Box p='20px' bg='#f8fafc' borderRadius='8px'>
              <Text fontWeight='600' mb='15px'>Write a Review</Text>
              <Flex flexDir='column' gap='15px'>
                <Input 
                  placeholder='Your Name' 
                  bg='white' 
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                />
                <Flex alignItems='center' gap='10px'>
                  <Text fontSize='14px'>Rating:</Text>
                  <Flex gap='5px'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Box key={i} cursor='pointer' onClick={() => setReviewForm({ ...reviewForm, rating: i + 1 })}>
                        {i < reviewForm.rating ? <AiFillStar color="#ecc94b" size="20px" /> : <AiOutlineStar color="#cbd5e1" size="20px" />}
                      </Box>
                    ))}
                  </Flex>
                </Flex>
                <Textarea 
                  placeholder='Your Review' 
                  bg='white' 
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                />
                <Button 
                  colorScheme='blue' 
                  w='fit-content' 
                  onClick={submitReview}
                  isLoading={submittingReview}
                >
                  Submit Review
                </Button>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Flex>
      {(relatedLoading || related.length > 0) && (
        <Flex
          w='100%'
          maxWidth='1224px' mx='auto'
          flexDir='column'
          className={"font-montserrat"}
          px={{ base: '16px', lg: '0px' }}
          mb={{ base: '60px', lg: '120px' }}>
          <Text
            className={"font-oswald"}
            fontSize={{ base: '22px', lg: '28px' }}
            textTransform='uppercase'
            color='#0f172a'
            mb='20px'>
            You may also need
          </Text>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing='14px'>
            {relatedLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} h='300px' borderRadius='8px' />
                ))
              : related.map((item: any) => (
                  <ProductTile item={item} key={item.id} />
                ))}
          </SimpleGrid>
        </Flex>
      )}

      {/* Lightbox Modal */}
      <Modal isOpen={isLightboxOpen} onClose={closeLightbox} size='full'>
        <ModalOverlay />
        <ModalContent bg='rgba(0,0,0,0.95)' m='0'>
          <ModalCloseButton color='white' size='lg' top='16px' right='16px' zIndex={10} bg='blackAlpha.600' />
          <ModalBody p='0' display='flex' alignItems='center' justifyContent='center' position='relative'>
            
            {images.length > 1 && (
              <IconButton
                aria-label='Previous image'
                icon={<AiOutlineLeft size='24px' />}
                position='absolute'
                left='16px'
                top='50%'
                transform='translateY(-50%)'
                zIndex={10}
                onClick={() => scrollToLightboxImage(Math.max(0, selectedImage - 1))}
                isDisabled={selectedImage === 0}
                bg='blackAlpha.600'
                color='white'
                _hover={{ bg: 'blackAlpha.800' }}
                isRound
              />
            )}

            <Flex
              ref={scrollContainerRef}
              w='100vw'
              h='100vh'
              overflowX='auto'
              overflowY='hidden'
              onScroll={handleLightboxScroll}
              sx={{
                scrollSnapType: 'x mandatory',
                '::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
              }}
            >
              {images.map((src, index) => (
                <Flex
                  key={`lightbox-${index}`}
                  minW='100vw'
                  h='100vh'
                  alignItems='center'
                  justifyContent='center'
                  sx={{ scrollSnapAlign: 'start' }}
                  p={{ base: '0', md: '40px' }}
                >
                  <Image
                    src={src}
                    alt={`${info?.name} view ${index + 1}`}
                    objectFit='contain'
                    w='100%'
                    h='100%'
                    fallbackSrc='/placeholder-part.svg'
                  />
                </Flex>
              ))}
            </Flex>

            {images.length > 1 && (
              <IconButton
                aria-label='Next image'
                icon={<AiOutlineRight size='24px' />}
                position='absolute'
                right='16px'
                top='50%'
                transform='translateY(-50%)'
                zIndex={10}
                onClick={() => scrollToLightboxImage(Math.min(images.length - 1, selectedImage + 1))}
                isDisabled={selectedImage === images.length - 1}
                bg='blackAlpha.600'
                color='white'
                _hover={{ bg: 'blackAlpha.800' }}
                isRound
              />
            )}

            {images.length > 1 && (
              <Flex position='absolute' bottom='32px' gap='8px' zIndex={10}>
                {images.map((_, index) => (
                  <Box
                    key={`dot-${index}`}
                    w={index === selectedImage ? '24px' : '8px'}
                    h='8px'
                    borderRadius='full'
                    bg={index === selectedImage ? 'white' : 'whiteAlpha.500'}
                    transition='all 0.2s'
                    cursor='pointer'
                    onClick={() => scrollToLightboxImage(index)}
                  />
                ))}
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default SingleProduct;
