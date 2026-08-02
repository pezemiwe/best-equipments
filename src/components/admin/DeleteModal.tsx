import * as React from "react";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

export const DeleteModal = ({
  deleteTarget,
  setDeleteTarget,
  selectedIds,
  products,
  executeDelete,
  isDeleting,
}: {
  deleteTarget: { type: "single"; product: any } | { type: "bulk" } | null;
  setDeleteTarget: (target: any) => void;
  selectedIds: string[];
  products: any[];
  executeDelete: () => void;
  isDeleting: boolean;
}) => (
  <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} isCentered>
    <ModalOverlay />
    <ModalContent borderRadius="12px" className={"font-montserrat"}>
      <ModalHeader>Confirm Delete</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {deleteTarget?.type === "single" ? (
          <Text>Delete &quot;{deleteTarget.product.name}&quot;?</Text>
        ) : (
          <Box>
            <Text mb="6px">
              Delete {selectedIds.length} product
              {selectedIds.length === 1 ? "" : "s"}?
            </Text>
            <Box pl="12px" borderLeft="2px solid" borderColor="red.100" mb="6px">
              {(products || [])
                .filter((p: any) => selectedIds.includes(p.id))
                .slice(0, 5)
                .map((p: any) => (
                  <Text
                    key={p.id}
                    fontSize="13px"
                    color="gray.600"
                    noOfLines={1}
                  >
                    {p.name}
                  </Text>
                ))}
              {selectedIds.length > 5 && (
                <Text
                  fontSize="12px"
                  color="gray.500"
                  fontStyle="italic"
                  mt="2px"
                >
                  ...and {selectedIds.length - 5} more
                </Text>
              )}
            </Box>
          </Box>
        )}
        <Text color="red.500" fontSize="sm" mt="8px">
          This cannot be undone.
        </Text>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={() => setDeleteTarget(null)} mr="10px">
          Cancel
        </Button>
        <Button
          colorScheme="red"
          onClick={executeDelete}
          isLoading={isDeleting}
        >
          Delete
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
