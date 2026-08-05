import * as React from 'react';
import {
  Badge,
  Box,
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
  Skeleton,
} from '@chakra-ui/react';

const ACCENT = '#2563eb';

export const EnquiryTable = ({
  enquiries,
  isLoading,
  markHandled,
  isUpdating,
}: {
  enquiries: any[];
  isLoading: boolean;
  markHandled: (id: string) => void;
  isUpdating: boolean;
}) => {
  return (
    <Box bg="white" borderRadius="8px" overflow="hidden" boxShadow="0 2px 8px rgba(0,0,0,0.06)">
      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead bg="#f8fafc">
            <Tr>
              <Th>Date</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Vehicle / Equipment</Th>
              <Th>Message</Th>
              <Th>Status</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Tr key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <Td key={j}><Skeleton h="16px" /></Td>
                    ))}
                  </Tr>
                ))
              : enquiries.length === 0
              ? (
                <Tr>
                  <Td colSpan={7}>
                    <Text color="#9a9a9a" fontSize="14px" py="20px" textAlign="center">
                      No enquiries yet.
                    </Text>
                  </Td>
                </Tr>
              )
              : enquiries.map((enq: any) => (
                  <Tr
                    key={enq.id}
                    bg={enq.status === 'new' ? '#fffbeb' : 'white'}
                    _hover={{ bg: enq.status === 'new' ? '#fef3c7' : '#f8fafc' }}
                  >
                    <Td fontSize="12px" color="#7a7a7a" whiteSpace="nowrap">
                      {new Date(enq.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </Td>
                    <Td fontWeight="500" fontSize="13px">{enq.name}</Td>
                    <Td fontSize="13px">
                      <a href={`mailto:${enq.email}`} style={{ color: ACCENT }}>
                        {enq.email}
                      </a>
                    </Td>
                    <Td fontSize="13px" color="#5a5a5a" maxW="160px">
                      <Text noOfLines={1}>{enq.vehicle || '—'}</Text>
                    </Td>
                    <Td fontSize="13px" maxW="280px">
                      <Text noOfLines={2} color="#2e2e2e">{enq.message}</Text>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={enq.status === 'new' ? 'yellow' : 'green'}
                        borderRadius="full"
                        px="8px"
                      >
                        {enq.status}
                      </Badge>
                    </Td>
                    <Td>
                      {enq.status === 'new' && (
                        <Button
                          size="xs"
                          colorScheme="green"
                          variant="outline"
                          isLoading={isUpdating}
                          onClick={() => markHandled(enq.id)}
                        >
                          Mark handled
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
