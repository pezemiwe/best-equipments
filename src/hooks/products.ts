import { Product } from '@/pages/api/products';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const mainPath = '/api/products';
const adminPath = '/api/admin/products';

const getProducts = async () => {
  const { data } = await axios.get(mainPath);
  return data || [];
};

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: [mainPath],
    queryFn: getProducts,
  });
};

export const useProduct = (id: string) => {
  return useQuery<Product>({
    queryKey: [mainPath, id],
    queryFn: async () => {
      const { data } = await axios.get(mainPath + `/${id}`);
      return data;
    },
  });
};

// ------------------------------ admin -------------------------------------

const TOKEN_KEY = 'maise-admin-token';

export const getAdminToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

export const setAdminToken = (token: string | null) => {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getAdminToken()}` },
});

export const adminLogin = async (password: string) => {
  const { data } = await axios.post('/api/admin/login', { password });
  setAdminToken(data.token);
  return data.token as string;
};

export type ProductPayload = Partial<Product> & { image?: string };

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ProductPayload) => {
      const { data } = await axios.post(adminPath, payload, authHeaders());
      return data as Product;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [mainPath] }),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: ProductPayload & { id: string }) => {
      const { data } = await axios.put(
        `${adminPath}/${id}`,
        payload,
        authHeaders()
      );
      return data as Product;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [mainPath] }),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${adminPath}/${id}`, authHeaders());
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [mainPath] }),
  });
};

// ------------------------------ admin orders -------------------------------

const adminOrdersPath = '/api/admin/orders';

export const useAdminOrders = (enabled: boolean) => {
  return useQuery<any[]>({
    queryKey: [adminOrdersPath],
    queryFn: async () => {
      const { data } = await axios.get(adminOrdersPath, authHeaders());
      return data || [];
    },
    enabled,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await axios.put(
        `${adminOrdersPath}/${id}`,
        { status },
        authHeaders()
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [adminOrdersPath] });
      queryClient.invalidateQueries({ queryKey: [mainPath] });
    },
  });
};
