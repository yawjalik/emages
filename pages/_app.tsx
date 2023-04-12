import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Box, Button, ChakraProvider, HStack, Heading, extendTheme } from '@chakra-ui/react';
import Link from 'next/link';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider>
      <Head>
        <title>EMages</title>
        <meta name="description" content="Images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box bg="teal.500" w="100%" h="4px" />
      <Box margin={4}>
        <HStack spacing={8} justify="around" marginBottom={8}>
          <Heading size="xl">EMages</Heading>
          <Link href="/"><Button colorScheme="teal" variant="ghost">Search</Button></Link>
          <Link href="/upload"><Button colorScheme="teal" variant="ghost">Upload</Button></Link>
        </HStack>
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  </QueryClientProvider>
  );
}
