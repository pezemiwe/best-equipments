import * as React from "react";
import {
  Badge,
  Button,
  Checkbox,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Skeleton,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon, SearchIcon, WarningIcon } from "@chakra-ui/icons";

const ACCENT = "#2563eb";

export const ProductTable = ({
  isLoading,
  products,
  filtered,
  search,
  setSearch,
  selectedIds,
  setSelectedIds,
  removeSelected,
  openCreate,
  openEdit,
  remove,
  isBulkDeleting,
  categories,
}: {
  isLoading: boolean;
  products: any[];
  filtered: any[];
  search: string;
  setSearch: (s: string) => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  removeSelected: () => void;
  openCreate: () => void;
  openEdit: (p: any) => void;
  remove: (p: any) => void;
  isBulkDeleting: boolean;
  categories: any[];
}) => {
  const categoryLabel = (val: string) => {
    const found = (categories || []).find((c: any) => c.value === val);
    return found ? found.name : val;
  };

  return (
  <>
    <Flex
      mb="20px"
      justifyContent="space-between"
      alignItems={{ base: "stretch", md: "center" }}
      flexDir={{ base: "column", md: "row" }}
      gap="12px"
    >
      <InputGroup maxW={{ base: "100%", md: "360px" }} bg="white">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search by name, brand or SKU..."
          borderRadius="none"
          focusBorderColor={ACCENT}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>
      <Flex gap="12px">
        {selectedIds.length > 0 && (
          <Button
            leftIcon={<DeleteIcon />}
            colorScheme="red"
            variant="outline"
            borderRadius="none"
            isLoading={isBulkDeleting}
            onClick={removeSelected}
          >
            Delete selected ({selectedIds.length})
          </Button>
        )}
        <Button
          leftIcon={<AddIcon />}
          bg={ACCENT}
          color="white"
          borderRadius="none"
          _hover={{ opacity: 0.85 }}
          onClick={openCreate}
        >
          Add product
        </Button>
      </Flex>
    </Flex>

    {isLoading ? (
      <Skeleton height="400px" />
    ) : (
      <TableContainer bg="white" boxShadow="0 2px 8px rgba(0,0,0,0.05)">
        <Table size="md">
          <Thead bg="#fafafa">
            <Tr>
              <Th w="40px">
                <Checkbox
                  colorScheme="blue"
                  isChecked={
                    filtered.length > 0 &&
                    selectedIds.length === filtered.length
                  }
                  isIndeterminate={
                    selectedIds.length > 0 &&
                    selectedIds.length < filtered.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(filtered.map((p: any) => p.id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                />
              </Th>
              <Th>Product</Th>
              <Th>Brand</Th>
              <Th>Category</Th>
              <Th>SKU</Th>
              <Th isNumeric>Price</Th>
              <Th>Status</Th>
              <Th textAlign="right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((product: any) => (
              <Tr key={product.id}>
                <Td>
                  <Checkbox
                    colorScheme="blue"
                    isChecked={selectedIds.includes(product.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds([...selectedIds, product.id]);
                      } else {
                        setSelectedIds(
                          selectedIds.filter((id) => id !== product.id)
                        );
                      }
                    }}
                  />
                </Td>
                <Td>
                  <Flex alignItems="center" gap="12px">
                    <Image
                      src={product.url}
                      alt={product.name}
                      boxSize="44px"
                      objectFit="cover"
                      borderRadius="4px"
                      fallbackSrc="/placeholder-part.svg"
                    />
                    <Text
                      fontWeight="600"
                      fontSize="14px"
                      maxW="260px"
                      noOfLines={2}
                    >
                      {product.name}
                    </Text>
                  </Flex>
                </Td>
                <Td fontSize="14px">{product.brand || "-"}</Td>
                <Td fontSize="14px">
                  {categories?.find((c: any) => c.value === product.category) ? (
                    categoryLabel(product.category)
                  ) : (
                    <Flex alignItems="center" color="red.500" gap="6px" title="Invalid category">
                      <WarningIcon />
                      <Text>{product.category}</Text>
                    </Flex>
                  )}
                </Td>
                <Td fontSize="13px" color="gray.500">
                  {product.sku || "-"}
                </Td>
                <Td isNumeric fontWeight="600">
                  ₦{Number(product.amount).toLocaleString()}
                </Td>
                <Td>
                  <Badge
                    colorScheme={
                      product.inStock === false
                        ? "red"
                        : (product.quantity ?? 99) <= 3
                        ? "orange"
                        : "green"
                    }
                    borderRadius="none"
                  >
                    {product.inStock === false
                      ? "Out of stock"
                      : typeof product.quantity === "number"
                      ? `${product.quantity} in stock${
                          product.quantity <= 3 ? " (low)" : ""
                        }`
                      : "In stock"}
                  </Badge>
                </Td>
                <Td>
                  <Flex justifyContent="flex-end" gap="8px">
                    <IconButton
                      aria-label="edit product"
                      icon={<EditIcon />}
                      size="sm"
                      variant="outline"
                      borderRadius="none"
                      onClick={() => openEdit(product)}
                    />
                    <IconButton
                      aria-label="delete product"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      borderRadius="none"
                      onClick={() => remove(product)}
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {products?.length === 0 ? (
          <Text p="40px" textAlign="center" color="gray.500">
            Catalogue is empty. Click &quot;Add product&quot; to get started.
          </Text>
        ) : (
          filtered.length === 0 && (
            <Text p="40px" textAlign="center" color="gray.500">
              No products found.
            </Text>
          )
        )}
      </TableContainer>
    )}
  </>
  );
};
