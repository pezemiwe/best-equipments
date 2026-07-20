import { useToast } from "@chakra-ui/react";

interface IToaster {
    title: string;
    description: string;
}

export const useToaster = () => {
    const toast = useToast()
    const toastError = (title: string, description: string) =>
        toast({
            title,
            description,
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    const toastSuccess = (title: string, description: string) =>
        toast({
            title,
            description,
            status: 'success',
            duration: 5000,
            isClosable: true,
        });

    return {
        toastError,
        toastSuccess,
    };
}

