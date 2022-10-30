import * as React from "react";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import theme from "./theme";
import { BrowserRouter } from "react-router-dom";
import { MoralisProvider } from "react-moralis";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

root.render(
  <MoralisProvider
    appId={process.env.REACT_APP_MORALIS_APP_ID!}
    serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL!}
  >
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </MoralisProvider>
);
