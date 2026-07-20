import * as React from 'react';
import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Select,
  SimpleGrid,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  LockIcon,
  SearchIcon,
  ViewIcon,
  ViewOffIcon,
} from '@chakra-ui/icons';
import { Oswald, Montserrat } from '@next/font/google';
import {
  adminLogin,
  getAdminToken,
  setAdminToken,
  useAdminOrders,
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateOrderStatus,
  useUpdateProduct,
  ProductPayload,
} from '@/hooks/products';
import { productTypes, categoryLabel } from '@/utils/cart';
import Seo from '@/components/Seo';

const oswald = Oswald({
  weight: ['500'],
  style: ['normal'],
  subsets: ['latin'],
});

const montserrat = Montserrat({
  weight: ['400'],
  style: ['normal'],
  subsets: ['latin'],
});

const ACCENT = '#2563eb';
const DARK = '#0f172a';

const emptyForm: ProductPayload = {
  name: '',
  brand: '',
  category: 'engine',
  amount: 0,
  description: '',
  url: '',
  inStock: true,
  quantity: 10,
  gallery: [],
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'yellow',
  confirmed: 'blue',
  delivered: 'green',
  cancelled: 'red',
};

const NEXT_STATUSES: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const Login = ({ onSuccess }: { onSuccess: () => void }) => {
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(password);
      onSuccess();
    } catch {
      toast({ title: 'Invalid password', status: 'error', duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH='100vh'
      alignItems='center'
      justifyContent='center'
      px='16px'
      bgImage="linear-gradient(rgba(20, 22, 26, 0.88), rgba(20, 22, 26, 0.88)), url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1920&q=60')"
      bgSize='cover'
      bgPosition='center'
      className={montserrat.className}>
      <Box
        bg='white'
        w='420px'
        maxW='100%'
        boxShadow='0 24px 60px rgba(0,0,0,0.45)'
        borderTop={`4px solid ${ACCENT}`}
        overflow='hidden'>
        <Box p={{ base: '30px', md: '40px' }}>
          <Flex
            alignItems='center'
            justifyContent='center'
            boxSize='56px'
            bg='#f4f5f7'
            borderRadius='full'
            mb='20px'
            mx='auto'>
            <LockIcon boxSize='22px' color={ACCENT} />
          </Flex>
          <Flex
            flexDir='column'
            alignItems='center'
            mb='6px'
            lineHeight='1'
            className={oswald.className}>
            <Flex alignItems='baseline'>
              <Heading fontSize='24px' textTransform='uppercase'>
                Best
              </Heading>
              <Heading
                fontSize='24px'
                textTransform='uppercase'
                color={ACCENT}
                ml='6px'>
                Qualities
              </Heading>
            </Flex>
            <Text
              fontSize='9px'
              letterSpacing='3.5px'
              color='#64748b'
              textTransform='uppercase'
              mt='6px'>
              Industrial Equipment
            </Text>
          </Flex>
          <Text
            mb='30px'
            color='#5a5a5a'
            fontSize='14px'
            textAlign='center'>
            Admin portal. Sign in to manage your parts catalog.
          </Text>
          <form onSubmit={submit}>
            <FormControl mb='24px'>
              <FormLabel fontSize='13px' fontWeight='600' letterSpacing='0.5px'>
                PASSWORD
              </FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  h='48px'
                  borderRadius='none'
                  focusBorderColor={ACCENT}
                  placeholder='Enter admin password'
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                <InputRightElement h='48px' w='48px'>
                  <IconButton
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    size='sm'
                    variant='ghost'
                    color='gray.500'
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button
              type='submit'
              w='full'
              h='50px'
              bg={DARK}
              color='white'
              fontSize='14px'
              fontWeight='bold'
              letterSpacing='1px'
              borderRadius='none'
              isLoading={loading}
              loadingText='SIGNING IN'
              isDisabled={!password}
              _hover={{ bg: ACCENT }}>
              SIGN IN
            </Button>
          </form>
        </Box>
        <Flex
          bg='#f8f8f8'
          borderTop='1px solid #ececec'
          py='14px'
          justifyContent='center'>
          <Text fontSize='12px' color='#8a8d90'>
            Authorized staff only. Sessions expire after 12 hours.
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default function AdminPortal() {
  const [authed, setAuthed] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const toast = useToast();
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const { data: orders } = useAdminOrders(authed);
  const updateOrderStatus = useUpdateOrderStatus();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = React.useState<ProductPayload>(emptyForm);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [preview, setPreview] = React.useState('');
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    setAuthed(!!getAdminToken());
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  const set = (key: keyof ProductPayload, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPreview('');
    onOpen();
  };

  const openEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      brand: product.brand || '',
      category: product.category || 'accessories',
      amount: product.amount,
      description: product.description || '',
      url: product.url || '',
      inStock: product.inStock !== false,
      quantity: typeof product.quantity === 'number' ? product.quantity : 10,
      gallery: Array.isArray(product.gallery) ? product.gallery : [],
    });
    setPreview(product.url || '');
    onOpen();
  };

  const onFile = async (file?: File | null) => {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      return toast({ title: 'Image must be under 4MB', status: 'error' });
    }
    const dataUrl = await readFileAsDataUrl(file);
    set('image', dataUrl);
    setPreview(dataUrl);
  };

  const onGalleryFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const existing = form.gallery || [];
    const room = 8 - existing.length;
    const added: string[] = [];
    for (const file of Array.from(files).slice(0, room)) {
      if (file.size > 4 * 1024 * 1024) {
        toast({
          title: `"${file.name}" skipped (over 4MB)`,
          status: 'warning',
          duration: 4000,
        });
        continue;
      }
      added.push(await readFileAsDataUrl(file));
    }
    set('gallery', [...existing, ...added]);
  };

  const save = async () => {
    if (!form.name || !form.amount) {
      return toast({
        title: 'Name and price are required',
        status: 'error',
        duration: 4000,
      });
    }
    try {
      if (editingId) {
        await updateProduct.mutateAsync({ ...form, id: editingId });
        toast({ title: 'Product updated', status: 'success', duration: 3000 });
      } else {
        await createProduct.mutateAsync(form);
        toast({ title: 'Product created', status: 'success', duration: 3000 });
      }
      onClose();
    } catch (error: any) {
      if (error?.response?.status === 401) {
        setAdminToken(null);
        setAuthed(false);
        return;
      }
      toast({
        title: 'Save failed',
        description: error?.response?.data?.error || error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const remove = async (product: any) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`))
      return;
    try {
      await deleteProduct.mutateAsync(product.id);
      toast({ title: 'Product deleted', status: 'success', duration: 3000 });
    } catch (error: any) {
      if (error?.response?.status === 401) {
        setAdminToken(null);
        setAuthed(false);
        return;
      }
      toast({ title: 'Delete failed', status: 'error', duration: 4000 });
    }
  };

  const changeOrderStatus = async (id: string, status: string) => {
    try {
      await updateOrderStatus.mutateAsync({ id, status });
      toast({
        title: `Order ${status}`,
        description:
          status === 'confirmed'
            ? 'Stock levels have been updated.'
            : undefined,
        status: 'success',
        duration: 3000,
      });
    } catch (error: any) {
      if (error?.response?.status === 401) {
        setAdminToken(null);
        setAuthed(false);
        return;
      }
      toast({
        title: 'Update failed',
        description: error?.response?.data?.error || error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const pendingCount = (orders || []).filter(
    (order: any) => order.status === 'pending'
  ).length;

  const filtered = (products || []).filter((product: any) =>
    `${product.name} ${product.brand || ''} ${product.sku || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalValue = (products || []).reduce(
    (acc: number, product: any) => acc + (Number(product.amount) || 0),
    0
  );

  return (
    <Box minH='100vh' bg='#f4f5f7' className={montserrat.className} pb='60px'>
      <Seo title='Admin Portal' path='/admin' noIndex />
      <Flex
        bg={DARK}
        color='white'
        px={{ base: '16px', lg: '40px' }}
        py='16px'
        alignItems='center'
        justifyContent='space-between'>
        <Flex alignItems='center' className={oswald.className}>
          <Flex flexDir='column' lineHeight='1'>
            <Flex alignItems='baseline'>
              <Text fontSize='18px' textTransform='uppercase'>
                Best
              </Text>
              <Text
                fontSize='18px'
                textTransform='uppercase'
                color={ACCENT}
                ml='5px'>
                Qualities
              </Text>
            </Flex>
            <Text
              fontSize='7px'
              letterSpacing='2.6px'
              color='#b9bcbf'
              textTransform='uppercase'
              mt='3px'>
              Industrial Equipment
            </Text>
          </Flex>
          <Text fontSize='13px' ml='16px' color='#b9bcbf'>
            ADMIN PORTAL
          </Text>
        </Flex>
        <Button
          size='sm'
          variant='outline'
          color='white'
          borderRadius='none'
          _hover={{ bg: 'rgba(255,255,255,0.1)' }}
          onClick={() => {
            setAdminToken(null);
            setAuthed(false);
          }}>
          Sign out
        </Button>
      </Flex>

      <Box px={{ base: '16px', lg: '40px' }} pt='30px'>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing='20px' mb='30px'>
          <Stat bg='white' p='20px' boxShadow='0 2px 8px rgba(0,0,0,0.05)'>
            <StatLabel>Total products</StatLabel>
            <StatNumber className={oswald.className}>
              {products?.length ?? '-'}
            </StatNumber>
          </Stat>
          <Stat bg='white' p='20px' boxShadow='0 2px 8px rgba(0,0,0,0.05)'>
            <StatLabel>Pending orders</StatLabel>
            <StatNumber className={oswald.className} color={ACCENT}>
              {orders ? pendingCount : '-'}
            </StatNumber>
          </Stat>
          <Stat bg='white' p='20px' boxShadow='0 2px 8px rgba(0,0,0,0.05)'>
            <StatLabel>In stock</StatLabel>
            <StatNumber className={oswald.className}>
              {products
                ? products.filter((p: any) => p.inStock !== false).length
                : '-'}
            </StatNumber>
          </Stat>
          <Stat bg='white' p='20px' boxShadow='0 2px 8px rgba(0,0,0,0.05)'>
            <StatLabel>Catalog value</StatLabel>
            <StatNumber className={oswald.className}>
              ₦{totalValue.toLocaleString()}
            </StatNumber>
          </Stat>
        </SimpleGrid>

        <Tabs colorScheme='blue' variant='enclosed' bg='transparent'>
          <TabList mb='20px'>
            <Tab fontWeight='600'>Products</Tab>
            <Tab fontWeight='600'>
              Orders
              {pendingCount > 0 && (
                <Badge ml='8px' colorScheme='yellow' borderRadius='full'>
                  {pendingCount}
                </Badge>
              )}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel p='0'>
        <Flex
          mb='20px'
          justifyContent='space-between'
          alignItems={{ base: 'stretch', md: 'center' }}
          flexDir={{ base: 'column', md: 'row' }}
          gap='12px'>
          <InputGroup maxW={{ base: '100%', md: '360px' }} bg='white'>
            <InputLeftElement pointerEvents='none'>
              <SearchIcon color='gray.400' />
            </InputLeftElement>
            <Input
              placeholder='Search by name, brand or SKU...'
              borderRadius='none'
              focusBorderColor={ACCENT}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          <Button
            leftIcon={<AddIcon />}
            bg={ACCENT}
            color='white'
            borderRadius='none'
            _hover={{ opacity: 0.85 }}
            onClick={openCreate}>
            Add product
          </Button>
        </Flex>

        {isLoading ? (
          <Skeleton height='400px' />
        ) : (
          <TableContainer bg='white' boxShadow='0 2px 8px rgba(0,0,0,0.05)'>
            <Table size='md'>
              <Thead bg='#fafafa'>
                <Tr>
                  <Th>Product</Th>
                  <Th>Brand</Th>
                  <Th>Category</Th>
                  <Th>SKU</Th>
                  <Th isNumeric>Price</Th>
                  <Th>Status</Th>
                  <Th textAlign='right'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map((product: any) => (
                  <Tr key={product.id}>
                    <Td>
                      <Flex alignItems='center' gap='12px'>
                        <Image
                          src={product.url}
                          alt={product.name}
                          boxSize='44px'
                          objectFit='cover'
                          borderRadius='4px'
                          fallbackSrc='/placeholder-part.svg'
                        />
                        <Text fontWeight='600' fontSize='14px' maxW='260px' noOfLines={2}>
                          {product.name}
                        </Text>
                      </Flex>
                    </Td>
                    <Td fontSize='14px'>{product.brand || '-'}</Td>
                    <Td fontSize='14px'>{categoryLabel(product.category)}</Td>
                    <Td fontSize='13px' color='gray.500'>
                      {product.sku || '-'}
                    </Td>
                    <Td isNumeric fontWeight='600'>
                      ₦{Number(product.amount).toLocaleString()}
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={
                          product.inStock === false
                            ? 'red'
                            : (product.quantity ?? 99) <= 3
                            ? 'orange'
                            : 'green'
                        }
                        borderRadius='none'>
                        {product.inStock === false
                          ? 'Out of stock'
                          : typeof product.quantity === 'number'
                          ? `${product.quantity} in stock${
                              product.quantity <= 3 ? ' (low)' : ''
                            }`
                          : 'In stock'}
                      </Badge>
                    </Td>
                    <Td>
                      <Flex justifyContent='flex-end' gap='8px'>
                        <IconButton
                          aria-label='edit product'
                          icon={<EditIcon />}
                          size='sm'
                          variant='outline'
                          borderRadius='none'
                          onClick={() => openEdit(product)}
                        />
                        <IconButton
                          aria-label='delete product'
                          icon={<DeleteIcon />}
                          size='sm'
                          colorScheme='red'
                          variant='outline'
                          borderRadius='none'
                          onClick={() => remove(product)}
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {filtered.length === 0 && (
              <Text p='40px' textAlign='center' color='gray.500'>
                No products found.
              </Text>
            )}
          </TableContainer>
        )}
            </TabPanel>

            <TabPanel p='0'>
              <TableContainer bg='white' boxShadow='0 2px 8px rgba(0,0,0,0.05)'>
                <Table size='md'>
                  <Thead bg='#fafafa'>
                    <Tr>
                      <Th>Reference</Th>
                      <Th>Date</Th>
                      <Th>Items</Th>
                      <Th isNumeric>Total</Th>
                      <Th>Status</Th>
                      <Th textAlign='right'>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {(orders || []).map((order: any) => (
                      <Tr key={order.id}>
                        <Td fontSize='13px' fontWeight='600'>
                          {order.reference}
                        </Td>
                        <Td fontSize='13px' color='gray.600'>
                          {new Date(order.createdAt).toLocaleString()}
                        </Td>
                        <Td fontSize='13px' maxW='320px'>
                          <Text noOfLines={2} whiteSpace='normal'>
                            {order.items
                              .map(
                                (item: any) => `${item.name} x${item.quantity}`
                              )
                              .join(', ')}
                          </Text>
                        </Td>
                        <Td isNumeric fontWeight='600'>
                          ₦{Number(order.total).toLocaleString()}
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={STATUS_COLORS[order.status] || 'gray'}
                            borderRadius='full'
                            px='10px'>
                            {order.status}
                          </Badge>
                        </Td>
                        <Td>
                          <Flex justifyContent='flex-end' gap='8px'>
                            {(NEXT_STATUSES[order.status] || []).map(
                              (status) => (
                                <Button
                                  key={status}
                                  size='xs'
                                  borderRadius='6px'
                                  colorScheme={STATUS_COLORS[status] || 'gray'}
                                  variant={
                                    status === 'cancelled' ? 'outline' : 'solid'
                                  }
                                  isLoading={updateOrderStatus.isLoading}
                                  onClick={() =>
                                    changeOrderStatus(order.id, status)
                                  }>
                                  Mark {status}
                                </Button>
                              )
                            )}
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                {(orders || []).length === 0 && (
                  <Text p='40px' textAlign='center' color='gray.500'>
                    No orders yet. Orders placed through the website appear
                    here.
                  </Text>
                )}
              </TableContainer>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent borderRadius='none' className={montserrat.className}>
          <ModalHeader className={oswald.className}>
            {editingId ? 'Edit product' : 'Add new product'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing='16px' mb='16px'>
              <FormControl isRequired>
                <FormLabel fontSize='14px'>Product name</FormLabel>
                <Input
                  borderRadius='none'
                  focusBorderColor={ACCENT}
                  value={form.name || ''}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder='e.g. Ceramic Brake Pad Set'
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize='14px'>Brand</FormLabel>
                <Input
                  borderRadius='none'
                  focusBorderColor={ACCENT}
                  value={form.brand || ''}
                  onChange={(e) => set('brand', e.target.value)}
                  placeholder='e.g. Bosch'
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize='14px'>Price (₦)</FormLabel>
                <NumberInput
                  min={0}
                  value={form.amount || ''}
                  onChange={(value) => set('amount', Number(value))}>
                  <NumberInputField
                    borderRadius='none'
                    placeholder='0.00'
                  />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel fontSize='14px'>Category</FormLabel>
                <Select
                  borderRadius='none'
                  focusBorderColor={ACCENT}
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}>
                  {productTypes.map((type: any) => (
                    <option value={type.value} key={type.value}>
                      {type.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>
            <FormControl mb='16px'>
              <FormLabel fontSize='14px'>Description</FormLabel>
              <Textarea
                borderRadius='none'
                focusBorderColor={ACCENT}
                rows={3}
                value={form.description || ''}
                onChange={(e) => set('description', e.target.value)}
                placeholder='What the part does, what it fits, what is included...'
              />
            </FormControl>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing='16px' mb='16px'>
              <Box>
                <FormControl mb='12px'>
                  <FormLabel fontSize='14px'>Upload image</FormLabel>
                  <Input
                    type='file'
                    accept='image/png,image/jpeg,image/webp'
                    border='none'
                    px='0'
                    onChange={(e) => onFile(e.target.files?.[0])}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize='14px'>...or image URL</FormLabel>
                  <Input
                    borderRadius='none'
                    focusBorderColor={ACCENT}
                    value={form.url || ''}
                    onChange={(e) => {
                      set('url', e.target.value);
                      set('image', undefined);
                      setPreview(e.target.value);
                    }}
                    placeholder='https://...'
                  />
                </FormControl>
                <FormControl mt='16px'>
                  <FormLabel fontSize='14px'>Stock quantity</FormLabel>
                  <NumberInput
                    min={0}
                    value={form.quantity ?? ''}
                    onChange={(value) =>
                      set('quantity', Math.max(0, Number(value) || 0))
                    }>
                    <NumberInputField borderRadius='none' placeholder='0' />
                  </NumberInput>
                  <Text fontSize='12px' color='gray.500' mt='4px'>
                    0 marks the product out of stock
                  </Text>
                </FormControl>
              </Box>
              <Flex
                border='1px dashed #d0d0d0'
                alignItems='center'
                justifyContent='center'
                minH='160px'>
                {preview ? (
                  <Image
                    src={preview}
                    alt='preview'
                    maxH='160px'
                    objectFit='contain'
                  />
                ) : (
                  <Text fontSize='13px' color='gray.400'>
                    Image preview
                  </Text>
                )}
              </Flex>
            </SimpleGrid>
            <FormControl mb='8px'>
              <FormLabel fontSize='14px'>
                Gallery images (other views, up to 8)
              </FormLabel>
              <Input
                type='file'
                accept='image/png,image/jpeg,image/webp'
                multiple
                border='none'
                px='0'
                onChange={(e) => onGalleryFiles(e.target.files)}
              />
              {(form.gallery || []).length > 0 && (
                <Flex gap='10px' mt='10px' flexWrap='wrap'>
                  {(form.gallery || []).map((src: string, index: number) => (
                    <Box key={index} position='relative'>
                      <Image
                        src={src}
                        alt={`gallery ${index + 1}`}
                        boxSize='72px'
                        objectFit='cover'
                        borderRadius='6px'
                        border='1px solid #e4e5e7'
                        fallbackSrc='/placeholder-part.svg'
                      />
                      <IconButton
                        aria-label='remove gallery image'
                        icon={<DeleteIcon boxSize='10px' />}
                        size='xs'
                        colorScheme='red'
                        position='absolute'
                        top='-8px'
                        right='-8px'
                        borderRadius='full'
                        onClick={() =>
                          set(
                            'gallery',
                            (form.gallery || []).filter(
                              (_: string, i: number) => i !== index
                            )
                          )
                        }
                      />
                    </Box>
                  ))}
                </Flex>
              )}
              <Text fontSize='12px' color='gray.500' mt='6px'>
                Shoppers can click these on the product page to switch the main
                view.
              </Text>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr='12px' borderRadius='none' onClick={onClose}>
              Cancel
            </Button>
            <Button
              bg={ACCENT}
              color='white'
              borderRadius='none'
              _hover={{ opacity: 0.85 }}
              isLoading={createProduct.isLoading || updateProduct.isLoading}
              onClick={save}>
              {editingId ? 'Save changes' : 'Create product'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
