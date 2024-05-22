import "../styles/globals.css";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { DefaultSeo } from "next-seo";
import seoConfig from "../config/seo";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

interface AppPropsWithSession extends AppProps {
  pageProps: AppProps["pageProps"] & {
    session?: Session;
  };
}

function FWFilmesApp({ Component, pageProps }: AppPropsWithSession) {
  return (
    <>
      <DefaultSeo {...seoConfig} />
      <NextNProgress
        color="#9f1ee6" 
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
        options={{ showSpinner: false }}
      />
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}

export default FWFilmesApp;
