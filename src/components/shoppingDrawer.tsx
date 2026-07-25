import * as React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  Box,
  DrawerHeader,
  Flex,
  Icon,
  Image,
  ButtonGroup,
  Button,
  IconButton,
  DrawerFooter,
  Progress,
  useToast,
  SystemStyleObject,
} from "@chakra-ui/react";
import { Montserrat, Oswald } from "@next/font/google";
import { useAppContext } from "@/context";
import { AddIcon, MinusIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { BsBag, BsWhatsapp } from "react-icons/bs";
import { useRouter } from "next/router";

const noOutlineStyle: SystemStyleObject = { border: "none", boxShadow: "none" };

interface ShoppingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItem {
  id: string;
  name: string;
  brand?: string;
  amount: number;
  quantity: number;
  url: string;
}

interface OrderItem {
  id: string;
  quantity: number;
}

interface OrderResponse {
  items: Array<{
    name: string;
    brand?: string;
    quantity: number;
    amount: number;
  }>;
  total: number;
  reference: string;
  error?: string;
}

const montserrat = Montserrat({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const oswald = Oswald({
  weight: ["500"],
  style: ["normal"],
  subsets: ["latin"],
});

const ACCENT = "#2563eb";
const DARK = "#0f172a";
const FREE_SHIPPING_THRESHOLD = 50000;
// WhatsApp order number (international format, no leading 0 or +)
const WHATSAPP_NUMBER = "2348162309761";

export const ShoppingDrawer = ({ isOpen, onClose }: ShoppingDrawerProps) => {
  const {
    cart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    cartCount,
    totalCost,
  } = useAppContext();

  const router = useRouter();

  function notMobile() {
    const userAgent =
      typeof window !== "undefined" ? window.navigator.userAgent : "";
    return !/Mobile/.test(userAgent);
  }

  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - totalCost;

  const [placing, setPlacing] = React.useState(false);
  const toast = useToast();

  const openWhatsApp = (
    lines: string[],
    total: number,
    reference?: string | undefined,
  ): void => {
    const message = [
      "Hello Best Qualities Industrial Equipment! I would like to place an order:",
      "",
      ...lines,
      "",
      `Total: ₦${total.toLocaleString()}`,
      ...(reference ? ["", `Order reference: ${reference}`] : []),
      "",
      "Please confirm availability and delivery details. Thank you!",
    ].join("\n");
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  // Registers the order server-side first (prices re-verified against the
  // catalog, stock checked, order saved for the admin), then hands the
  // authoritative totals to WhatsApp. Falls back to a cart-priced message
  // only if the API is unreachable.
  const orderViaWhatsApp = async (): Promise<void> => {
    setPlacing(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: (Object.values(cart) as CartItem[]).map(
            (item: CartItem): OrderItem => ({
              id: item.id,
              quantity: item.quantity,
            }),
          ),
        }),
      });
      const data: OrderResponse = await response.json();
      if (!response.ok) {
        toast({
          title: "Could not place order",
          description: data?.error || "Please review your cart and try again.",
          status: "error",
          duration: 6000,
          isClosable: true,
        });
        return;
      }
      openWhatsApp(
        data.items.map(
          (item: any, index: number) =>
            `${index + 1}. ${item.name}${
              item.brand ? ` (${item.brand})` : ""
            } x${item.quantity} - ₦${(
              item.amount * item.quantity
            ).toLocaleString()}`,
        ),
        data.total,
        data.reference,
      );
    } catch {
      openWhatsApp(
        (Object.values(cart) as CartItem[]).map(
          (item: CartItem, index: number) =>
            `${index + 1}. ${item.name}${item.brand ? ` (${item.brand})` : ""} x${item.quantity} - ₦${(
              item.amount * item.quantity
            ).toLocaleString()}`,
        ),
        totalCost,
      );
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size={{
        base: "100%",
        lg: "sm",
      }}
    >
      {notMobile() && <DrawerOverlay />}
      <DrawerContent
        className={montserrat.className}
        mt={{
          base: "80px",
          lg: "0px",
        }}
      >
        {notMobile() && (
          <DrawerCloseButton
            mt="14px"
            border="none"
            _focus={noOutlineStyle}
            _hover={noOutlineStyle}
            _active={noOutlineStyle}
          />
        )}

        <DrawerHeader
          borderBottom="1px solid #ececec"
          className={oswald.className}
          textTransform="uppercase"
          fontSize="18px"
          display="flex"
          alignItems="center"
          gap="10px"
        >
          <Icon as={BsBag} boxSize="18px" />
          Your Cart
          {cartCount > 0 && (
            <Text as="span" fontSize="14px" color="#7a7a7a">
              ({cartCount} {cartCount === 1 ? "item" : "items"})
            </Text>
          )}
        </DrawerHeader>

        <DrawerBody w="100%" px="16px">
          {cartCount === 0 ? (
            <Flex
              flexDir="column"
              alignItems="center"
              justifyContent="center"
              h="100%"
              textAlign="center"
            >
              <Icon as={BsBag} boxSize="42px" color="#d0d0d0" mb="20px" />
              <Text
                fontSize="20px"
                className={oswald.className}
                textTransform="uppercase"
                mb="8px"
              >
                Your cart is empty
              </Text>
              <Text fontSize="14px" color="#7a7a7a" mb="24px">
                Find the right parts for your vehicle.
              </Text>
              <Button
                bg={DARK}
                color="white"
                borderRadius="6px"
                fontSize="14px"
                _hover={{ bg: ACCENT }}
                onClick={() => {
                  onClose();
                  router.push("/store");
                }}
              >
                BROWSE PARTS
              </Button>
            </Flex>
          ) : (
            <>
              {remainingForFreeShipping > 0 ? (
                <Box mt="16px" mb="4px">
                  <Text fontSize="13px" color="#5a5a5a" mb="6px">
                    Add{" "}
                    <Text as="span" fontWeight="bold" color={ACCENT}>
                      ₦{remainingForFreeShipping.toLocaleString()}
                    </Text>{" "}
                    more for free shipping
                  </Text>
                  <Progress
                    value={(totalCost / FREE_SHIPPING_THRESHOLD) * 100}
                    size="xs"
                    sx={{ "& > div": { background: ACCENT } }}
                    bg="#ececec"
                  />
                </Box>
              ) : (
                <Text mt="16px" mb="4px" fontSize="13px" color="green.600">
                  ✓ Your order qualifies for free shipping
                </Text>
              )}

              {Object.values(cart).map((item) => (
                <Flex
                  key={item.id}
                  py="16px"
                  borderBottom="1px solid #ececec"
                  gap="12px"
                >
                  <Image
                    src={item.url}
                    boxSize="72px"
                    alt={item.name}
                    objectFit="cover"
                    border="1px solid #ececec"
                    fallbackSrc="/placeholder-part.svg"
                  />
                  <Flex flexDir="column" flex="1" minW="0">
                    <Flex justifyContent="space-between" gap="8px">
                      <Text fontWeight="600" fontSize="14px" noOfLines={2}>
                        {item.name}
                      </Text>
                      <IconButton
                        aria-label="remove from cart"
                        icon={<SmallCloseIcon />}
                        size="xs"
                        variant="ghost"
                        color="#9a9a9a"
                        _hover={{ color: ACCENT, bg: "transparent" }}
                        onClick={() => removeFromCart(item.id)}
                      />
                    </Flex>
                    {item.brand && (
                      <Text fontSize="12px" color="#9a9a9a">
                        {item.brand}
                      </Text>
                    )}
                    <Text fontSize="13px" color="#7a7a7a" mt="2px">
                      ₦{item.amount?.toLocaleString()} each
                    </Text>
                    <Flex
                      mt="8px"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <ButtonGroup size="xs" isAttached variant="outline">
                        <IconButton
                          aria-label="decrease cart quantity"
                          icon={<MinusIcon boxSize="8px" />}
                          borderRadius="6px"
                          onClick={() => decrementQuantity(item.id)}
                          isDisabled={item.quantity <= 1}
                        />
                        <Button
                          pointerEvents="none"
                          borderRadius="6px"
                          minW="36px"
                        >
                          {item.quantity}
                        </Button>
                        <IconButton
                          aria-label="increase cart quantity"
                          icon={<AddIcon boxSize="8px" />}
                          borderRadius="6px"
                          onClick={() => incrementQuantity(item.id)}
                        />
                      </ButtonGroup>
                      <Text fontWeight="bold" fontSize="14px">
                        ₦{(item.amount * item.quantity).toLocaleString()}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              ))}
            </>
          )}
        </DrawerBody>

        {cartCount > 0 && (
          <DrawerFooter
            borderTop="1px solid #ececec"
            boxShadow="0 -4px 12px rgba(0,0,0,0.04)"
          >
            <Box w="full">
              <Flex
                justifyContent="space-between"
                fontSize="14px"
                color="#7a7a7a"
                mb="6px"
              >
                <Text>Shipping</Text>
                <Text>
                  {totalCost >= FREE_SHIPPING_THRESHOLD
                    ? "Free"
                    : "Calculated at checkout"}
                </Text>
              </Flex>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                mb="16px"
              >
                <Text
                  className={oswald.className}
                  textTransform="uppercase"
                  fontSize="16px"
                >
                  Total
                </Text>
                <Text fontWeight="bold" fontSize="20px">
                  ₦{totalCost?.toLocaleString()}
                </Text>
              </Flex>
              <Button
                bg="#25D366"
                color="white"
                w="full"
                h="50px"
                borderRadius="6px"
                fontSize="14px"
                fontWeight="bold"
                leftIcon={<Icon as={BsWhatsapp} boxSize="18px" />}
                _hover={{ opacity: "0.85" }}
                isLoading={placing}
                loadingText="PLACING ORDER"
                onClick={orderViaWhatsApp}
              >
                ORDER VIA WHATSAPP
              </Button>
              <Text mt="8px" fontSize="12px" color="#9a9a9a" textAlign="center">
                You will be redirected to WhatsApp to confirm your order
              </Text>
              <Button
                variant="link"
                w="full"
                mt="12px"
                fontSize="13px"
                color="#7a7a7a"
                onClick={onClose}
              >
                Continue shopping
              </Button>
            </Box>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default ShoppingDrawer;
