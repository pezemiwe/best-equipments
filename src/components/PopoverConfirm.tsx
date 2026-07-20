import React from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

interface PopoverConfirmProps {
  colorScheme: string;
  action: () => void;
  text: string;
}

export default function PopoverConfirm({
  colorScheme,
  action,
  text,
}: PopoverConfirmProps) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const initialFocusRef = React.useRef<any>();
  return (
    <Popover
      isOpen={isOpen}
      initialFocusRef={initialFocusRef}
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Button
          textTransform="uppercase"
          fontSize="14px"
          colorScheme={colorScheme}
        >
          {text}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader fontWeight="semibold">Confirmation</PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          Are you sure you want to continue with your action?
        </PopoverBody>
        <PopoverFooter display="flex" justifyContent="flex-end">
          <Button
            ref={initialFocusRef}
            textTransform="uppercase"
            fontSize="14px"
            colorScheme={colorScheme}
            onClick={() => {
              action();
              onClose();
            }}
          >
            Comfirm
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}
