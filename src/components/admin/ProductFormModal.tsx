import * as React from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  Input,
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
  Text,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { ProductPayload } from "@/hooks/products";
import { RichTextEditor } from "./RichTextEditor";

const ACCENT = "#2563eb";

export const ProductFormModal = ({
  isOpen,
  onClose,
  editingId,
  form,
  setForm,
  preview,
  setPreview,
  onFile,
  onGalleryFiles,
  save,
  isSaving,
  categories,
}: {
  isOpen: boolean;
  onClose: () => void;
  editingId: string | null;
  form: ProductPayload;
  setForm: (key: keyof ProductPayload, value: any) => void;
  preview: string;
  setPreview: (url: string) => void;
  onFile: (file?: File | null) => void;
  onGalleryFiles: (files: FileList | null) => void;
  save: () => void;
  isSaving: boolean;
  categories: any[];
}) => (
  <Modal isOpen={isOpen} onClose={onClose} size="xl">
    <ModalOverlay />
    <ModalContent borderRadius="none" className={"font-montserrat"}>
      <ModalHeader className={"font-oswald"}>
        {editingId ? "Edit product" : "Add new product"}
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="16px" mb="16px">
          <FormControl isRequired>
            <FormLabel fontSize="14px">Product name</FormLabel>
            <Input
              borderRadius="none"
              focusBorderColor={ACCENT}
              value={form.name || ""}
              onChange={(e) => setForm("name", e.target.value)}
              placeholder="e.g. Ceramic Brake Pad Set"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="14px">Brand</FormLabel>
            <Input
              borderRadius="none"
              focusBorderColor={ACCENT}
              value={form.brand || ""}
              onChange={(e) => setForm("brand", e.target.value)}
              placeholder="e.g. Bosch"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontSize="14px">Price (₦)</FormLabel>
            <NumberInput
              min={0}
              value={form.amount || ""}
              onChange={(value) => setForm("amount", Number(value))}
            >
              <NumberInputField borderRadius="none" placeholder="0.00" />
            </NumberInput>
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontSize="14px">Category</FormLabel>
            <Select
              borderRadius="none"
              focusBorderColor={ACCENT}
              value={form.category}
              onChange={(e) => setForm("category", e.target.value)}
            >
              <option value="" disabled>Select category</option>
              {categories.map((type: any) => (
                <option value={type.value} key={type.value}>
                  {type.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="16px" mb="16px">
          <FormControl>
            <FormLabel fontSize="14px">Discount Price (₦)</FormLabel>
            <NumberInput
              min={0}
              value={form.discountPrice ?? ""}
              onChange={(value) => setForm("discountPrice", value ? Number(value) : undefined)}
            >
              <NumberInputField borderRadius="none" placeholder="0.00" />
            </NumberInput>
            <Text fontSize="12px" color="gray.500" mt="4px">
              Optional. Set to put product on sale.
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="14px">Discount End Date</FormLabel>
            <Input
              type="datetime-local"
              borderRadius="none"
              focusBorderColor={ACCENT}
              value={
                form.discountEnd
                  ? new Date(form.discountEnd - new Date().getTimezoneOffset() * 60000)
                      .toISOString()
                      .slice(0, 16)
                  : ""
              }
              onChange={(e) => {
                const val = e.target.value;
                setForm("discountEnd", val ? new Date(val).getTime() : undefined);
              }}
            />
            <Text fontSize="12px" color="gray.500" mt="4px">
              Optional. Discount automatically expires.
            </Text>
          </FormControl>
        </SimpleGrid>
        <FormControl mb="16px">
          <FormLabel fontSize="14px">Description</FormLabel>
          <RichTextEditor
            value={form.description || ""}
            onChange={(val) => setForm("description", val)}
            placeholder="What the part does, what it fits, what is included..."
          />
        </FormControl>
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
                value={form.url || ""}
                onChange={(e) => {
                  setForm("url", e.target.value);
                  setForm("image", undefined);
                  setPreview(e.target.value);
                }}
                placeholder="https://..."
              />
            </FormControl>
            <FormControl mt="16px">
              <FormLabel fontSize="14px">Stock quantity</FormLabel>
              <NumberInput
                min={0}
                value={form.quantity ?? ""}
                onChange={(value) =>
                  setForm("quantity", Math.max(0, Number(value) || 0))
                }
              >
                <NumberInputField borderRadius="none" placeholder="0" />
              </NumberInput>
              <Text fontSize="12px" color="gray.500" mt="4px">
                0 marks the product out of stock
              </Text>
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
        <FormControl mb="8px">
          <FormLabel fontSize="14px">
            Gallery images (other views, up to 8)
          </FormLabel>
          <Input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            border="none"
            px="0"
            onChange={(e) => onGalleryFiles(e.target.files)}
          />
          {(form.gallery || []).length > 0 && (
            <Flex gap="10px" mt="10px" flexWrap="wrap">
              {(form.gallery || []).map((src: string, index: number) => (
                <Box key={index} position="relative">
                  <Image
                    src={src}
                    alt={`gallery ${index + 1}`}
                    boxSize="72px"
                    objectFit="cover"
                    borderRadius="6px"
                    border="1px solid #e4e5e7"
                    fallbackSrc="/placeholder-part.svg"
                  />
                  <IconButton
                    aria-label="remove gallery image"
                    icon={<DeleteIcon boxSize="10px" />}
                    size="xs"
                    colorScheme="red"
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    borderRadius="full"
                    onClick={() =>
                      setForm(
                        "gallery",
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
          <Text fontSize="12px" color="gray.500" mt="6px">
            Shoppers can click these on the product page to switch the main
            view.
          </Text>
        </FormControl>
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
          {editingId ? "Save changes" : "Create product"}
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
