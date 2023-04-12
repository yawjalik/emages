import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import NavBar from '@/components/NavBar';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider>
      <Head>
        <title>EMages</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Image storage and search" />
        <link rel="icon" href="/image/favicon.ico" />
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
