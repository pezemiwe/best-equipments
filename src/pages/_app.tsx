import { ChakraProvider } from '@chakra-ui/react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Roboto } from '@next/font/google';
import { AppProvider } from '@/context';
import CookieBanner from '@/components/CookieBanner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title key='title'>
          Best Qualities Industrial Equipment | Vehicle Parts & Accessories in
          Nigeria
        </title>
        <meta
          name='description'
          content='Industrial equipment and vehicle parts in Nigeria: belts, bearings, seals, excavator parts and car care products, with fast nationwide delivery.'
          key='description'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='theme-color' content='#0f172a' />
      </Head>
      <AppProvider>
        <ChakraProvider>
          <main className={roboto.className}>
            <Component {...pageProps} />
            <CookieBanner />
          </main>
        </ChakraProvider>
      </AppProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
