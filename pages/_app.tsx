import type { AppProps } from "next/app";
import Head from 'next/head'
import { GlobalContextProvider } from '../context/global';
import '../geek-theme/fonts/feather/feather.css';
import "@styles/globals.css";
import "@styles/scss/index.scss";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <GlobalContextProvider>
      <Head>
        <title>CMS - TMF Fertilizantes</title>
      </Head>

      <Component {...pageProps} />
    </GlobalContextProvider>
  );
}

export default MyApp;
