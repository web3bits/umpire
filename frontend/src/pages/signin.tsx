import React from "react";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { signIn } from "next-auth/react";
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import axios from "axios";
import { Box, Typography, Button, Alert } from "@mui/material";
import { GlobalSpinner } from "../components/GlobalSpinner";
import { useGlobalContext } from "../context/GlobalContext";
import { useGlobalClasses } from "../theme";

const useSignIn = () => {
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { push } = useRouter();

  const { setLoading, isLoading, signInError, setSignInError } =
    useGlobalContext();
  const handleAuth = async () => {
    setLoading(true);
    setSignInError(false);
    try {
      if (isConnected) {
        await disconnectAsync();
      }

      const { account, chain } = await connectAsync({
        connector: new MetaMaskConnector(),
      });

      const userData = { address: account, chain: chain.id, network: "evm" };

      const { data } = await axios.post("/api/auth/request-message", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const message = data.message;

      const signature = await signMessageAsync({ message });

      // redirect user after success authentication to '/home' page
      // @ts-ignore
      const { url } = await signIn("credentials", {
        message,
        signature,
        redirect: false,
        callbackUrl: "/jobs/list",
      });
      /**
       * instead of using signIn(..., redirect: "/user")
       * we get the url from callback and push it to the router to avoid page refreshing
       */
      push(url);
    } catch (err: any) {
      setLoading(false);
      console.error(err);
    }
  };

  return {
    handleAuth,
    displayAlert: !isLoading && signInError,
  };
};

function SignIn() {
  const classes = useGlobalClasses();
  const { displayAlert, handleAuth } = useSignIn();

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
              Umpire is a ...
            </Typography>
          </Box>
          <Box className={classes.centeredRow}>
            <Button
              variant="outlined"
              onClick={handleAuth}
              className={classes.whiteButton}
            >
              Sign in with Metamask
            </Button>
          </Box>
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

export default SignIn;
