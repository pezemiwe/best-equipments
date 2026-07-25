import Layout from '@/components/layout';
import {
  Button,
  Checkbox,
  Flex,
  Text,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  Skeleton,
  Spinner,
  Switch,
  Tag,
  TagCloseButton,
  TagLabel,
  useDisclosure,
} from '@chakra-ui/react';
import * as React from 'react';
import { Montserrat, Oswald } from '@next/font/google';
import { useRouter } from 'next/router';
import { AiOutlineBars, AiOutlineSearch } from 'react-icons/ai';
import MobileFilter from '@/components/mobileFilter';
import ProductTile from '@/components/ProductTile';
import Seo from '@/components/Seo';
import { useProducts } from '@/hooks/products';
import { productTypes, categoryLabel } from '@/utils/cart';
import { searchAndSort, sortOptions, SortOption } from '@/utils/search';

const montserrat = Montserrat({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

const oswald = Oswald({
  weight: ['500'],
  style: ['normal'],
  subsets: ['latin'],
});

const ACCENT = '#2563eb';

const formatNaira = (value: number) =>
  value >= 1000 ? `₦${Math.round(value / 1000)}k` : `₦${value}`;

export interface StoreFilters {
  categories: string[];
  brands: string[];
  priceRange: [number, number] | null;
  inStockOnly: boolean;
  maxPrice: number;
  categoryCounts: Record<string, number>;
  brandOptions: { name: string; count: number }[];
  toggleCategory: (value: string) => void;
  toggleBrand: (value: string) => void;
  setPriceRange: (range: [number, number] | null) => void;
  setInStockOnly: (value: boolean) => void;
  clearAll: () => void;
}

export const FilterPanel = ({ filters }: { filters: StoreFilters }) => {
  const [draftRange, setDraftRange] = React.useState<[number, number] | null>(
    null
  );
  const shownRange = draftRange ||
    filters.priceRange || [0, filters.maxPrice];

  return (
    <Flex flexDir='column'>
      <Text mb='12px' fontSize='17px' className={oswald.className}>
        Category
      </Text>
      <Flex flexDir='column' mb='24px'>
        {productTypes.map((type: any) => (
          <Checkbox
            key={type.value}
            mb='8px'
            colorScheme='blue'
            isChecked={filters.categories.includes(type.value)}
            onChange={() => filters.toggleCategory(type.value)}>
            <Flex fontSize='14px' alignItems='center' gap='6px'>
              {type.name}
              <Text as='span' color='#9a9a9a' fontSize='12px'>
                ({filters.categoryCounts[type.value] || 0})
              </Text>
            </Flex>
          </Checkbox>
        ))}
      </Flex>

      {filters.brandOptions.length > 0 && (
        <>
          <Text mb='12px' fontSize='17px' className={oswald.className}>
            Brand
          </Text>
          <Flex flexDir='column' mb='24px' maxH='220px' overflowY='auto'>
            {filters.brandOptions.map((brand) => (
              <Checkbox
                key={brand.name}
                mb='8px'
                colorScheme='blue'
                isChecked={filters.brands.includes(brand.name)}
                onChange={() => filters.toggleBrand(brand.name)}>
                <Flex fontSize='14px' alignItems='center' gap='6px'>
                  {brand.name}
                  <Text as='span' color='#9a9a9a' fontSize='12px'>
                    ({brand.count})
                  </Text>
                </Flex>
              </Checkbox>
            ))}
          </Flex>
        </>
      )}

      <Text mb='8px' fontSize='17px' className={oswald.className}>
        Price
      </Text>
      <Flex justifyContent='space-between' fontSize='13px' color='#5a5a5a'>
        <Text>{formatNaira(shownRange[0])}</Text>
        <Text>{formatNaira(shownRange[1])}</Text>
      </Flex>
      <RangeSlider
        aria-label={['minimum price', 'maximum price']}
        min={0}
        max={filters.maxPrice}
        step={5000}
        value={shownRange}
        onChange={(value) => setDraftRange(value as [number, number])}
        onChangeEnd={(value) => {
          setDraftRange(null);
          const range = value as [number, number];
          filters.setPriceRange(
            range[0] === 0 && range[1] === filters.maxPrice ? null : range
          );
        }}
        mb='24px'>
        <RangeSliderTrack bg='#e4e5e7'>
          <RangeSliderFilledTrack bg={ACCENT} />
        </RangeSliderTrack>
        <RangeSliderThumb index={0} boxShadow='0 1px 4px rgba(0,0,0,0.3)' />
        <RangeSliderThumb index={1} boxShadow='0 1px 4px rgba(0,0,0,0.3)' />
      </RangeSlider>

      <Flex alignItems='center' justifyContent='space-between' mb='24px'>
        <Text fontSize='14px'>In stock only</Text>
        <Switch
          colorScheme='blue'
          isChecked={filters.inStockOnly}
          onChange={(e) => filters.setInStockOnly(e.target.checked)}
        />
      </Flex>

      <Button
        variant='outline'
        borderRadius='6px'
        size='sm'
        onClick={filters.clearAll}>
        Clear all filters
      </Button>
    </Flex>
  );
};

export const Store = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: products, isLoading } = useProducts();
  const router = useRouter();

  const [search, setSearch] = React.useState('');
  const [categories, setCategories] = React.useState<string[]>([]);
  const [brands, setBrands] = React.useState<string[]>([]);
  const [priceRange, setPriceRange] = React.useState<[number, number] | null>(
    null
  );
  const [inStockOnly, setInStockOnly] = React.useState(false);
  const [sort, setSort] = React.useState<SortOption>('relevance');
  const PAGE_SIZE = 12;
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  // Preselect filters when arriving from links like /store?category=brakes
  React.useEffect(() => {
    const category = router.query.category;
    if (typeof category === 'string' && category) {
      setCategories([category]);
    }
    const query = router.query.search;
    if (typeof query === 'string' && query) {
      setSearch(query);
    }
  }, [router.query.category, router.query.search]);

  // Reset pagination whenever the result set changes
  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, categories, brands, priceRange, inStockOnly, sort]);

  // Infinite scroll: load the next page when the sentinel enters the viewport
  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((count) => count + PAGE_SIZE);
        }
      },
      { rootMargin: '400px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  });

  const maxPrice = React.useMemo(() => {
    const top = Math.max(
      0,
      ...(products || []).map((item: any) => Number(item.amount) || 0)
    );
    return Math.max(50000, Math.ceil(top / 50000) * 50000);
  }, [products]);

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of products || []) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [products]);

  const brandOptions = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of products || []) {
      if (item.brand) counts[item.brand] = (counts[item.brand] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [products]);

  const toggleCategory = (value: string) =>
    setCategories((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );

  const toggleBrand = (value: string) =>
    setBrands((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );

  const clearAll = () => {
    setCategories([]);
    setBrands([]);
    setPriceRange(null);
    setInStockOnly(false);
    setSearch('');
  };

  const filters: StoreFilters = {
    categories,
    brands,
    priceRange,
    inStockOnly,
    maxPrice,
    categoryCounts,
    brandOptions,
    toggleCategory,
    toggleBrand,
    setPriceRange,
    setInStockOnly,
    clearAll,
  };

  const filtered = React.useMemo(() => {
    const base = (products || []).filter((item: any) => {
      if (categories.length && !categories.includes(item.category))
        return false;
      if (brands.length && !brands.includes(item.brand)) return false;
      if (priceRange) {
        const amount = Number(item.amount) || 0;
        if (amount < priceRange[0] || amount > priceRange[1]) return false;
      }
      if (inStockOnly && item.inStock === false) return false;
      return true;
    });
    return searchAndSort(base, search, sort);
  }, [products, search, categories, brands, priceRange, inStockOnly, sort]);

  const visible = filtered.slice(0, visibleCount);

  const activeChips: { label: string; onRemove: () => void }[] = [
    ...(search
      ? [{ label: `"${search}"`, onRemove: () => setSearch('') }]
      : []),
    ...categories.map((value) => ({
      label: categoryLabel(value),
      onRemove: () => toggleCategory(value),
    })),
    ...brands.map((value) => ({
      label: value,
      onRemove: () => toggleBrand(value),
    })),
    ...(priceRange
      ? [
          {
            label: `${formatNaira(priceRange[0])} - ${formatNaira(
              priceRange[1]
            )}`,
            onRemove: () => setPriceRange(null),
          },
        ]
      : []),
    ...(inStockOnly
      ? [{ label: 'In stock', onRemove: () => setInStockOnly(false) }]
      : []),
  ];

  return (
    <>
      <Seo
        title='Shop Vehicle Parts Online'
        description='Browse belts, bearings, chains, seals, excavator and drilling parts, and car care products from trusted brands. Naira prices, nationwide delivery.'
        path='/store'
      />
      <Layout>
        <Flex
          w='100%'
          maxWidth='1224px'
          color='#2e2e2e'
          fontSize='16px'
          className={montserrat.className}
          mt='120px'
          px={{
            base: '16px',
            lg: '0px',
          }}
          flexDir='column'>
          <Flex
            w='100%'
            mb='24px'
            alignItems={{ base: 'stretch', lg: 'center' }}
            justifyContent='space-between'
            flexDir={{ base: 'column', lg: 'row' }}
            gap='16px'>
            <Text
              fontSize={{ base: '26px', lg: '34px' }}
              className={oswald.className}
              textTransform='uppercase'>
              Vehicle Parts Store
            </Text>
            <InputGroup maxW={{ base: '100%', lg: '380px' }}>
              <InputLeftElement pointerEvents='none' h='48px'>
                <AiOutlineSearch color='#9a9a9a' size='20px' />
              </InputLeftElement>
              <Input
                placeholder='Search parts or brands...'
                height='48px'
                borderRadius='6px'
                value={search}
                focusBorderColor={ACCENT}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </Flex>

          <Flex flexDir={{ base: 'column', lg: 'row' }}>
            <Flex
              display={{ base: 'flex', lg: 'none' }}
              mb='20px'
              onClick={onOpen}
              cursor='pointer'
              alignItems='center'>
              <AiOutlineBars size='24px' />
              <Text ml='10px' fontSize='18px'>
                Filters{activeChips.length > 0 && ` (${activeChips.length})`}
              </Text>
            </Flex>

            <Flex
              w='25%'
              minW='230px'
              mr='30px'
              flexDir='column'
              display={{ base: 'none', lg: 'flex' }}>
              <FilterPanel filters={filters} />
            </Flex>

            <Flex flex='1' overflow='auto' w='100%' flexDir='column'>
              {activeChips.length > 0 && (
                <Flex gap='8px' mb='14px' flexWrap='wrap' alignItems='center'>
                  {activeChips.map((chip) => (
                    <Tag
                      key={chip.label}
                      size='md'
                      borderRadius='full'
                      variant='subtle'
                      colorScheme='blue'>
                      <TagLabel fontSize='13px'>{chip.label}</TagLabel>
                      <TagCloseButton onClick={chip.onRemove} />
                    </Tag>
                  ))}
                  <Button
                    variant='link'
                    size='sm'
                    color='#7a7a7a'
                    onClick={clearAll}>
                    Clear all
                  </Button>
                </Flex>
              )}
              <Flex
                mb='20px'
                alignItems='center'
                justifyContent='space-between'
                gap='12px'
                flexWrap='wrap'>
                <Text fontSize='14px' color='#7a7a7a'>
                  {isLoading
                    ? 'Loading parts...'
                    : `${filtered.length} part${
                        filtered.length === 1 ? '' : 's'
                      } found`}
                </Text>
                <Select
                  maxW='220px'
                  size='sm'
                  borderRadius='6px'
                  focusBorderColor={ACCENT}
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}>
                  {sortOptions.map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Flex>
              {isLoading ? (
                <SimpleGrid
                  spacing='14px'
                  columns={{ base: 2, sm: 2, md: 3, lg: 4 }}
                  w='100%'
                  mb='100px'>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} height='300px' borderRadius='8px' />
                  ))}
                </SimpleGrid>
              ) : filtered.length === 0 ? (
                <Flex
                  flexDir='column'
                  alignItems='center'
                  py='80px'
                  mb='100px'>
                  <Text fontSize='20px' mb='10px' className={oswald.className}>
                    No parts match your filters
                  </Text>
                  <Text fontSize='14px' color='#7a7a7a' mb='20px'>
                    Try removing a filter or changing your search term.
                  </Text>
                  <Button
                    bg='#0f172a'
                    color='#fff'
                    borderRadius='6px'
                    _hover={{ bg: ACCENT }}
                    onClick={clearAll}>
                    CLEAR ALL FILTERS
                  </Button>
                </Flex>
              ) : (
                <Flex flexDir='column' mb='100px'>
                  <SimpleGrid
                    spacing='14px'
                    columns={{ base: 2, sm: 2, md: 3, lg: 4 }}
                    w='100%'>
                    {visible.map((item: any) => (
                      <ProductTile item={item} key={item.id} />
                    ))}
                  </SimpleGrid>
                  {visibleCount < filtered.length && (
                    <Flex
                      ref={sentinelRef}
                      alignItems='center'
                      justifyContent='center'
                      py='30px'
                      gap='10px'>
                      <Spinner size='sm' color={ACCENT} />
                      <Text fontSize='14px' color='#7a7a7a'>
                        Loading more parts...
                      </Text>
                    </Flex>
                  )}
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Layout>
      <MobileFilter isOpen={isOpen} onClose={onClose} filters={filters} />
    </>
  );
};

export default Store;
