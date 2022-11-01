import React from "react";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/evm-utils";

interface HomeInterface {
  address: string;
  nativeBalance: string;
}

export default function Home({ address, nativeBalance }: HomeInterface) {
  return (
    <>
      <h3>Wallet: {address}</h3>
      <h3>Native Balance: {nativeBalance} ETH</h3>
    </>
  );
}

// This gets called on every page render
export async function getServerSideProps(context: any) {
  // reads the api key from .env.local and starts Moralis SDK
  await Moralis.start({ apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY });

  const address = "0xB9aacD18C6D43d72a19FA8DAfc86043d6A22627C";

  const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
    chain: EvmChain.ETHEREUM,
    address,
  });

  return {
    props: {
      address,
      // Return the native balance formatted in ether via the .ether getter
      nativeBalance: nativeBalance.result.balance.ether,
    },
  };
}
