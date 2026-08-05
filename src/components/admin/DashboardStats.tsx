import * as React from "react";
import { SimpleGrid, Stat, StatLabel, StatNumber } from "@chakra-ui/react";

const ACCENT = "#2563eb";

export const DashboardStats = ({
  products,
  orders,
  pendingCount,
  totalValue,
  enquiryCount,
}: {
  products: any[];
  orders: any[];
  pendingCount: number;
  totalValue: number;
  enquiryCount?: number;
}) => (
  <SimpleGrid columns={{ base: 2, md: 5 }} spacing="20px" mb="30px">
    <Stat bg="white" p="20px" boxShadow="0 2px 8px rgba(0,0,0,0.05)">
      <StatLabel>Total products</StatLabel>
      <StatNumber className={"font-oswald"}>
        {products?.length ?? "-"}
      </StatNumber>
    </Stat>
    <Stat bg="white" p="20px" boxShadow="0 2px 8px rgba(0,0,0,0.05)">
      <StatLabel>Pending orders</StatLabel>
      <StatNumber className={"font-oswald"} color={ACCENT}>
        {orders ? pendingCount : "-"}
      </StatNumber>
    </Stat>
    <Stat bg="white" p="20px" boxShadow="0 2px 8px rgba(0,0,0,0.05)">
      <StatLabel>In stock</StatLabel>
      <StatNumber className={"font-oswald"}>
        {products
          ? products.filter((p: any) => p.inStock !== false).length
          : "-"}
      </StatNumber>
    </Stat>
    <Stat bg="white" p="20px" boxShadow="0 2px 8px rgba(0,0,0,0.05)">
      <StatLabel>Catalog value</StatLabel>
      <StatNumber className={"font-oswald"}>
        ₦{totalValue.toLocaleString()}
      </StatNumber>
    </Stat>
    <Stat bg="white" p="20px" boxShadow="0 2px 8px rgba(0,0,0,0.05)">
      <StatLabel>New enquiries</StatLabel>
      <StatNumber className={"font-oswald"} color={enquiryCount ? "#e53e3e" : "#2e2e2e"}>
        {enquiryCount ?? "-"}
      </StatNumber>
    </Stat>
  </SimpleGrid>
);

