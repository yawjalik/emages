import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Box, Button, ChakraProvider, HStack, Heading } from '@chakra-ui/react';
import Link from 'next/link';
import { QueryClient, QueryClientProvider } from 'react-query';
import NavBar from '@/components/NavBar';

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
        <NavBar />
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  </QueryClientProvider>
  );
}
