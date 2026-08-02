import * as React from "react";
import {
  Badge,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

const STATUS_COLORS: Record<string, string> = {
  pending: "yellow",
  confirmed: "blue",
  delivered: "green",
  cancelled: "red",
};

const NEXT_STATUSES: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export const OrderTable = ({
  orders,
  changeOrderStatus,
  isUpdating,
}: {
  orders: any[];
  changeOrderStatus: (id: string, status: string) => void;
  isUpdating: boolean;
}) => (
  <TableContainer bg="white" boxShadow="0 2px 8px rgba(0,0,0,0.05)">
    <Table size="md">
      <Thead bg="#fafafa">
        <Tr>
          <Th>Reference</Th>
          <Th>Date</Th>
          <Th>Customer</Th>
          <Th>Phone</Th>
          <Th>Items</Th>
          <Th isNumeric>Total</Th>
          <Th>Status</Th>
          <Th textAlign="right">Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {(orders || []).map((order: any) => (
          <Tr key={order.id}>
            <Td fontSize="13px" fontWeight="600">
              {order.reference}
            </Td>
            <Td fontSize="13px" color="gray.600">
              {new Date(order.createdAt).toLocaleString()}
            </Td>
            <Td fontSize="13px">
              {order.customerName || (
                <Text as="span" color="gray.400" fontStyle="italic">
                  Unknown
                </Text>
              )}
            </Td>
            <Td fontSize="13px">{order.customerPhone || "-"}</Td>
            <Td fontSize="13px" maxW="320px">
              <Text noOfLines={2} whiteSpace="normal">
                {order.items
                  .map((item: any) => `${item.name} x${item.quantity}`)
                  .join(", ")}
              </Text>
            </Td>
            <Td isNumeric fontWeight="600">
              ₦{Number(order.total).toLocaleString()}
            </Td>
            <Td>
              <Badge
                colorScheme={STATUS_COLORS[order.status] || "gray"}
                borderRadius="full"
                px="10px"
              >
                {order.status}
              </Badge>
            </Td>
            <Td>
              <Flex justifyContent="flex-end" gap="8px">
                {(NEXT_STATUSES[order.status] || []).map((status) => (
                  <Button
                    key={status}
                    size="xs"
                    borderRadius="6px"
                    colorScheme={STATUS_COLORS[status] || "gray"}
                    variant={status === "cancelled" ? "outline" : "solid"}
                    isLoading={isUpdating}
                    onClick={() => changeOrderStatus(order.id, status)}
                  >
                    Mark {status}
                  </Button>
                ))}
              </Flex>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
    {(orders || []).length === 0 && (
      <Text p="40px" textAlign="center" color="gray.500">
        No orders yet. Orders placed through the website appear here.
      </Text>
    )}
  </TableContainer>
);
