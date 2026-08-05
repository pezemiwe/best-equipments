import * as React from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { CategoryPayload } from "@/hooks/categories";

const ACCENT = "#2563eb";

export const CategoryFormModal = ({
  isOpen,
  onClose,
  editingId,
  form,
  setForm,
  preview,
  setPreview,
  onFile,
  save,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  editingId: string | null;
  form: CategoryPayload;
  setForm: (key: keyof CategoryPayload, value: any) => void;
  preview: string;
  setPreview: (url: string) => void;
  onFile: (file?: File | null) => void;
  save: () => void;
  isSaving: boolean;
}) => (
  <Modal isOpen={isOpen} onClose={onClose} size="xl">
    <ModalOverlay />
    <ModalContent borderRadius="none" className={"font-montserrat"}>
      <ModalHeader className={"font-oswald"}>
        {editingId ? "Edit category" : "Add new category"}
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="16px" mb="16px">
          <FormControl isRequired>
            <FormLabel fontSize="14px">Category name</FormLabel>
            <Input
              borderRadius="none"
              focusBorderColor={ACCENT}
              value={form.name || ""}
              onChange={(e) => setForm("name", e.target.value)}
              placeholder="e.g. Engine Parts"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="14px">Value (slug)</FormLabel>
            <Input
              borderRadius="none"
              focusBorderColor={ACCENT}
              value={form.value || ""}
              onChange={(e) => setForm("value", e.target.value)}
              placeholder="e.g. engineParts"
            />
            <Text fontSize="12px" color="gray.500" mt="4px">
              Used in URLs. Leave blank to auto-generate.
            </Text>
          </FormControl>
        </SimpleGrid>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="16px" mb="16px">
          <Box>
            <FormControl mb="12px">
              <FormLabel fontSize="14px">Upload image</FormLabel>
              <Input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                border="none"
                px="0"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="14px">...or image URL</FormLabel>
              <Input
                borderRadius="none"
                focusBorderColor={ACCENT}
                value={form.image || ""}
                onChange={(e) => {
                  setForm("image", e.target.value);
                  setForm("fileImage", undefined);
                  setPreview(e.target.value);
                }}
                placeholder="https://..."
              />
            </FormControl>
          </Box>
          <Flex
            border="1px dashed #d0d0d0"
            alignItems="center"
            justifyContent="center"
            minH="160px"
          >
            {preview ? (
              <Image
                src={preview}
                alt="preview"
                maxH="160px"
                objectFit="contain"
              />
            ) : (
              <Text fontSize="13px" color="gray.400">
                Image preview
              </Text>
            )}
          </Flex>
        </SimpleGrid>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" mr="12px" borderRadius="none" onClick={onClose}>
          Cancel
        </Button>
        <Button
          bg={ACCENT}
          color="white"
          borderRadius="none"
          _hover={{ opacity: 0.85 }}
          isLoading={isSaving}
          onClick={save}
        >
          {editingId ? "Save changes" : "Create category"}
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
