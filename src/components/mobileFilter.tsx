import * as React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { FilterPanel, StoreFilters } from "@/pages/store";

interface MobileFilterProps {
  isOpen: boolean;
  onClose: () => void;
  filters: StoreFilters;
}

export const MobileFilter = ({ isOpen, onClose, filters }: MobileFilterProps) => {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filters</DrawerHeader>
          <DrawerBody>
            <FilterPanel filters={filters} />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default MobileFilter;
