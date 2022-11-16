import React from "react";
import theme from "../theme";
import type { AppProps } from "next/app";
import { WagmiConfig } from "wagmi";
import { ThemeProvider } from "@mui/private-theming";
import { GlobalContextProvider } from "../context/GlobalContext";
import { wagmiClient } from "../utils/wagmiClient";
import "../../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalContextProvider>
      <WagmiConfig client={wagmiClient}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </WagmiConfig>
    </GlobalContextProvider>
  );
}
