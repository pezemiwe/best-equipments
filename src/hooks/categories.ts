import { Category } from '@/pages/api/categories';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getAdminToken } from './products';

const mainPath = '/api/categories';
const adminPath = '/api/admin/categories';

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getAdminToken()}` },
});

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: [mainPath],
    queryFn: async () => {
      const { data } = await axios.get(mainPath);
      return data || [];
    },
  });
};

export type CategoryPayload = Partial<Category> & { fileImage?: string };

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CategoryPayload) => {
      const { data } = await axios.post(adminPath, payload, authHeaders());
      return data as Category;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [mainPath] }),
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: CategoryPayload & { id: string }) => {
      const { data } = await axios.put(
        `${adminPath}/${id}`,
        payload,
        authHeaders()
      );
      return data as Category;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [mainPath] }),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${adminPath}/${id}`, authHeaders());
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [mainPath] }),
  });
};
