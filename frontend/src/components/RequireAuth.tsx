import React, { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { useRouter } from "next/router";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { push } = useRouter();
  const { isLoading } = useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected && !isLoading) {
      push("/").then();
    }
  }, [isConnected, isLoading]);

  return children;
};
