import { useToast } from '@chakra-ui/react';
import type { UseToastOptions } from '@chakra-ui/react';

export const useToaster = () => {
  const toastMain = useToast();
  const toast = (
    title: string,
    description: string,
    type = 'info' as UseToastOptions['status']
  ) =>
    toastMain({
      title,
      description,
      status: type,
      duration: 5000,
      isClosable: true,
    });

  return {
    toast,
  };
};
