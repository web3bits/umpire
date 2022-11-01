import { Typography, Box, CircularProgress, Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useGlobalContext } from "../context/GlobalContext";

export const ALLOWED_NETWORK = process.env.REACT_APP_ALLOWED_NETWORK || "0x2a";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useGlobalContext();

  useEffect(() => {
    if (!user && !isLoading) {
      signOut({
        //@ts-ignore
        redirect: "/signin",
      });
    }
  }, [user, isLoading]);

  return children;
};
