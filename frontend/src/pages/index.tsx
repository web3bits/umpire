import React, { useEffect } from "react";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import { Box, Typography, Button, Alert } from "@mui/material";
import { GlobalSpinner } from "../components/GlobalSpinner";
import { useGlobalClasses } from "../theme";

function Index() {
  const classes = useGlobalClasses();
  const { push } = useRouter();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      push("/jobs/list").then();
    }
  }, [isConnected]);

  const renderHome = () => {
    return (
      <Box
        className={`${classes.centeredRow} ${classes.signinContainer} ${classes.background}`}
      >
        <Box id="loginBox">
          <Box className={classes.centeredRow}>
            <Typography variant="h3" className={classes.whiteFont}>
              Welcome to Umpire
            </Typography>
          </Box>
          <Box className={classes.centeredRow}>
            <Typography variant="h6" className={classes.whiteFont}>
              Umpire is a low-code backend solution for building hybrid dApps.
            </Typography>
          </Box>

          {connectors.map((connector) => (
            <Box className={classes.centeredRow} key={connector.id}>
              <Button
                disabled={!connector.ready || isConnected || isLoading}
                onClick={() => connect({ connector })}
                variant="outlined"
                className={classes.whiteButton}
              >
                Sign in using {connector.name}
                {!connector.ready && " (unsupported)"}
                {isLoading &&
                  connector.id === pendingConnector?.id &&
                  " (connecting)"}
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };
  return (
    <Box>
      <GlobalSpinner />
      {renderHome()}
    </Box>
  );
}

export default Index;
