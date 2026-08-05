import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getAdminToken } from './products';

const adminPath = '/api/admin/enquiries';

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getAdminToken()}` },
});

export const useAdminEnquiries = (enabled = true) => {
  return useQuery<any[]>({
    queryKey: [adminPath],
    queryFn: async () => {
      const { data } = await axios.get(adminPath, authHeaders());
      return data || [];
    },
    enabled,
  });
};

export const useUpdateEnquiryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await axios.patch(adminPath, { id, status }, authHeaders());
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [adminPath] }),
  });
};
