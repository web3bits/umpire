import React from "react";
import theme from "../theme";
import type { AppProps } from "next/app";
import {
  createClient,
  configureChains,
  defaultChains,
  WagmiConfig,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@mui/private-theming";
import { GlobalContextProvider } from "../context/GlobalContext";
const { provider, webSocketProvider } = configureChains(defaultChains, [
  publicProvider(),
]);

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    // @ts-ignore
    <GlobalContextProvider>
      <WagmiConfig client={client}>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </SessionProvider>
      </WagmiConfig>
    </GlobalContextProvider>
  );
}
