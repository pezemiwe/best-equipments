import * as React from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';
import { MdOutlineTimer } from 'react-icons/md';

export const DiscountCountdown = ({ discountEnd }: { discountEnd: number }) => {
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setTimeLeft(Math.max(0, discountEnd - Date.now()));

    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, discountEnd - Date.now()));
    }, 1000);

    return () => clearInterval(interval);
  }, [discountEnd]);

  if (!mounted || timeLeft <= 0) return null;

  // DD:HH:MM:SS
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  const format = (n: number) => n.toString().padStart(2, '0');

  const TimeBox = ({ value }: { value: string }) => (
    <Flex
      bg="black"
      color="white"
      borderRadius="4px"
      w="28px"
      h="28px"
      alignItems="center"
      justifyContent="center"
      fontSize="14px"
      fontWeight="bold"
    >
      {value}
    </Flex>
  );

  return (
    <Flex alignItems='center' gap='8px' mt='4px'>
      <TimeBox value={format(days)} />
      <Text fontWeight="bold">:</Text>
      <TimeBox value={format(hours)} />
      <Text fontWeight="bold">:</Text>
      <TimeBox value={format(minutes)} />
      <Text fontWeight="bold">:</Text>
      <TimeBox value={format(seconds)} />
    </Flex>
  );
};
