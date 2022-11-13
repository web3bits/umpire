import React, { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { useRouter } from "next/router";
import { Box, Typography, Button } from "@mui/material";
import { GlobalSpinner } from "../components/GlobalSpinner";
import { useGlobalClasses } from "../theme";

const useIndex = () => {
  const { push } = useRouter();
  const {
    connect,
    connectors: wagmiConnectors,
    isLoading,
    pendingConnector,
  } = useConnect();
  const { isConnected } = useAccount();
  const [connectors, setConnectors] = useState<any>();

  const handleConnect = (data: any) => {
    connect(data);
  };

  useEffect(() => {
    console.log("Wagmi connectors changed");
    setConnectors(wagmiConnectors);
  }, [wagmiConnectors]);
  useEffect(() => {
    if (isConnected) {
      push("/jobs/list").then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return {
    connectors,
    handleConnect,
    isLoading,
    isConnected,
    pendingConnector,
  };
};
function Index() {
  const classes = useGlobalClasses();
  const {
    connectors,
    handleConnect,
    isLoading,
    isConnected,
    pendingConnector,
  } = useIndex();

  const renderConnector = (connector: any) => {
    if (!connector) {
      return null;
    }

    return (
      <Box className={classes.centeredRow} key={connector.id}>
        <Button
          disabled={!connector.ready || isConnected || isLoading}
          onClick={() => handleConnect({ connector })}
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
    );
  };
  const renderConnectors = () => {
    return connectors?.map((connector: any) => renderConnector(connector));
  };
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

          {renderConnectors()}
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
