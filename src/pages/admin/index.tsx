import * as React from 'react';
import {
  Badge,
  Box,
  Button,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import {
  getAdminToken,
  setAdminToken,
  useAdminOrders,
  useCreateProduct,
  useDeleteProduct,
  useBulkDeleteProducts,
  useProducts,
  useUpdateOrderStatus,
  useUpdateProduct,
  ProductPayload,
} from '@/hooks/products';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  CategoryPayload,
} from '@/hooks/categories';
import Seo from '@/components/Seo';

import { AdminLogin } from '@/components/admin/AdminLogin';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { ProductTable } from '@/components/admin/ProductTable';
import { OrderTable } from '@/components/admin/OrderTable';
import { ProductFormModal } from '@/components/admin/ProductFormModal';
import { DeleteModal } from '@/components/admin/DeleteModal';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { CategoryTable } from '@/components/admin/CategoryTable';
import { CategoryFormModal } from '@/components/admin/CategoryFormModal';
import { EnquiryTable } from '@/components/admin/EnquiryTable';
import { useAdminEnquiries, useUpdateEnquiryStatus } from '@/hooks/enquiries';

const ACCENT = '#2563eb';
const DARK = '#0f172a';

const emptyForm: ProductPayload = {
  name: '',
  brand: '',
  category: '',
  amount: 0,
  description: '',
  url: '',
  inStock: true,
  quantity: 10,
  gallery: [],
};

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function AdminPortal() {
  const [authed, setAuthed] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const toast = useToast();
  
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const bulkDeleteProducts = useBulkDeleteProducts();
  
  const { data: orders } = useAdminOrders(authed);
  const updateOrderStatus = useUpdateOrderStatus();

  const { data: enquiries, isLoading: isEnquiriesLoading } = useAdminEnquiries(authed);
  const updateEnquiryStatus = useUpdateEnquiryStatus();

  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [form, setFormState] = React.useState<ProductPayload>(emptyForm);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [preview, setPreview] = React.useState('');
  
  const [search, setSearch] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = React.useState<{ type: 'single'; product: any } | { type: 'bulk' } | null>(null);

  const { isOpen: isCatOpen, onOpen: onCatOpen, onClose: onCatClose } = useDisclosure();
  const [catForm, setCatFormState] = React.useState<CategoryPayload>({ name: '', value: '', image: '' });
  const [editingCatId, setEditingCatId] = React.useState<string | null>(null);
  const [catPreview, setCatPreview] = React.useState('');
  const [catSearch, setCatSearch] = React.useState('');

  React.useEffect(() => {
    setAuthed(!!getAdminToken());
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  const setForm = (key: keyof ProductPayload, value: any) =>
    setFormState((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setEditingId(null);
    setFormState({ ...emptyForm, category: categories?.[0]?.value || '' });
    setPreview('');
    onOpen();
  };

  const openEdit = (product: any) => {
    setEditingId(product.id);
    setFormState({
      name: product.name,
      brand: product.brand || '',
      category: product.category || categories?.[0]?.value || '',
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
    setForm('image', dataUrl);
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
    setForm('gallery', [...existing, ...added]);
  };

  const save = async () => {
    if (!form.name || !form.amount) {
      return toast({
        title: 'Name and price are required',
        status: 'error',
        duration: 4000,
      });
    }
    if (!form.category || !categories?.find((c: any) => c.value === form.category)) {
      return toast({
        title: 'Please select a valid category',
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

  const setCatForm = (key: keyof CategoryPayload, value: any) =>
    setCatFormState((prev) => ({ ...prev, [key]: value }));

  const openCreateCat = () => {
    setEditingCatId(null);
    setCatFormState({ name: '', value: '', image: '' });
    setCatPreview('');
    onCatOpen();
  };

  const openEditCat = (cat: any) => {
    setEditingCatId(cat.id);
    setCatFormState({ name: cat.name, value: cat.value, image: cat.image });
    setCatPreview(cat.image || '');
    onCatOpen();
  };

  const onCatFile = async (file?: File | null) => {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      return toast({ title: 'Image must be under 4MB', status: 'error' });
    }
    const dataUrl = await readFileAsDataUrl(file);
    setCatForm('fileImage', dataUrl);
    setCatPreview(dataUrl);
  };

  const saveCat = async () => {
    if (!catForm.name) {
      return toast({ title: 'Name is required', status: 'error' });
    }
    try {
      if (editingCatId) {
        await updateCategory.mutateAsync({ ...catForm, id: editingCatId });
        toast({ title: 'Category updated', status: 'success' });
      } else {
        await createCategory.mutateAsync(catForm);
        toast({ title: 'Category created', status: 'success' });
      }
      onCatClose();
    } catch (error: any) {
      toast({
        title: 'Save failed',
        description: error?.response?.data?.error || error.message,
        status: 'error',
      });
    }
  };

  const removeCat = async (cat: any) => {
    if (window.confirm(`Are you sure you want to delete ${cat.name}?`)) {
      try {
        await deleteCategory.mutateAsync(cat.id);
        toast({ title: 'Category deleted', status: 'success' });
      } catch (error: any) {
        toast({ title: 'Delete failed', status: 'error' });
      }
    }
  };

  const remove = (product: any) => {
    setDeleteTarget({ type: 'single', product });
  };

  const removeSelected = () => {
    setDeleteTarget({ type: 'bulk' });
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'single') {
        await deleteProduct.mutateAsync(deleteTarget.product.id);
        toast({ title: 'Product deleted', status: 'success', duration: 3000 });
      } else {
        await bulkDeleteProducts.mutateAsync(selectedIds);
        toast({ title: 'Products deleted', status: 'success', duration: 3000 });
        setSelectedIds([]);
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        setAdminToken(null);
        setAuthed(false);
      } else {
        toast({ title: 'Delete failed', status: 'error', duration: 4000 });
      }
    } finally {
      setDeleteTarget(null);
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

  const unhandledEnquiryCount = (enquiries || []).filter(
    (e: any) => e.status === 'new'
  ).length;

  const changeEnquiryStatus = async (id: string, status: string) => {
    try {
      await updateEnquiryStatus.mutateAsync({ id, status });
      toast({ title: 'Enquiry updated', status: 'success', duration: 3000 });
    } catch (error: any) {
      if (error?.response?.status === 401) {
        setAdminToken(null);
        setAuthed(false);
        return;
      }
      toast({ title: 'Update failed', status: 'error', duration: 4000 });
    }
  };

  const filtered = (products || []).filter((product: any) =>
    `${product.name} ${product.brand || ''} ${product.sku || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalValue = (products || []).reduce(
    (acc: number, product: any) => acc + (Number(product.amount) || 0),
    0
  );

  const filteredCats = (categories || []).filter((c: any) =>
    `${c.name} ${c.value}`.toLowerCase().includes(catSearch.toLowerCase())
  );

  return (
    <Box minH='100vh' bg='#f4f5f7' className={"font-montserrat"} pb='60px'>
      <Seo title='Admin Portal' path='/admin' noIndex />
      <Flex
        bg={DARK}
        color='white'
        px={{ base: '16px', lg: '40px' }}
        py='16px'
        alignItems='center'
        justifyContent='space-between'>
        <Flex alignItems='center' className={"font-oswald"}>
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
        <DashboardStats
          products={products || []}
          orders={orders || []}
          pendingCount={pendingCount}
          totalValue={totalValue}
          enquiryCount={unhandledEnquiryCount}
        />

        <Tabs colorScheme='blue' variant='enclosed' bg='transparent'>
          <TabList mb='20px'>
            <Tab fontWeight='600'>Overview</Tab>
            <Tab fontWeight='600'>Products</Tab>
            <Tab fontWeight='600'>Categories</Tab>
            <Tab fontWeight='600'>
              Orders
              {pendingCount > 0 && (
                <Badge ml='8px' colorScheme='yellow' borderRadius='full'>
                  {pendingCount}
                </Badge>
              )}
            </Tab>
            <Tab fontWeight='600'>
              Enquiries
              {unhandledEnquiryCount > 0 && (
                <Badge ml='8px' colorScheme='red' borderRadius='full'>
                  {unhandledEnquiryCount}
                </Badge>
              )}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel p='0'>
              <AnalyticsDashboard orders={orders || []} />
            </TabPanel>

            <TabPanel p='0'>
              <ProductTable
                isLoading={isLoading}
                products={products || []}
                categories={categories || []}
                filtered={filtered}
                search={search}
                setSearch={setSearch}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                removeSelected={removeSelected}
                openCreate={openCreate}
                openEdit={openEdit}
                remove={remove}
                isBulkDeleting={bulkDeleteProducts.isLoading}
              />
            </TabPanel>

            <TabPanel p='0'>
              <CategoryTable
                isLoading={isCategoriesLoading}
                categories={categories || []}
                filtered={filteredCats}
                search={catSearch}
                setSearch={setCatSearch}
                openCreate={openCreateCat}
                openEdit={openEditCat}
                remove={removeCat}
              />
            </TabPanel>

            <TabPanel p='0'>
              <OrderTable
                orders={orders || []}
                changeOrderStatus={changeOrderStatus}
                isUpdating={updateOrderStatus.isLoading}
              />
            </TabPanel>

            <TabPanel p='0'>
              <EnquiryTable
                enquiries={enquiries || []}
                isLoading={isEnquiriesLoading}
                markHandled={(id) => changeEnquiryStatus(id, 'handled')}
                isUpdating={updateEnquiryStatus.isLoading}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <ProductFormModal
        isOpen={isOpen}
        onClose={onClose}
        editingId={editingId}
        form={form}
        setForm={setForm}
        preview={preview}
        setPreview={setPreview}
        onFile={onFile}
        onGalleryFiles={onGalleryFiles}
        save={save}
        isSaving={createProduct.isLoading || updateProduct.isLoading}
        categories={categories || []}
      />

      <CategoryFormModal
        isOpen={isCatOpen}
        onClose={onCatClose}
        editingId={editingCatId}
        form={catForm}
        setForm={setCatForm}
        preview={catPreview}
        setPreview={setCatPreview}
        onFile={onCatFile}
        save={saveCat}
        isSaving={createCategory.isLoading || updateCategory.isLoading}
      />

      <DeleteModal
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        selectedIds={selectedIds}
        products={products || []}
        executeDelete={executeDelete}
        isDeleting={deleteProduct.isLoading || bulkDeleteProducts.isLoading}
      />
    </Box>
  );
}
