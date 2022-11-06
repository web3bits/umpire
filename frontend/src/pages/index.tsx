import React from "react";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/evm-utils";
import { getSession } from "next-auth/react";

interface HomeInterface {
  address: string;
  nativeBalance: string;
}

export default function Index({ address, nativeBalance }: HomeInterface) {
  return <></>;
}

// This gets called on every page render
export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  // redirect if not authenticated
  const destination = session ? "/home" : "/signin";
  return {
    redirect: {
      destination,
      permanent: false,
      props: { user: session?.user ?? null },
    },
  };
}
