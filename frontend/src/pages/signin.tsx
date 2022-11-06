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
        callbackUrl: "/home",
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
      <Box className={classes.container}>
        <Box className={classes.centeredRow}>
          <Typography variant="h3">Welcome to Umpire</Typography>
        </Box>
        <Box className={classes.centeredRow}>
          <Typography variant="h6">Umpire is a ...</Typography>
        </Box>
        <Box className={classes.centeredRow}>
          <Button variant="outlined" onClick={handleAuth}>
            Sign in with Metamask
          </Button>
        </Box>
      </Box>
    );
  };
  return (
    <Box className={classes.container}>
      <GlobalSpinner />
      {renderHome()}
    </Box>
  );
}

export default SignIn;
