import * as React from "react";
import {
  Button,
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
import { AddIcon, DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";

const ACCENT = "#2563eb";

export const CategoryTable = ({
  isLoading,
  categories,
  filtered,
  search,
  setSearch,
  openCreate,
  openEdit,
  remove,
}: {
  isLoading: boolean;
  categories: any[];
  filtered: any[];
  search: string;
  setSearch: (s: string) => void;
  openCreate: () => void;
  openEdit: (c: any) => void;
  remove: (c: any) => void;
}) => (
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
          placeholder="Search by name or value..."
          borderRadius="none"
          focusBorderColor={ACCENT}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>
      <Flex gap="12px">
        <Button
          leftIcon={<AddIcon />}
          bg={ACCENT}
          color="white"
          borderRadius="none"
          _hover={{ opacity: 0.85 }}
          onClick={openCreate}
        >
          Add category
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
              <Th>Image</Th>
              <Th>Name</Th>
              <Th>Value</Th>
              <Th textAlign="right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((category: any) => (
              <Tr key={category.id}>
                <Td w="80px">
                  <Image
                    src={category.image}
                    alt={category.name}
                    boxSize="44px"
                    objectFit="cover"
                    borderRadius="4px"
                    fallbackSrc="/placeholder-part.svg"
                  />
                </Td>
                <Td>
                  <Text fontWeight="600" fontSize="14px">
                    {category.name}
                  </Text>
                </Td>
                <Td fontSize="14px">{category.value}</Td>
                <Td>
                  <Flex justifyContent="flex-end" gap="8px">
                    <IconButton
                      aria-label="edit category"
                      icon={<EditIcon />}
                      size="sm"
                      variant="outline"
                      borderRadius="none"
                      onClick={() => openEdit(category)}
                    />
                    <IconButton
                      aria-label="delete category"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      borderRadius="none"
                      onClick={() => remove(category)}
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {categories?.length === 0 ? (
          <Text p="40px" textAlign="center" color="gray.500">
            Categories list is empty. Click &quot;Add category&quot; to get started.
          </Text>
        ) : (
          filtered.length === 0 && (
            <Text p="40px" textAlign="center" color="gray.500">
              No categories found.
            </Text>
          )
        )}
      </TableContainer>
    )}
  </>
);
