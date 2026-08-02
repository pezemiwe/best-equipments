import * as React from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import { LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { adminLogin } from "@/hooks/products";

const ACCENT = "#2563eb";
const DARK = "#0f172a";

export const AdminLogin = ({ onSuccess }: { onSuccess: () => void }) => {
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(password);
      onSuccess();
    } catch {
      toast({ title: "Invalid password", status: "error", duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      alignItems="center"
      justifyContent="center"
      px="16px"
      bgImage="linear-gradient(rgba(20, 22, 26, 0.88), rgba(20, 22, 26, 0.88)), url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1920&q=60')"
      bgSize="cover"
      bgPosition="center"
      className={"font-montserrat"}
    >
      <Box
        bg="white"
        w="420px"
        maxW="100%"
        boxShadow="0 24px 60px rgba(0,0,0,0.45)"
        borderTop={`4px solid ${ACCENT}`}
        overflow="hidden"
      >
        <Box p={{ base: "30px", md: "40px" }}>
          <Flex
            alignItems="center"
            justifyContent="center"
            boxSize="56px"
            bg="#f4f5f7"
            borderRadius="full"
            mb="20px"
            mx="auto"
          >
            <LockIcon boxSize="22px" color={ACCENT} />
          </Flex>
          <Flex
            flexDir="column"
            alignItems="center"
            mb="6px"
            lineHeight="1"
            className={"font-oswald"}
          >
            <Flex alignItems="baseline">
              <Heading fontSize="24px" textTransform="uppercase">
                Best
              </Heading>
              <Heading
                fontSize="24px"
                textTransform="uppercase"
                color={ACCENT}
                ml="6px"
              >
                Qualities
              </Heading>
            </Flex>
            <Text
              fontSize="9px"
              letterSpacing="3.5px"
              color="#64748b"
              textTransform="uppercase"
              mt="6px"
            >
              Industrial Equipment
            </Text>
          </Flex>
          <Text
            mb="30px"
            color="#5a5a5a"
            fontSize="14px"
            textAlign="center"
          >
            Admin portal. Sign in to manage your parts catalog.
          </Text>
          <form onSubmit={submit}>
            <FormControl mb="24px">
              <FormLabel fontSize="13px" fontWeight="600" letterSpacing="0.5px">
                PASSWORD
              </FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  h="48px"
                  borderRadius="none"
                  focusBorderColor={ACCENT}
                  placeholder="Enter admin password"
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                <InputRightElement h="48px" w="48px">
                  <IconButton
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    size="sm"
                    variant="ghost"
                    color="gray.500"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button
              type="submit"
              w="full"
              h="50px"
              bg={DARK}
              color="white"
              fontSize="14px"
              fontWeight="bold"
              letterSpacing="1px"
              borderRadius="none"
              isLoading={loading}
              loadingText="SIGNING IN"
              isDisabled={!password}
              _hover={{ bg: ACCENT }}
            >
              SIGN IN
            </Button>
          </form>
        </Box>
        <Flex
          bg="#f8f8f8"
          borderTop="1px solid #ececec"
          py="14px"
          justifyContent="center"
        >
          <Text fontSize="12px" color="#8a8d90">
            Authorized staff only. Sessions expire after 12 hours.
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};
